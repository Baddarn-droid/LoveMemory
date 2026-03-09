import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import { getStylePrompt, getClothingPromptText, getColourPromptText, FACE_PRESERVATION, FULL_FRAME_INSTRUCTION, PET_COMPOSITION_FIRST, PET_FACE_CENTER, PET_FRAMING_OVERRIDE, PET_HEADROOM, FAMILY_COMPOSITION_FIRST, FAMILY_FRAMING_OVERRIDE, FAMILY_HEADROOM, type CategoryId } from '@/lib/styles'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

Transform this photo into a beautiful, artistic portrait. Use soft professional lighting, elegant and timeless style. Make it look like a premium custom portrait — refined, high quality, and worthy of framing. Apply only subtle enhancement to the face.`

const VALID_CATEGORY_IDS: CategoryId[] = ['pets', 'family']

export async function POST(request: NextRequest) {
  const rawKey = process.env.OPENAI_API_KEY
  const apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: 'Invalid form data.' },
      { status: 400 }
    )
  }

  const file = formData.get('image')
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'No image provided.' },
      { status: 400 }
    )
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'File must be an image.' },
      { status: 400 }
    )
  }

  // Use prompt from request (frontend builds it so theme/style match; no secrets in frontend)
  const promptFromRequest = formData.get('prompt')
  let prompt: string
  if (typeof promptFromRequest === 'string' && promptFromRequest.trim().length > 0) {
    prompt = promptFromRequest.trim()
  } else {
    // Fallback: build from category/style (e.g. if an old client sends form fields instead of prompt)
    const categoryRaw = formData.get('category')
    const styleRaw = formData.get('style')
    const subStyleRaw = formData.get('subStyle')
    const colourOptionRaw = formData.get('colourOptionId')
    const petPoseRaw = formData.get('petPose')
    const clothingRaw = formData.get('clothingChoices')
    const categoryId = typeof categoryRaw === 'string' && VALID_CATEGORY_IDS.includes(categoryRaw as CategoryId) ? (categoryRaw as CategoryId) : null
    const styleId = typeof styleRaw === 'string' ? styleRaw : null
    const subStyleId = typeof subStyleRaw === 'string' ? subStyleRaw : undefined
    const colourOptionId = typeof colourOptionRaw === 'string' ? colourOptionRaw : undefined
    const petPose = typeof petPoseRaw === 'string' && (petPoseRaw === 'standing' || petPoseRaw === 'laying') ? petPoseRaw : undefined
    let clothingChoices: Record<string, string> = {}
    try {
      if (typeof clothingRaw === 'string') clothingChoices = JSON.parse(clothingRaw)
    } catch {
      /* ignore */
    }
    prompt = (categoryId && styleId && getStylePrompt(categoryId, styleId, subStyleId)) || DEFAULT_PROMPT
    if (categoryId && styleId) {
      prompt = prompt + '\n\n' + FULL_FRAME_INSTRUCTION
      if (categoryId === 'pets') {
        prompt = prompt + '\n\n' + PET_FRAMING_OVERRIDE
      }
      if (categoryId === 'family') {
        prompt = prompt + '\n\n' + FAMILY_FRAMING_OVERRIDE
      }
    }
    if (categoryId === 'pets') {
      prompt = PET_COMPOSITION_FIRST + '\n\n' + prompt
      prompt = prompt + '\n\n' + PET_FACE_CENTER + '\n\n' + PET_HEADROOM + '\n\nCOMPOSITION: Full or three-quarter view; not too zoomed in.'
      if (petPose) {
        const poseInstruction = petPose === 'standing'
          ? ' Pose the pet STANDING upright, facing the viewer, dignified noble stance.'
          : ' Pose the pet LAYING DOWN on a luxurious velvet cushion or pillow, relaxed and regal, surrounded by rich fabric.'
        prompt = prompt + poseInstruction
      }
      prompt = prompt + '\n\n' + PET_FACE_CENTER
    }
    if (categoryId === 'family') {
      prompt = FAMILY_COMPOSITION_FIRST + '\n\n' + prompt
      prompt = prompt + '\n\n' + FAMILY_HEADROOM + '\n\nCOMPOSITION: Gallery-worthy, balanced. Everyone in the picture must be fully visible.'
      prompt = prompt + '\n\n' + FAMILY_HEADROOM
    }
    if (colourOptionId) {
      prompt = prompt + getColourPromptText(colourOptionId)
    }
    if (categoryId) {
      prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
    }
  }

  const categoryFromForm = formData.get('category')
  const isPetRequest = typeof categoryFromForm === 'string' && categoryFromForm === 'pets'
  const isFamilyRequest = typeof categoryFromForm === 'string' && categoryFromForm === 'family'
  const needsTopPadding = isPetRequest || isFamilyRequest

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let pngBuffer: Buffer
    if (needsTopPadding) {
      // Extend upper frame: top padding so everyone/subject fits with space above (pets + family)
      const topPadding = 420
      const contentHeight = 1024 - topPadding
      const resized = await sharp(buffer)
        .resize(1024, contentHeight, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()
      const meta = await sharp(resized).metadata()
      const w = meta.width ?? 1024
      const h = meta.height ?? contentHeight
      const left = Math.round((1024 - w) / 2)
      const bottom = 1024 - topPadding - h
      pngBuffer = await sharp(resized)
        .extend({
          top: topPadding,
          bottom: Math.max(0, bottom),
          left,
          right: 1024 - w - left,
          background: { r: 45, g: 42, b: 38 },
        })
        .png()
        .toBuffer()
    } else {
      pngBuffer = await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()
    }

    const imageFile = await toFile(pngBuffer, 'image.png', { type: 'image/png' })

    const openai = new OpenAI({ apiKey })
    const result = await openai.images.edit({
      model: 'gpt-image-1.5',
      image: [imageFile],
      prompt,
      size: '1024x1024',
    })

    const first = result.data?.[0]
    if (!first) {
      return NextResponse.json(
        { error: 'No image was generated.' },
        { status: 500 }
      )
    }

    if ('b64_json' in first && first.b64_json) {
      return NextResponse.json({
        b64: first.b64_json,
      })
    }

    if ('url' in first && first.url) {
      return NextResponse.json({ url: first.url })
    }

    return NextResponse.json(
      { error: 'Unexpected response from OpenAI.' },
      { status: 500 }
    )
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : 'Image generation failed.'
    const isAuthError = rawMessage.includes('API key') || rawMessage.includes('401') || rawMessage.includes('Incorrect API key')
    const message = isAuthError
      ? 'Invalid or missing OpenAI API key. Check .env.local (exact name: OPENAI_API_KEY), restart the dev server, and run the diagnostic: open http://localhost:3000/api/test-openai in your browser. If you\'re on a deployed site (e.g. Vercel), set OPENAI_API_KEY in the host\'s environment variables.'
      : rawMessage
    console.error('generate-portrait error:', err)
    return NextResponse.json(
      { error: message },
      { status: isAuthError ? 401 : 500 }
    )
  }
}
