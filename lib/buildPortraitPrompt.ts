/**
 * Build the full prompt for portrait generation.
 * Used when sending to the backend so the frontend (public repo) never needs the backend's style logic.
 */
import {
  getStylePrompt,
  getClothingPromptText,
  FACE_PRESERVATION,
  FULL_FRAME_INSTRUCTION,
  type CategoryId,
} from './styles'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

Transform this photo into a beautiful, artistic portrait. Use soft professional lighting, elegant and timeless style. Make it look like a premium custom portrait — refined, high quality, and worthy of framing. Apply only subtle enhancement to the face.`

export function buildPortraitPrompt(options: {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  petPose?: 'standing' | 'laying'
  clothingChoices?: Record<string, string>
}): string {
  const { categoryId, styleId, subStyleId, petPose, clothingChoices } = options
  let prompt =
    (getStylePrompt(categoryId, styleId, subStyleId) || DEFAULT_PROMPT) + ''

  if (categoryId && styleId) {
    prompt = prompt + '\n\n' + FULL_FRAME_INSTRUCTION
  }
  if (categoryId === 'pets' && petPose) {
    const poseInstruction =
      petPose === 'standing'
        ? ' Pose the pet STANDING upright, facing the viewer, dignified noble stance.'
        : ' Pose the pet LAYING DOWN on a luxurious velvet cushion or pillow, relaxed and regal, surrounded by rich fabric.'
    prompt = prompt + poseInstruction
  }
  if (categoryId && clothingChoices && Object.keys(clothingChoices).length > 0) {
    prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
  }
  return prompt
}
