/**
 * Build the full prompt for portrait generation.
 * Used when sending to the backend so the frontend (public repo) never needs the backend's style logic.
 */
import {
  getStylePrompt,
  getStylePreset,
  getClothingPromptText,
  getColourPromptText,
  getStyleThemeLockPrompt,
  getPetThemeLockPrompt,
  PET_STYLE_SUFFIX,
  FACE_PRESERVATION,
  FACE_PRESERVATION_EMPHASIS,
  LIGHT_TOUCH_EDIT,
  FULL_FRAME_INSTRUCTION,
  FAMILY_EXACT_PEOPLE_COUNT,
  FAMILY_FACE_IDENTITY_FIRST,
  FAMILY_FACE_IDENTITY_EMPHASIS,
  FACE_TRYON_LOCK,
  FACE_TRYON_LOCK_PEOPLE,
  PEOPLE_FLATTERING_POLISH,
  PERIOD_CLOTHING_FIT,
  PET_COLLAR_FIT,
  PET_FULL_BODY_FRAME,
  PET_ANATOMY_LOCK,
  PET_WARDROBE_OVERRIDE,
  getPetPoseInstruction,
  type CategoryId,
} from './styles'

export type PetSpecies = 'cat' | 'horse' | 'dog'

const DEFAULT_PROMPT = `${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

${LIGHT_TOUCH_EDIT}`

const LIKENESS_CONTRACT_PETS = `LIKENESS CONTRACT (overrides every style instruction):
The output must be the SAME animal as the uploaded photo — same species, same face, same markings.
Keep the exact face geometry, eyes, muzzle, markings, and expression.
A generic AI animal or “similar looking” pet is a failed result.
The owner must instantly recognize their animal.
The animal must still be an animal: four legs, no human arms.`

const LIKENESS_CONTRACT_PEOPLE = `LIKENESS CONTRACT (overrides every style instruction):
The output must be the SAME people as the uploaded photo — a premium studio portrait of them, not new characters.
Keep the same face geometry, eyes, nose, mouth, age, ethnicity, and identity.
A stranger, celebrity lookalike, or heavily filtered fake face is a failed result.
They should look like themselves on a great day: recognizable, flattering, photoreal.`

function buildPeopleIdentityPrefix(): string {
  return [
    LIKENESS_CONTRACT_PEOPLE,
    FACE_TRYON_LOCK_PEOPLE,
    PEOPLE_FLATTERING_POLISH,
    LIGHT_TOUCH_EDIT,
    FAMILY_FACE_IDENTITY_FIRST,
    FACE_PRESERVATION,
    FAMILY_EXACT_PEOPLE_COUNT,
  ].join('\n\n')
}

function buildPeopleIdentitySuffix(): string {
  return [
    FAMILY_EXACT_PEOPLE_COUNT,
    FAMILY_FACE_IDENTITY_EMPHASIS,
    PEOPLE_FLATTERING_POLISH,
    FACE_TRYON_LOCK_PEOPLE,
    FACE_PRESERVATION_EMPHASIS,
  ].join('\n\n')
}

function speciesAnatomyLock(species?: PetSpecies): string {
  if (species === 'horse') {
    return `SPECIES LOCK — HORSE: This is a real horse. Four legs, hooves, mane, muzzle, tail. Horizontal equine body. NEVER a person in a horse mask. NEVER a red coat, gold braid, or human arms growing from a horse's shoulders.`
  }
  if (species === 'dog') {
    return `SPECIES LOCK — DOG: This is a real dog. Four legs ending in paws. NEVER a tweed jacket, shirt, or human arms. A dog wearing a human coat with sleeves is a failed image.`
  }
  if (species === 'cat') {
    return `SPECIES LOCK — CAT: This is a real cat. Four legs ending in paws. NEVER human arms, hands, or a jacket with sleeves.`
  }
  return `SPECIES LOCK: Keep the uploaded animal's species. Four animal legs. No human arms, no human clothes with sleeves.`
}

function buildPetPortraitPrompt(options: {
  styleId: string
  colourOptionId?: string
  petPose: 'standing' | 'laying'
  clothingChoices?: Record<string, string>
  petSpecies?: PetSpecies
}): string {
  const { styleId, colourOptionId, petPose, clothingChoices, petSpecies } = options
  const stylePreset = getStylePreset('pets', styleId)
  const styleTitle = stylePreset?.title ?? styleId

  return [
    LIKENESS_CONTRACT_PETS,
    `HARD RULES — if any are broken the image is wrong:
1. This is a REAL animal with FOUR LEGS. Zero human arms. Zero human hands. Zero fingers.
2. Horses: four HOOVES, mane, muzzle, horse body. NEVER a person in a horse costume. NEVER arms coming out of a doublet or military coat.
3. Dogs and cats: four LEGS ending in PAWS. NEVER jackets, coats, turtlenecks, or shirts with sleeves. NEVER standing like a person.
4. ${petPose === 'laying' ? 'The animal is LYING DOWN on a velvet cushion (recompose even if the photo is standing).' : 'The animal STANDS ON ALL FOUR LEGS, spine horizontal.'}
5. Keep the same face, markings, and species as the upload.
6. A horse or dog dressed as a human noble (arms + coat) is ALWAYS wrong — use a cloth on the back instead.`,
    speciesAnatomyLock(petSpecies),
    FACE_TRYON_LOCK,
    PET_ANATOMY_LOCK,
    getPetPoseInstruction(petPose),
    PET_WARDROBE_OVERRIDE,
    getPetThemeLockPrompt(styleId, styleTitle),
    `PHOTOREALISTIC photograph of the same pet — no painting, no cartoon, no furry biped.`,
    PET_FULL_BODY_FRAME,
    FULL_FRAME_INSTRUCTION,
    PET_COLLAR_FIT,
    colourOptionId ? getColourPromptText(colourOptionId, styleTitle, 'pets').trim() : '',
    clothingChoices && Object.keys(clothingChoices).length
      ? getClothingPromptText('pets', clothingChoices).trim()
      : '',
    PET_STYLE_SUFFIX,
    getPetPoseInstruction(petPose),
    `FINAL CHECK: count the limbs. You should see four animal legs (or tucked legs if lying), and NO human arms.`,
  ]
    .filter((block) => block && block.length > 0)
    .join('\n\n')
}

export function buildPortraitPrompt(options: {
  categoryId: CategoryId
  styleId: string
  subStyleId?: string
  colourOptionId?: string
  petPose?: 'standing' | 'laying'
  clothingChoices?: Record<string, string>
  petSpecies?: PetSpecies
}): string {
  const { categoryId, styleId, subStyleId, colourOptionId, clothingChoices } = options

  if (categoryId === 'pets') {
    return buildPetPortraitPrompt({
      styleId,
      colourOptionId,
      petPose: options.petPose ?? 'laying',
      clothingChoices,
      petSpecies: options.petSpecies,
    })
  }

  const stylePreset = getStylePreset(categoryId, styleId)
  const styleTitle = stylePreset?.title ?? styleId

  let prompt = buildPeopleIdentityPrefix() + '\n\n'

  prompt += getStyleThemeLockPrompt(styleId, styleTitle, categoryId) + '\n\n'

  prompt +=
    `SELECTED STYLE: "${styleTitle}" (id: ${styleId}). Match this style on clothing and background only — never on faces or fur.\n\n`

  prompt += (getStylePrompt(categoryId, styleId, subStyleId) || DEFAULT_PROMPT) + ''

  prompt +=
    '\n\nSTYLE SCOPE: Theme applies ONLY to clothing and background. Faces stay photorealistic photographs of the same people, with a subtle studio enhancement — no painting, illustration, or heavy beauty filter.'

  if (styleId) {
    prompt = prompt + '\n\n' + FULL_FRAME_INSTRUCTION
  }

  if (colourOptionId) {
    prompt = prompt + getColourPromptText(colourOptionId, styleTitle, categoryId)
  }
  if (clothingChoices && Object.keys(clothingChoices).length > 0) {
    prompt = prompt + getClothingPromptText(categoryId, clothingChoices)
  }

  prompt = prompt + '\n\n' + PERIOD_CLOTHING_FIT
  prompt = prompt + '\n\n' + buildPeopleIdentitySuffix()
  return prompt
}
