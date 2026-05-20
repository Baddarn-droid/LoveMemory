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
  PET_COMPOSITION_FIRST,
  PET_FACE_CENTER,
  PET_FRAMING_OVERRIDE,
  PET_HEADROOM,
  PET_FACE_IDENTITY_FIRST,
  PET_FACE_IDENTITY_EMPHASIS,
  FAMILY_COMPOSITION_FIRST,
  FAMILY_FRAMING_OVERRIDE,
  FAMILY_HEADROOM,
  FAMILY_EXACT_PEOPLE_COUNT,
  FAMILY_FACE_IDENTITY_FIRST,
  FAMILY_FACE_IDENTITY_EMPHASIS,
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
  const faceLock = FACE_EDIT_LOCK
  if (categoryId === 'pets') {
    return [
      faceLock,
      PET_FACE_IDENTITY_FIRST,
      NO_FILTER_FACE,
      FACE_PRESERVATION,
      LIGHT_TOUCH_EDIT,
      PET_COMPOSITION_FIRST,
    ].join('\n\n')
  }
  return [
    faceLock,
    FAMILY_FACE_IDENTITY_FIRST,
    NO_FILTER_FACE,
    FACE_PRESERVATION,
    LIGHT_TOUCH_EDIT,
    FAMILY_EXACT_PEOPLE_COUNT,
    FAMILY_COMPOSITION_FIRST,
  ].join('\n\n')
}

/** Final identity reminders — both categories */
function buildIdentitySuffix(categoryId: CategoryId): string {
  const parts: string[] = []
  if (categoryId === 'pets') {
    parts.push(PET_FACE_IDENTITY_EMPHASIS, PET_FACE_CENTER, PET_HEADROOM)
  }
  if (categoryId === 'family') {
    parts.push(
      FAMILY_EXACT_PEOPLE_COUNT,
      FAMILY_HEADROOM,
      'COMPOSITION: Gallery-worthy, balanced. Everyone in the picture must be fully visible.',
      FAMILY_FACE_IDENTITY_EMPHASIS
    )
  }
  parts.push(FACE_EDIT_LOCK, FACE_PRESERVATION_EMPHASIS, NO_FILTER_FACE, LIGHT_TOUCH_EDIT)
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
    '\n\nSTYLE SCOPE: The style instructions above apply ONLY to clothing, fabrics, and background. They do NOT apply to faces, skin, fur, or hair — those must remain unedited photographs from the source.'

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
    prompt =
      prompt +
      '\n\n' +
      PET_FACE_CENTER +
      '\n\n' +
      PET_HEADROOM +
      '\n\nCOMPOSITION: Full or three-quarter view; not too zoomed in. Gallery-worthy, balanced composition.'
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

  prompt =
    prompt +
    '\n\n' +
    (categoryId === 'family' ? PERIOD_CLOTHING_FIT : PET_COLLAR_FIT)

  prompt = prompt + '\n\n' + buildIdentitySuffix(categoryId)
  return prompt
}
