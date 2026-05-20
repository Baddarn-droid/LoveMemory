/**
 * Build the full prompt for portrait generation.
 * Used when sending to the backend so the frontend (public repo) never needs the backend's style logic.
 */
import {
  getStylePrompt,
  getStylePreset,
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
  FAMILY_FACE_IDENTITY_FIRST,
  FAMILY_FACE_IDENTITY_EMPHASIS,
  type CategoryId,
} from './styles'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

Light touch edit only: change clothing and background to match the selected style. Keep faces and hair as untouched photographs from the original. Minimal processing — no heavy filters, no painterly face effects.`

export function buildPortraitPrompt(options: {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  colourOptionId?: string
  petPose?: 'standing' | 'laying'
  clothingChoices?: Record<string, string>
}): string {
  const { categoryId, styleId, subStyleId, colourOptionId, petPose, clothingChoices } = options
  const stylePreset = getStylePreset(categoryId, styleId)
  let prompt =
    (getStylePrompt(categoryId, styleId, subStyleId) || DEFAULT_PROMPT) + ''

  if (stylePreset?.title) {
    prompt =
      `SELECTED STYLE: "${stylePreset.title}" (id: ${styleId}). The finished portrait MUST match this exact style — not a generic Renaissance court painting unless that is the selected style.\n\n` +
      prompt
  }

  if (categoryId === 'pets') {
    prompt = PET_COMPOSITION_FIRST + '\n\n' + prompt
  }
  if (categoryId === 'family') {
    prompt =
      FAMILY_FACE_IDENTITY_FIRST +
      '\n\n' +
      FACE_PRESERVATION +
      '\n\n' +
      FAMILY_EXACT_PEOPLE_COUNT +
      '\n\n' +
      FAMILY_COMPOSITION_FIRST +
      '\n\n' +
      prompt
  }
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
    prompt = prompt + '\n\n' + PET_FACE_CENTER + '\n\n' + PET_HEADROOM + '\n\nCOMPOSITION: Full or three-quarter view; not too zoomed in. Gallery-worthy, balanced composition.'
    if (petPose) {
      const poseInstruction =
        petPose === 'standing'
          ? ' Pose the pet STANDING upright, facing the viewer, dignified noble stance.'
          : ' Pose the pet LAYING DOWN on a luxurious velvet cushion or pillow, relaxed and regal, surrounded by rich fabric.'
      prompt = prompt + poseInstruction
    }
  }
  if (colourOptionId) {
    prompt = prompt + getColourPromptText(colourOptionId)
  }
  if (categoryId && clothingChoices && Object.keys(clothingChoices).length > 0) {
    prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
  }
  if (categoryId === 'pets') {
    prompt = prompt + '\n\n' + PET_FACE_CENTER
  }
  if (categoryId === 'family') {
    prompt = prompt + '\n\n' + FAMILY_EXACT_PEOPLE_COUNT
    prompt = prompt + '\n\n' + FAMILY_HEADROOM + '\n\nCOMPOSITION: Gallery-worthy, balanced. Everyone in the picture must be fully visible.'
    prompt = prompt + '\n\n' + FAMILY_FACE_IDENTITY_EMPHASIS
  }
  prompt = prompt + '\n\n' + FACE_PRESERVATION_EMPHASIS
  return prompt
}
