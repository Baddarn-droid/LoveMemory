/**
 * Build the full prompt for portrait generation.
 * Used when sending to the backend so the frontend (public repo) never needs the backend's style logic.
 */
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
} from './styles'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

Transform this photo into a beautiful, artistic portrait. Use soft professional lighting, elegant and timeless style. Make it look like a premium custom portrait — refined, high quality, and worthy of framing. Do not apply any filter or effect to faces; keep them identical to the original.`

export function buildPortraitPrompt(options: {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  colourOptionId?: string
  petPose?: 'standing' | 'laying'
  clothingChoices?: Record<string, string>
}): string {
  const { categoryId, styleId, subStyleId, colourOptionId, petPose, clothingChoices } = options
  let prompt =
    (getStylePrompt(categoryId, styleId, subStyleId) || DEFAULT_PROMPT) + ''

  if (categoryId === 'pets') {
    prompt = PET_COMPOSITION_FIRST + '\n\n' + prompt
  }
  if (categoryId === 'family') {
    // One-person rule first so model does not create a "family" from a single photo
    prompt = FAMILY_EXACT_PEOPLE_COUNT + '\n\n' + FAMILY_COMPOSITION_FIRST + '\n\n' + prompt
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
    prompt = prompt + '\n\n' + FAMILY_HEADROOM
  }
  // End with strong reminder: faces stay photorealistic, no paint/filter on face
  prompt = prompt + '\n\n' + FACE_PRESERVATION_EMPHASIS
  return prompt
}
