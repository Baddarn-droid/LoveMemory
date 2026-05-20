import { NextRequest, NextResponse } from 'next/server'
import type { CategoryId } from '@/lib/styles'
import { buildPortraitPrompt } from '@/lib/buildPortraitPrompt'
import { generatePortraitImage } from '@/lib/portraitGeneration'

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
        : 'family'
    const styleId = typeof styleRaw === 'string' ? styleRaw : 'renaissance'
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
    prompt = buildPortraitPrompt({
      categoryId,
      styleId,
      subStyleId,
      colourOptionId,
      petPose,
      clothingChoices: Object.keys(clothingChoices).length ? clothingChoices : undefined,
    })
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
      tier: 'preview',
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
