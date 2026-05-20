import { NextRequest, NextResponse } from 'next/server'
import {
  getStylePrompt,
  getClothingPromptText,
  getColourPromptText,
  FACE_PRESERVATION,
  FACE_PRESERVATION_EMPHASIS,
  FULL_FRAME_INSTRUCTION,
  PET_COMPOSITION_FIRST,
  PET_FACE_CENTER,
  PET_FRAMING_OVERRIDE,
  PET_HEADROOM,
  FAMILY_COMPOSITION_FIRST,
  FAMILY_FRAMING_OVERRIDE,
  FAMILY_HEADROOM,
  FAMILY_EXACT_PEOPLE_COUNT,
  type CategoryId,
} from '@/lib/styles'
import { generatePortraitImage } from '@/lib/portraitGeneration'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

Transform this photo into a beautiful, artistic portrait. Use soft professional lighting, elegant and timeless style. Make it look like a premium custom portrait — refined, high quality, and worthy of framing. Do not apply any filter or effect to faces; keep them identical to the original.`

const VALID_CATEGORY_IDS: CategoryId[] = ['pets', 'family']

export async function POST(request: NextRequest) {
  const rawKey = process.env.OPENAI_API_KEY
  const apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not configured.' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('image')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided.' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image.' }, { status: 400 })
  }

  const promptFromRequest = formData.get('prompt')
  let prompt: string
  if (typeof promptFromRequest === 'string' && promptFromRequest.trim().length > 0) {
    prompt = promptFromRequest.trim()
  } else {
    const categoryRaw = formData.get('category')
    const styleRaw = formData.get('style')
    const subStyleRaw = formData.get('subStyle')
    const colourOptionRaw = formData.get('colourOptionId')
    const petPoseRaw = formData.get('petPose')
    const clothingRaw = formData.get('clothingChoices')
    const categoryId =
      typeof categoryRaw === 'string' && VALID_CATEGORY_IDS.includes(categoryRaw as CategoryId)
        ? (categoryRaw as CategoryId)
        : null
    const styleId = typeof styleRaw === 'string' ? styleRaw : null
    const subStyleId = typeof subStyleRaw === 'string' ? subStyleRaw : undefined
    const colourOptionId = typeof colourOptionRaw === 'string' ? colourOptionRaw : undefined
    const petPose =
      typeof petPoseRaw === 'string' && (petPoseRaw === 'standing' || petPoseRaw === 'laying')
        ? petPoseRaw
        : undefined
    let clothingChoices: Record<string, string> = {}
    try {
      if (typeof clothingRaw === 'string') clothingChoices = JSON.parse(clothingRaw)
    } catch {
      /* ignore */
    }
    prompt = (categoryId && styleId && getStylePrompt(categoryId, styleId, subStyleId)) || DEFAULT_PROMPT
    if (categoryId && styleId) {
      prompt = prompt + '\n\n' + FULL_FRAME_INSTRUCTION
      if (categoryId === 'pets') prompt = prompt + '\n\n' + PET_FRAMING_OVERRIDE
      if (categoryId === 'family') prompt = prompt + '\n\n' + FAMILY_FRAMING_OVERRIDE
    }
    if (categoryId === 'pets') {
      prompt = PET_COMPOSITION_FIRST + '\n\n' + prompt
      prompt =
        prompt +
        '\n\n' +
        PET_FACE_CENTER +
        '\n\n' +
        PET_HEADROOM +
        '\n\nCOMPOSITION: Full or three-quarter view; not too zoomed in.'
      if (petPose) {
        const poseInstruction =
          petPose === 'standing'
            ? ' Pose the pet STANDING upright, facing the viewer, dignified noble stance.'
            : ' Pose the pet LAYING DOWN on a luxurious velvet cushion or pillow, relaxed and regal, surrounded by rich fabric.'
        prompt = prompt + poseInstruction
      }
      prompt = prompt + '\n\n' + PET_FACE_CENTER
    }
    if (categoryId === 'family') {
      prompt = FAMILY_EXACT_PEOPLE_COUNT + '\n\n' + FAMILY_COMPOSITION_FIRST + '\n\n' + prompt
      prompt = prompt + '\n\n' + FAMILY_EXACT_PEOPLE_COUNT
      prompt =
        prompt +
        '\n\n' +
        FAMILY_HEADROOM +
        '\n\nCOMPOSITION: Gallery-worthy, balanced. Everyone in the picture must be fully visible.'
      prompt = prompt + '\n\n' + FAMILY_HEADROOM
    }
    if (colourOptionId) prompt = prompt + getColourPromptText(colourOptionId)
    if (categoryId) prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
    prompt = prompt + '\n\n' + FACE_PRESERVATION_EMPHASIS
  }

  const categoryFromForm = formData.get('category')
  const categoryId =
    typeof categoryFromForm === 'string' && VALID_CATEGORY_IDS.includes(categoryFromForm as CategoryId)
      ? (categoryFromForm as CategoryId)
      : null

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const b64 = await generatePortraitImage({
      apiKey,
      sourceBuffer: buffer,
      prompt,
      category: categoryId,
    })

    return NextResponse.json({ b64 })
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : 'Image generation failed.'
    const isAuthError =
      rawMessage.includes('API key') || rawMessage.includes('401') || rawMessage.includes('Incorrect API key')
    const message = isAuthError
      ? "Invalid or missing OpenAI API key. Check .env.local (exact name: OPENAI_API_KEY), restart the dev server, and run the diagnostic: open http://localhost:3000/api/test-openai in your browser. If you're on a deployed site (e.g. Vercel), set OPENAI_API_KEY in the host's environment variables."
      : rawMessage
    console.error('generate-portrait error:', err)
    return NextResponse.json({ error: message }, { status: isAuthError ? 401 : 500 })
  }
}
