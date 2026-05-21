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
  LIGHT_TOUCH_EDIT,
  FULL_FRAME_INSTRUCTION,
  PET_FACE_IDENTITY_FIRST,
  PET_FACE_IDENTITY_EMPHASIS,
  FAMILY_EXACT_PEOPLE_COUNT,
  FAMILY_FACE_IDENTITY_FIRST,
  FAMILY_FACE_IDENTITY_EMPHASIS,
  FACE_TRYON_LOCK,
  FACE_EDIT_LOCK,
  NO_FILTER_FACE,
  PERIOD_CLOTHING_FIT,
  PET_COLLAR_FIT,
  type CategoryId,
} from './styles'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

${LIGHT_TOUCH_EDIT}`

/** Identity + light-touch prefix — same structure for pets and family on every style */
function buildIdentityPrefix(categoryId: CategoryId): string {
  const core = [FACE_TRYON_LOCK, FACE_EDIT_LOCK, NO_FILTER_FACE, LIGHT_TOUCH_EDIT]
  if (categoryId === 'pets') {
    return [...core, PET_FACE_IDENTITY_FIRST, FACE_PRESERVATION].join('\n\n')
  }
  return [...core, FAMILY_FACE_IDENTITY_FIRST, FACE_PRESERVATION, FAMILY_EXACT_PEOPLE_COUNT].join('\n\n')
}

/** Final identity reminders — both categories */
function buildIdentitySuffix(categoryId: CategoryId): string {
  const parts: string[] = []
  if (categoryId === 'pets') {
    parts.push(PET_FACE_IDENTITY_EMPHASIS)
  }
  if (categoryId === 'family') {
    parts.push(FAMILY_EXACT_PEOPLE_COUNT, FAMILY_FACE_IDENTITY_EMPHASIS)
  }
  parts.push(FACE_TRYON_LOCK, FACE_PRESERVATION_EMPHASIS, NO_FILTER_FACE)
  return parts.join('\n\n')
}

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

  let prompt = buildIdentityPrefix(categoryId) + '\n\n'

  if (stylePreset?.title) {
    prompt +=
      `SELECTED STYLE: "${stylePreset.title}" (id: ${styleId}). Match this style on clothing and background only — never on faces or fur.\n\n`
  }

  prompt += (getStylePrompt(categoryId, styleId, subStyleId) || DEFAULT_PROMPT) + ''

  prompt +=
    '\n\nSTYLE SCOPE: Theme applies ONLY to clothing and background. The ENTIRE image must stay a sharp, unfiltered photograph — no painting, illustration, or AI filter look anywhere.'

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

  if (colourOptionId) {
    prompt = prompt + getColourPromptText(colourOptionId)
  }
  if (categoryId && clothingChoices && Object.keys(clothingChoices).length > 0) {
    prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
  }

  prompt =
    prompt +
    '\n\n' +
    (categoryId === 'family' ? PERIOD_CLOTHING_FIT : PET_COLLAR_FIT)

  prompt = prompt + '\n\n' + buildIdentitySuffix(categoryId)
  return prompt
}
