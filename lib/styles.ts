/**
 * Portrait categories and style presets.
 * Currently using Renaissance style across all categories.
 * Easy to extend: add new styles to each category's styles array.
 */

export type CategoryId = 'pets' | 'family'

export interface StylePreset {
  id: string
  title: string
  description: string
  /** Prompt text sent to the image model for this style */
  promptText: string
  /** Optional: path to preview image */
  thumbnail?: string
  /** Optional: sub-style variants (e.g. Florentine Renaissance, Baroque Red) */
  subStyles?: RenaissanceSubStyle[]
}

/** Sub-styles within Renaissance (Florentine, Baroque, Rococo, etc.) */
export interface RenaissanceSubStyle {
  id: string
  title: string
  description: string
  /** Prompt addition/modifier for this sub-style */
  promptModifier: string
  /** Color swatches as hex (e.g. ['#8B4513', '#D2B48C']) */
  colors: string[]
}

export interface CategoryConfig {
  id: CategoryId
  label: string
  slug: string
  /** Short tagline for the category page */
  tagline: string
  styles: StylePreset[]
}

/** Shared sub-styles for all Renaissance variants */
export const RENAISSANCE_SUB_STYLES: RenaissanceSubStyle[] = [
  {
    id: 'florentine',
    title: 'Florentine Renaissance',
    description: 'Burgundy silk, cream undershirts, and a dark classical studio.',
    promptModifier: `Florentine Renaissance style inspired by Botticelli and early Italian masters.
CLOTHING & FABRICS: Wear flowing robes in deep burgundy/maroon (#6B2D2D), cream silk undershirts (#FFFFFF), and golden tan brocade accents (#C4A574). Delicate gold jewelry (#D4AF37). Dark charcoal background (#2C2C2C).
STYLE: Photorealistic — rich fabric colours and studio background only. Warm natural light. No artistic filters.`,
    colors: ['#6B2D2D', '#C4A574', '#FFFFFF', '#D4AF37', '#2C2C2C'],
  },
  {
    id: 'renaissance-sky',
    title: 'Renaissance Sky',
    description: 'Atmospheric Renaissance style with dramatic lighting and old master quality.',
    promptModifier: `Renaissance Sky / Caravaggio style with dramatic chiaroscuro.
CLOTHING & FABRICS: Wear dark brown leather and earth-toned robes (#3D2C1E), silver-grey silk accents (#9E9E9E), white lace collars (#FFFFFF). Gold chain jewelry (#D4AF37). Deep navy blue atmospheric background (#1A2A3A).
STYLE: Photorealistic dramatic studio lighting on background and garments only. Natural photo quality.`,
    colors: ['#3D2C1E', '#9E9E9E', '#FFFFFF', '#D4AF37', '#1A2A3A'],
  },
  {
    id: 'baroque-red',
    title: 'Baroque Red',
    description: 'Classic royal portrait with rich velvet drapes and golden baroque frames.',
    promptModifier: `Baroque royal portrait style, 17th-century European court.
CLOTHING & FABRICS: Wear vibrant crimson and deep red velvet (#8B0000), golden brocade embroidery (#D4AF37), silver-trimmed accessories (#C0C0C0), white ruffs (#FFFFFF). Olive green velvet accents (#6B8E23). Rich velvet drapes in background.
STYLE: Photorealistic opulent garments and background. Jewel tones. Natural photograph — no filters.`,
    colors: ['#8B0000', '#D4AF37', '#C0C0C0', '#FFFFFF', '#6B8E23'],
  },
  {
    id: 'rococo',
    title: 'Pastel Court Silks',
    description: 'Mint silk, rose satin, and cream brocade in an 18th-century court palette.',
    promptModifier: `Rococo style, 18th-century French court aesthetic.
CLOTHING & FABRICS: Wear pale mint green silk (#4A7C59), light pink satin and rose accents (#E8A0A0), white lace and ribbons (#FFFFFF), cream and tan brocade (#C4A574). Golden decorative elements (#D4AF37).
STYLE: Photorealistic pastel garments and background. Natural photograph — no painterly or soft filters.`,
    colors: ['#4A7C59', '#E8A0A0', '#FFFFFF', '#C4A574', '#D4AF37'],
  },
]

/** Whole-image photoreal mandate — theme on clothes/background only, no filters anywhere */
export const PHOTOREALISTIC_WHOLE_IMAGE = `PHOTOREALISTIC PHOTOGRAPH — ENTIRE IMAGE (mandatory, all categories):
- Output must look like a professional camera photograph — NOT a painting, illustration, watercolour, or AI art
- Apply the selected THEME only via period clothing, fabrics, props, and background setting
- ZERO filters on the whole picture: no painterly effect, no dreamy haze, no Instagram/Snapchat look, no illustration
- Sharp natural detail everywhere — background, clothing, skin, fur — like a real camera photo
- Theme = wardrobe + environment. People may have a subtle studio polish; pets stay unretouched`

/** OpenAI virtual try-on face lock — pets: exact identity, no glamour */
export const FACE_TRYON_LOCK = `VIRTUAL TRY-ON EDIT (mandatory — pets):
Keep the SAME animal: do NOT change face, facial features, fur, markings, eye colour, muzzle, ears, expression, or identity.
You MAY fully recompose the BODY (lying down or standing on four legs) when a pose is specified — even if the upload is standing.
Preserve exact likeness from the upload — no beautification, no smoothing, no filters on the animal.
Theme goes on background, collar, and cloth draped on an animal body — not a human outfit.
If the face looks like a different animal, the edit has FAILED.
If the pet has human arms or stands like a person, the edit has FAILED.`

/** People / family: same person, with a sellable studio polish */
export const FACE_TRYON_LOCK_PEOPLE = `VIRTUAL TRY-ON EDIT (mandatory — people and families):
Edit clothing and background to match the selected theme.
Every person must still be instantly recognizable as themselves — same face shape, bone structure, eyes, nose, mouth, age, ethnicity, and hairstyle.
Apply a tasteful professional portrait enhancement: flattering light, even complexion, reduced redness and blemishes, slightly brighter eyes, tidy hair.
This is a premium studio portrait of the same people — not a raw snapshot, not a plastic beauty filter, not a different face.
If someone looks like a stranger or a celebrity stand-in, the edit has FAILED.`

/** Virtual try-on edit lock — must be first in every prompt (OpenAI cookbook pattern) */
export const FACE_EDIT_LOCK = FACE_TRYON_LOCK

/** Pets only — no glamour retouch on animals */
export const NO_FILTER_FACE = `ZERO FILTERS ON FACES (mandatory — pets):
- Copy the animal's face from the source photo unchanged — treat it as a locked layer that must NOT be repainted
- Faces must look like unedited photographs: raw, sharp, natural — NOT retouched or beautified
- Preserve natural fur texture: fine detail, natural shadows, exact markings and tone from the upload
- FORBIDDEN on any pet face: beauty filter, smoothing, airbrush, soft glow, painterly or AI face enhancement`

/** People / family — flattering but still them (premium product look) */
export const PEOPLE_FLATTERING_POLISH = `PREMIUM PORTRAIT POLISH (people and families only — keep it subtle):
- Goal: the customer still thinks “that’s me / that’s us”, but looking their best — like a skilled photographer plus light retouching
- ALLOW: even, flattering studio lighting; reduce temporary blemishes, shine, redness, under-eye tiredness; slightly smoother (still real) skin; catchlights in the eyes; neat flyaway hair; a healthy, well-rested look
- KEEP: the same face, age, weight, bone structure, distinctive features (moles, freckles, scars that identify them), natural skin tone, and real hair
- FORBIDDEN: a different person, younger by many years, extreme slimming, swapped nose/eyes/jaw, porcelain doll skin, heavy Instagram/Snapchat filter, cartoon or painted faces
- ZERO painterly filters on faces — photorealistic photograph only, just a more attractive version of the same people`

/** Correct period clothing layering — prevents tie/cravat outside shirt */
export const PERIOD_CLOTHING_FIT = `CLOTHING FIT & LAYERING (mandatory for people):
- Cravats, neckties, and ascots must be worn INSIDE the shirt collar — knotted at the neck with collar points properly over the neckwear
- NEVER place a tie, cravat, or bow tie floating OUTSIDE or ON TOP of an open shirt collar — that is incorrect
- Dress shirts buttoned correctly at the collar when formal neckwear is worn; waistcoat and jacket lapels sit naturally over the shirt
- Ruffs and lace collars encircle the neckline at the base of the neck — integrated with the garment, not floating detached on top of the shirt
- All clothing must look physically correct: no impossible layering, no accessories clipping through fabric`

/** Pet costume/collar placement */
export const PET_COLLAR_FIT = `COLLAR & COSTUME FIT (mandatory for pets):
- Collars, capes, and costumes sit around the neck and drape over the BACK — never covering eyes, muzzle, nose, or ears
- Capes are blankets/cloth on an animal body, not human coats with sleeves
- Accessories must attach naturally; no floating elements through fur`

/** Pets stay animals — no human arms, hands, or bipedal “nobleman” bodies */
export const PET_ANATOMY_LOCK = `QUADRUPED ANATOMY (mandatory — this overrides every clothing instruction):
- This is a REAL dog, cat, horse, or other pet — NOT a person, NOT a mascot, NOT a bipedal cartoon.
- Dogs have NO ARMS. Cats have NO ARMS. Horses have NO ARMS. Front limbs are LEGS ending in PAWS (dogs/cats) or HOOVES (horses).
- NEVER add human arms, hands, fingers, wrists, biceps, gloves, or a human torso. NEVER put a jacket or doublet on a dog — those need arms, so they are forbidden.
- NEVER stand a dog or cat on its hind legs. NEVER give a pet a vertical human posture.
- FORBIDDEN: sleeves, holding a sword/sceptre, anthropomorphic “furry” bodies, animal head on a human body.
- Royal look = jewelled collar + cloth draped over the BACK like a blanket + velvet cushion. That is the entire costume.`

/** Translate “wear clothing” so the model does not grow arms to fit a doublet */
export const PET_WARDROBE_OVERRIDE = `PET WARDROBE (overrides “wear / replace clothing” above):
Whenever this prompt mentions clothing, robes, dresses, doublets, jackets, sleeves, armour, or “dress the subject”, interpret it as:
- a jewelled or fabric collar at the neck, AND/OR
- a piece of period cloth draped over the animal’s back, withers, and haunches (like a horse caparison or a dog blanket).
Do NOT invent arms to put clothes on. Do NOT use sleeves. Do NOT put the pet in a human outfit.`

export function getPetPoseInstruction(pose: 'standing' | 'laying'): string {
  if (pose === 'standing') {
    return `BODY POSE — STANDING ON ALL FOURS:
Four legs on the floor. Horse/dog/cat spine roughly horizontal, like a real animal. Not bipedal. No arms.`
  }
  return `BODY POSE — LYING DOWN (do not copy the upload pose):
Recompose the SAME animal lying on a velvet cushion or draped sofa.
Belly or flank on the cushion. Legs tucked or stretched — paws or hooves, never hands.
Head can look at the camera. The body is DOWN, not standing, not sitting like a person.
If the photo shows a standing horse or dog, the output must still be lying down.`
}

/** Shared light-touch generation instruction — applies to pets and family on every style */
export const LIGHT_TOUCH_EDIT = `THEME-ONLY EDIT (all categories):
- Change clothing, accessories, and background to match the selected theme
- Keep the whole image looking like an unfiltered photograph — no AI processing look
- Sharp detail, natural colours, real textures throughout the entire picture`

/** Pets: theme is scene + drape, not a human wardrobe; pose may change */
export const PET_THEME_EDIT = `PET SCENE EDIT (mandatory):
- Change background, cushion, collar, and optional cloth on the BACK to match the theme
- You MUST change the body pose when a lying-down or standing-on-all-fours pose is specified, even if the upload is standing
- Do NOT add human arms or clothes with sleeves. Dogs cannot wear jackets.
- Keep the whole image looking like an unfiltered photograph`

/** Base instruction for face preservation — recognizable photographs, not paintings */
export const FACE_PRESERVATION = `CRITICAL - FACE PRESERVATION:
- Keep every face (person or animal) COMPLETELY recognizable. Faces must look like real photographs, not paintings.
- Do NOT apply oil painting texture, brushstrokes, illustration, or artistic stylization to the face, skin, fur, or hair.
- For people: keep the same person and hairstyle (colour, length, cut, texture, parting); a light flattering polish is OK
- For pets: preserve fur colour, pattern, and markings on the face exactly — no glamour retouch
- Apply the artistic style to clothing, background, and surroundings only
- The customer must instantly recognize themselves or their pet`

/** Pet portraits: identity lock — must be first in prompt */
export const PET_FACE_IDENTITY_FIRST = `HIGHEST PRIORITY — PET IDENTITY. The owner MUST instantly recognize their pet. This overrides all artistic style instructions below.

FACE & HEAD — must match the upload exactly:
- Same eyes, nose, muzzle, whiskers, expression, ear shape, markings, and fur colour/pattern on the face
- Photorealistic — sharp, clear, completely unfiltered. NO oil paint, brushstrokes, soft focus, smoothing, or beautification on the face or head fur
- Natural fur texture with real detail — like a sharp photograph, not a soft illustration
- Treat the pet's face as a photograph composited unchanged — do NOT repaint the face

BODY FUR — preserve exact coat colour, pattern, and markings from the original photo
- Optional costume, collar, or cape on the body only — never covering or repainting the face
- Headwear may sit ON TOP of ears/fur only — do not replace or paint over the head

ONLY stylize: collar, cloth draped on the back, cushion, background, and scene — never human clothes with sleeves.`

/** Repeated at end of pet prompts */
export const PET_FACE_IDENTITY_EMPHASIS = `FINAL REMINDER — PET IDENTITY: Face, fur, markings, and expression must match the upload — photorealistic, zero filters. The owner must recognize their pet instantly. Style applies to costume and background ONLY.`

/** Family/couple: identity lock — same people, slightly enhanced */
export const FAMILY_FACE_IDENTITY_FIRST = `HIGHEST PRIORITY — IDENTITY (HUMANS). The customer MUST instantly recognize every person as themselves — an enhanced studio version of the same people, never replacements.

FACE — same people, looking their best:
- Same face shape, jaw, cheeks, forehead, chin, eye shape and colour, nose, mouth, lips, eyebrows, ethnicity, and overall age
- Do NOT alter gender presentation or any identifying facial attributes
- Photorealistic premium portrait: flattering light, even complexion, reduced blemishes and tiredness, still clearly them
- Keep distinctive moles and freckles; soften only temporary flaws (spots, shine, redness)
- Not a painted portrait, not a Snapchat filter, not a different face

HAIR — same hair, tidied:
- Same hair colour, length, cut, texture, curl, volume, and parting as the original photo
- Neaten flyaways only. Do NOT restyle, recolour, shorten, or give period/Victorian/Renaissance hairstyles
- Optional headwear may sit ON TOP of the existing hair only — never replace the hair

ONLY restyle: clothing, body garments, jewellery, and background.`

/** Repeated at end of family prompts */
export const FAMILY_FACE_IDENTITY_EMPHASIS = `FINAL REMINDER — PEOPLE: Instantly recognizable as the same individuals, with a tasteful studio enhancement. Photorealistic, not painted. Clothes and background carry the theme. Do NOT swap faces or over-beautify into strangers.`

/** Repeated at end of prompt: faces stay photorealistic; people may be lightly polished */
export const FACE_PRESERVATION_EMPHASIS = `REMINDER - FACES AND HAIR: Do NOT apply oil painting, brushstrokes, or any art style to the face, skin, or hairstyle. Pets: unchanged likeness. People: same person, slightly enhanced studio look. Style goes on clothes and background only.`

/** For pet portraits: put this FIRST in the prompt so the model prioritizes it. */
export const PET_COMPOSITION_FIRST = `COMPOSITION (highest priority): In the output image, the animal's face must be in the CENTER of the frame — not at the top. Leave clear empty space ABOVE the head. Wrong: face near top edge. Right: face in the middle with space above. Apply this composition first, then the style below.`

/** For pet portraits: face must be dead center, not at top. Export for use in buildPortraitPrompt and API. */
export const PET_FACE_CENTER = `MANDATORY - CENTER THE FACE (NOT AT THE TOP): The animal's face must be in the exact center of the image — both horizontally AND vertically. Do NOT place the head or face near the top of the frame. Leave generous space ABOVE the head so the eyes and nose sit in the vertical middle of the image. Equal space on left and right of the face, and roughly equal space above and below the head so the face is in the center, not at the top.`

/** Override "keep same framing" for pets so we can demand centered composition. */
export const PET_FRAMING_OVERRIDE = `For this pet portrait only: ignore "keep the same framing". Reposition the subject so the face is in the center of the image with space above the head.`

/** Explicit headroom so mane, ears, and headwear are never cropped. */
export const PET_HEADROOM = `CRITICAL — UPPER FRAME: Leave generous empty space above the subject. The ENTIRE top of the head, ears, mane, and any headwear (crown, hat, cap, tiara) must be fully visible with clear space above them. Never crop or cut off the top of the head, ears, mane, or headwear.`

/** Family: composition so everyone is fully visible and centred. */
export const FAMILY_COMPOSITION_FIRST = `COMPOSITION (highest priority): In the output image, show EVERY person in the photo fully — no one cropped or cut off. Center the group in the frame. Leave clear space above the highest head (including any headwear). Everyone's face and head must be fully visible with space above. Apply this composition first, then the style below.`

/** Family: override "keep same framing" so we can demand full visibility. */
export const FAMILY_FRAMING_OVERRIDE = `For this family portrait only: ignore "keep the same framing". Show every family member completely in frame with comfortable space around the group.`

/** Family: headroom so no heads or headwear are cropped. */
export const FAMILY_HEADROOM = `CRITICAL — UPPER FRAME: Leave generous empty space above the group. The ENTIRE top of every person's head and any headwear (hats, crowns, hair) must be fully visible with clear space above. Never crop or cut off anyone's head or headwear. Everything in the picture must be seen.`

/** Family/couple: output must have the exact same number of people — especially ONE person must stay ONE. */
export const FAMILY_EXACT_PEOPLE_COUNT = `CRITICAL — SAME NUMBER OF PEOPLE (DO NOT IGNORE):
- If the photo shows ONE person, the output must show exactly ONE person. Do NOT add a spouse, children, or duplicate the person to make a "family". One person in = one person out. Single portrait only.
- If the photo shows TWO people (a couple), show exactly two people. No extra figures.
- If the photo shows 3, 4, or 5 people, show exactly that many. Never add, duplicate, or remove anyone.
- Do NOT create a family portrait from a single-person photo. Do NOT clone or copy the person multiple times.`

/** Ensures the full subject is visible — no cropping or zooming that cuts off face/body */
export const FULL_FRAME_INSTRUCTION = `CRITICAL - FRAMING AND COMPOSITION (do not zoom in):
- Pull the camera BACK. Show the WHOLE subject with clear space around them — never a tight close-up of the face or muzzle.
- For pets: the entire animal must be in frame — head, ears, neck, body, legs/paws, and tail. Do NOT crop a cat to just the head and ruff. If the upload is already a full pet, keep it full; if it is a close crop, still pull back enough to show the body.
- For people: show at least head-and-shoulders with generous space; if the upload is full body or a group, keep everyone fully visible.
- Do NOT crop, zoom in, or cut off ears, paws, tail, hats, or limbs at the edges.
- Leave breathing room above the head and below the feet/paws.`

/** Extra pet pull-back — models otherwise default to a face close-up */
export const PET_FULL_BODY_FRAME = `PET FRAMING (mandatory — overrides close-up portraits):
- This is a FULL PET portrait of a real animal, not a face crop and not a person.
- Wrong: zoomed muzzle; human arms; a horse standing like a man; body cut off.
- Right: whole animal in the middle of the picture — four legs visible (or tucked if lying down), costume draped on the body, space around the subject.`

const RENAISSANCE_BASE = `Edit this photo: replace clothing and background with Renaissance noble styling (15th-16th century European). Do NOT alter the face, skin, or hair.

${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

ADD RENAISSANCE ELEMENTS (clothing and background only — never faces or hair):
- Replace clothing with period-appropriate attire (specific colors and styles come from the chosen sub-style)
- Add period jewellery at neck/chest: pearl necklaces, gold chains, brooches — not on faces
- Use rich fabrics: velvet, silk, brocade on garments only
- Add a classical background (colors and style from chosen sub-style)

ARTISTIC STYLE (background and clothing only — entire image stays photoreal):
- Photorealistic themed clothing and background — NOT a painting or illustration
- Use the exact color palette specified for clothing, jewelry, and background
- Sharp camera-photo quality throughout
- NO filters, NO soft focus, NO painterly effects on any part of the image`

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'pets',
    label: 'Pet Portraits',
    slug: 'pets',
    tagline: 'Turn a phone snap of your dog or cat into a gift they’ll hang on the wall',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Velvet, gold, and a classical studio — still clearly your pet, in period dress.',
        promptText: `${RENAISSANCE_BASE}

FOR PETS SPECIFICALLY:
- Face and fur on the head must remain photorealistic and identical to the upload
- Dogs, cats, and horses have four legs and no arms. Never bipedal. Never sleeves.
- Drape period fabric on the animal (cape, collar, cushion) — do not dress it as a person
- Small jeweled collar at neck only if chosen — never obscuring the face
- Place the animal on a velvet cushion or ornate furniture in a period interior`,
      },
    ],
  },
  {
    id: 'family',
    label: 'Family & You',
    slug: 'family-couple',
    tagline: 'You, a couple, or the whole family — still recognisably you, looking your best',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Velvet robes and a classical studio — still clearly you, in 15th–16th century dress.',
        promptText: `${RENAISSANCE_BASE}

FOR FAMILIES & COUPLES:
- Faces and hair must remain photorealistic and identical to the upload — see identity rules above
- Dress each person in coordinated period attire appropriate to their age — clothing only, not faces
- Add family or couple jewellery at neck/chest only — not altering facial features
- Create a formal portrait composition with natural poses`,
      },
    ],
  },
]

const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]))
const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]))

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categoryBySlug.get(slug)
}

export function getCategoryById(id: CategoryId): CategoryConfig | undefined {
  return categoryById.get(id)
}

/** Header nav — gift paths first; logo covers Home */
export function getHeaderNavLinks(): { href: string; label: string }[] {
  return [
    { href: '/pets', label: 'Pets' },
    { href: '/family-couple', label: 'Family & You' },
    { href: '/contact', label: 'Contact' },
  ]
}

export function getStylesForCategory(categoryId: CategoryId): StylePreset[] {
  return getCategoryById(categoryId)?.styles ?? []
}

export function getStylePrompt(categoryId: CategoryId, styleId: string, subStyleId?: string): string | undefined {
  const style = getStylePreset(categoryId, styleId)
  if (!style?.promptText) return undefined
  let raw: string
  if (subStyleId && style.subStyles) {
    const subStyle = style.subStyles.find((s) => s.id === subStyleId)
    if (subStyle) {
      raw = `${style.promptText}\n\nSUB-STYLE: ${subStyle.promptModifier}`
    } else {
      raw = style.promptText
    }
  } else {
    raw = style.promptText
  }
  return wrapStylePromptForGeneration(categoryId, raw)
}

/** Universal envelope — every category × every style, no exceptions */
export function wrapStylePromptForGeneration(categoryId: CategoryId, rawPrompt: string): string {
  const subject = categoryId === 'pets' ? 'pet' : 'family/couple'
  const faceLock = categoryId === 'pets' ? FACE_EDIT_LOCK : FACE_TRYON_LOCK_PEOPLE
  const themeOnly =
    categoryId === 'pets'
      ? `THEME ONLY (${subject}, all styles): Period mood on BACKGROUND, cushion, collar, and cloth draped on the animal's BACK only. Never human clothes, sleeves, or arms. The ENTIRE image must be a sharp, unfiltered photograph.`
      : `THEME ONLY (${subject}, all styles): Period theme on clothing and background only. Faces stay a photorealistic photograph of the same people with a subtle studio enhancement — zero painterly filters, zero illustration look.`
  return `${PHOTOREALISTIC_WHOLE_IMAGE}

${faceLock}

${rawPrompt}

${themeOnly}`
}

export function getSubStyle(subStyleId: string): RenaissanceSubStyle | undefined {
  return RENAISSANCE_SUB_STYLES.find((s) => s.id === subStyleId)
}

export function getStylePreset(categoryId: CategoryId, styleId: string): StylePreset | StyleLibraryEntry | undefined {
  const category = getCategoryById(categoryId)
  const categoryStyle = category?.styles.find((s) => s.id === styleId)
  if (categoryStyle) return categoryStyle
  return getStyleFromLibrary(styleId)
}

/** Style-specific tagline for the style page (replaces category.tagline) */
export function getStyleTagline(category: CategoryConfig, style: StylePreset | { title: string; description?: string }): string {
  const subject = category.id === 'pets' ? 'beloved pet' : 'family, couple, or yourself'
  return `A gift-ready ${style.title} portrait of your ${subject}`
}

/** All style IDs available for a category (category styles + library styles) */
export function getAllStyleIdsForCategory(categoryId: CategoryId): string[] {
  const category = getCategoryById(categoryId)
  const categoryIds = new Set(category?.styles.map((s) => s.id) ?? [])
  const libraryIds = STYLE_LIBRARY.map((s) => s.id)
  for (const id of libraryIds) {
    categoryIds.add(id)
  }
  return [...categoryIds]
}

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as string[]

export interface StyleThemeDefinition {
  era: string
  setting: string
  clothing: string
  forbidden: string[]
}

/** Per-style theme lock — ensures correct era/setting for every style ID (pets + family) */
export const STYLE_THEME_DEFINITIONS: Record<string, StyleThemeDefinition> = {
  renaissance: {
    era: '15th–16th century European Renaissance noble portrait',
    setting: 'Classical dark studio, charcoal backdrop, or restrained noble interior',
    clothing: 'Velvet robes, silk brocade, gold chains, pearl jewellery, modest lace — period silhouettes only',
    forbidden: ['Victorian 19th century', 'British tweed', 'Rococo pastels', 'modern clothing'],
  },
  'baroque-royal': {
    era: '17th-century Baroque European royal court',
    setting: 'Opulent court interior, velvet drapes, dramatic shadowed backdrop',
    clothing: 'Crimson/deep velvet, gold brocade, white lace collars or modest ruffs, jewel tones',
    forbidden: ['Victorian fashion', 'Renaissance Florentine soft pastels', 'Rococo lightness', 'modern dress'],
  },
  'rococo-elegance': {
    era: '18th-century French Rococo court',
    setting: 'Light airy salon, pale decorative interior, playful ornate backdrop',
    clothing: 'Pale silk, pink satin, cream brocade, ribbons, lace — soft pastels on garments',
    forbidden: ['Victorian dark formality', 'Renaissance heavy velvet', 'Baroque crimson drama', 'modern clothing'],
  },
  'victorian-era': {
    era: 'Victorian era Britain (c. 1837–1901) cabinet photograph',
    setting: 'Moody Victorian studio, dark parlour, or restrained interior — NOT Renaissance halos',
    clothing: 'Dark wool, frock coats, bustled silhouettes, muted navy/burgundy/charcoal, cravat inside collar',
    forbidden: ['Renaissance gold brocade', 'Elizabethan ruffs', 'Rococo pastels', 'Baroque theatre'],
  },
  edwardian: {
    era: 'Edwardian British aristocracy (early 20th century, c. 1901–1914)',
    setting: 'English country estate, garden terrace, or bright drawing room',
    clothing: 'Tailored Edwardian suits, long elegant dresses, lace, straw hats, light natural fabrics',
    forbidden: ['Heavy Victorian industrial gloom', 'Renaissance court dress', 'modern casual wear'],
  },
  'dutch-golden': {
    era: 'Dutch Golden Age (17th century, Rembrandt era)',
    setting: 'Dark studio with single warm light source, deep shadow',
    clothing: 'Black garments, white collars, warm brown tones, simple dignified dress',
    forbidden: ['Victorian bustles', 'Rococo pastels', 'Renaissance Florentine colours'],
  },
  'pre-raphaelite': {
    era: 'British Pre-Raphaelite movement (19th century)',
    setting: 'Nature backdrop, tapestry, or medieval-inspired garden — British romantic',
    clothing: 'Flowing medieval-inspired garments, jewel tones, rich embroidery — NOT generic Renaissance court',
    forbidden: ['Generic Renaissance court', 'Baroque opulence', 'Victorian formal studio only'],
  },
  'british-aristocracy': {
    era: 'British English aristocracy (18th–19th century noble portrait)',
    setting: 'English stately home, rolling parkland, library, or portrait gallery',
    clothing: 'English noble dress — velvet, tweed, pearls, fur trim, hunting-inspired or formal British tailoring',
    forbidden: ['French Rococo court', 'Italian Renaissance halos', 'American Western', 'modern streetwear'],
  },
  'royal-court': {
    era: 'British/European royal court portrait',
    setting: 'Palace throne room, royal gallery, or ceremonial court interior',
    clothing: 'Formal court dress, ermine trim, medals, crown or tiara optional, regal ceremonial attire',
    forbidden: ['Casual clothing', 'Rustic cottage', 'Dark academia study', 'modern dress'],
  },
  'country-manor': {
    era: 'English landed gentry / country manor (Georgian–Victorian British)',
    setting: 'English manor house, estate grounds, oak-panelled hall, or countryside vista',
    clothing: 'Refined country attire — riding coats, tweed, cravat, practical yet elegant British country dress',
    forbidden: ['French court Rococo', 'Urban industrial Victorian', 'fantasy armour'],
  },
  'heritage-museum': {
    era: 'English Heritage / National Portrait Gallery formal display',
    setting: 'Museum-quality neutral backdrop, gallery wall, or heritage display aesthetic — British institutional portrait',
    clothing: 'Formal historical British attire appropriate to a heritage museum portrait collection',
    forbidden: ['Cartoon illustration', 'Fantasy costume', 'Casual modern clothing', 'French Rococo frivolity'],
  },
  'dark-academia-scholar': {
    era: 'Dark Academia scholarly aesthetic',
    setting: 'Dark wood library, study with stacked books, warm lamplight, gothic university interior',
    clothing: 'Tweed blazers, turtlenecks, wool coats, scholarly muted tones — intellectual moody dress',
    forbidden: ['Bright Rococo pastels', 'Royal court ceremony', 'Outdoor country estate sunshine only'],
  },
  'oxford-don': {
    era: 'Oxford University academic portrait (British)',
    setting: 'Oxford college library, stone quad, or wood-panelled senior common room',
    clothing: 'Academic tweed, gown optional, distinguished British scholarly dress, spectacles acceptable',
    forbidden: ['French court dress', 'Fantasy medieval armour', 'Casual sportswear'],
  },
  'classic-storybook': {
    era: 'Classic British storybook theme (photorealistic, not illustrated)',
    setting: 'Charming English storybook scene — cottage garden, woodland glade, or cosy period interior',
    clothing: 'Whimsical but period-appropriate storybook costume — photorealistic fabric textures',
    forbidden: ['Cartoon illustration style', 'Flat drawn look', 'Modern clothing'],
  },
  'fairytale-art': {
    era: 'Fairytale enchanted theme (photorealistic photograph)',
    setting: 'Enchanted forest glade, castle fairytale backdrop, magical but photographic environment',
    clothing: 'Fairytale period costume — elegant, magical setting, photorealistic NOT illustrated',
    forbidden: ['Cartoon illustration', 'Anime style', 'Modern clothing'],
  },
  'hand-painted-watercolour': {
    era: 'Soft watercolour-inspired palette (photorealistic photo, NOT a painting)',
    setting: 'Gentle dreamy backdrop with soft pastel environmental tones — still a real photograph',
    clothing: 'Delicate period garments in pale washes of colour — photorealistic fabric, not paint strokes',
    forbidden: ['Visible brushstrokes on face', 'Watercolour illustration effect', 'Modern dress'],
  },
  'soft-pastel': {
    era: 'Soft pastel colour theme (photorealistic)',
    setting: 'Light airy backdrop in pale pink, mint, cream, or lavender tones',
    clothing: 'Period garments in soft pastel palette — photorealistic, not chalk illustration',
    forbidden: ['Dark Baroque drama', 'Heavy Victorian black', 'Illustrated cartoon look'],
  },
  'whimsical-fantasy': {
    era: 'Whimsical fantasy theme (photorealistic)',
    setting: 'Playful fantasy environment — enchanted garden, soft magical landscape, photographic',
    clothing: 'Fantasy-inflected period costume, playful but photorealistic',
    forbidden: ['Horror dark tones', 'Modern streetwear', 'Flat illustration'],
  },
  'high-fantasy-kingdom': {
    era: 'High fantasy medieval kingdom (photorealistic)',
    setting: 'Castle ramparts, mountain kingdom, epic fantasy landscape — cinematic photographic',
    clothing: 'Noble medieval fantasy attire, regal capes, kingdom dress — not modern',
    forbidden: ['Modern clothing', 'Victorian parlour', 'Rococo French court'],
  },
  'legendary-warrior': {
    era: 'Legendary fantasy warrior (photorealistic)',
    setting: 'Epic battlefield, ancient fortress, or heroic fantasy landscape',
    clothing: 'Battle-worn fantasy armour or warrior garb appropriate to legendary hero portrait',
    forbidden: ['Modern military uniform', 'Business suit', 'Rococo court dress'],
  },
}

export function getPetThemeLockPrompt(styleId: string, styleTitle: string): string {
  const def = STYLE_THEME_DEFINITIONS[styleId]
  if (!def) {
    return `PET STYLE SCENE — "${styleTitle}": Match this era in the BACKGROUND and on a collar or cloth draped over the animal's back. Never dress the pet as a person. Never add human arms.`
  }
  const forbidden =
    def.forbidden.length > 0 ? ` Also avoid: ${def.forbidden.join('; ')}.` : ''
  return `PET STYLE SCENE — "${styleTitle}" (background + drape only):
ERA/MOOD: ${def.era}
BACKGROUND: ${def.setting}
ON THE ANIMAL: a collar and/or a flat blanket of period fabric over the BACK and haunches only (horse caparison / dog coat-blanket). The animal stays a four-legged animal.
DO NOT put the animal in human clothes such as: ${def.clothing}
NEVER: human arms, hands, fingers, sleeves, jackets, coats, doublets, turtlenecks, armour for a person, or a sword in a hand.
The BACKGROUND must still read as "${styleTitle}".${forbidden}`
}

export function getStyleThemeLockPrompt(
  styleId: string,
  styleTitle: string,
  categoryId?: CategoryId
): string {
  if (categoryId === 'pets') {
    return getPetThemeLockPrompt(styleId, styleTitle)
  }
  const def = STYLE_THEME_DEFINITIONS[styleId]
  if (!def) {
    return `STYLE LOCK — "${styleTitle}": The output MUST unmistakably match ${styleTitle} on clothing and background. Do not mix other historical periods.`
  }
  const forbidden =
    def.forbidden.length > 0
      ? `\nFORBIDDEN (wrong theme — do NOT use): ${def.forbidden.join('; ')}.`
      : ''
  return `STYLE LOCK — "${styleTitle}" (mandatory — do not ignore):
ERA: ${def.era}
BACKGROUND/SETTING: ${def.setting}
CLOTHING & PROPS: ${def.clothing}
The finished portrait MUST be instantly recognisable as "${styleTitle}".${forbidden}`
}

/** Pet-specific instructions appended for every pet style */
export const PET_STYLE_SUFFIX = `FOR PETS (mandatory):
- Face, fur, and markings on the head must remain identical to the upload
- Dogs have no arms. Cats have no arms. Horses have no arms. Four legs only.
- Show the FULL animal in frame (not a zoomed headshot)
- Period look via collar, draped cape/caparison, cushion, and background — never a human outfit with sleeves
- Small jewelled collar at neck only if appropriate — never covering eyes or muzzle
- Background must match the selected style theme — not a generic studio`

/**
 * Style library entry - searchable across all categories.
 */
export interface StyleLibraryEntry extends Omit<StylePreset, 'thumbnail'> {
  /** Search keywords for finding styles */
  searchKeywords: string[]
}

/** Helper to create style prompt with face preservation + era lock */
function eraStylePrompt(eraLabel: string, styleInstructions: string, forbiddenEras: string[]): string {
  const forbidden =
    forbiddenEras.length > 0
      ? `\n\nFORBIDDEN (do NOT use): ${forbiddenEras.join('; ')}.`
      : ''
  return `${PHOTOREALISTIC_WHOLE_IMAGE}

${FACE_PRESERVATION}

STYLE LOCK — ${eraLabel} (mandatory): Theme via clothing and background only — photorealistic photograph, NOT a painting.

${styleInstructions}${forbidden}`
}

function stylePrompt(base: string, styleInstructions: string): string {
  return `${PHOTOREALISTIC_WHOLE_IMAGE}

${base}

${styleInstructions}`
}

/**
 * Style groups - roll lists on category page.
 * Each group expands to show its styles.
 */
export interface StyleGroup {
  id: string
  title: string
  subtitle?: string
  styles: StyleLibraryEntry[]
}

/** ~25% of original styles: British-appealing classics, royalty, storybook & gentle fantasy. Each has 3 pet example images. */
export const STYLE_GROUPS: StyleGroup[] = [
  {
    id: 'classic-art',
    title: 'Classic Art & Historical',
    styles: [
      { id: 'renaissance', title: 'Renaissance Portrait', description: 'Velvet robes, gold chains, and a classical studio — a real photo in 15th–16th century dress.', searchKeywords: ['renaissance', 'classical', 'old master', 'velvet'], promptText: RENAISSANCE_BASE },
      { id: 'baroque-royal', title: 'Baroque Royal', description: 'Crimson velvet, gold trim, and dramatic 17th-century court drapes — still a photograph.', searchKeywords: ['baroque', 'royal', 'velvet', 'golden'], promptText: eraStylePrompt('Baroque royal portrait (17th-century European court)', 'Edit photo: style clothing and background as Baroque royal portrait. Rich crimson or deep velvet, golden brocade trim, white lace collars or modest ruffs appropriate to the 1600s. Opulent, dramatic court lighting. Dark or draped background. Replace clothing and background only.', ['Victorian 19th-century dress', 'Renaissance 15th–16th century Florentine style', 'Rococo pastels', 'modern clothing']) },
      { id: 'rococo-elegance', title: 'Rococo Court', description: 'Pale silk, ribbons, and an airy 18th-century French salon. Pastels on clothes — not brushstrokes on faces.', searchKeywords: ['rococo', 'elegance', 'pastels', 'french court'], promptText: eraStylePrompt('Rococo portrait (18th-century French court)', 'Edit photo: style clothing and background as Rococo portrait. Pale silk, pink satin, cream brocade, soft pastels, playful ornate details. Light, airy, decorative 18th-century French court aesthetic. Replace clothing and background only.', ['Victorian dark formal wear', 'Renaissance doublets and Tudor ruffs', 'Baroque heavy velvet', 'modern clothing']) },
      { id: 'victorian-era', title: 'Victorian Era', description: 'Dark wool, modest silhouettes, and a moody 19th-century studio — like a cabinet photograph.', searchKeywords: ['victorian', 'era', 'formal', '19th century'], promptText: eraStylePrompt('Victorian era portrait (19th century, c. 1837–1901)', `Edit photo: style clothing and background as a formal Victorian-era cabinet photograph aesthetic (NOT an oil painting of the face).
CLOTHING: 19th-century formal dress — dark wool, velvet, or silk; high necklines; frock coats for men; modest bustled or period silhouettes for women; muted palette (black, navy, deep burgundy, brown, charcoal). Simple lace at collar if any — NOT large Elizabethan ruffs. Men's cravats or neckties worn INSIDE the shirt collar, knotted at the neck — never floating outside the collar.
BACKGROUND: Moody studio backdrop, dark interior, or subtle Victorian parlour — not golden Renaissance halos or Baroque theatre drapes.
MOOD: Restrained, dignified, photorealistic studio portrait of the Victorian period — like a real cabinet photograph, NOT a painting.
Replace clothing and background only. Photorealistic unfiltered photograph — zero filters on the whole image.`, ['Renaissance 15th–16th century dress', 'Elizabethan ruffs and doublets', 'gold brocade Renaissance sleeves', 'feathered Tudor caps', 'Baroque opulent crimson court', 'Rococo pastels']) },
      { id: 'edwardian', title: 'Edwardian Aristocracy', description: 'Tailored early-1900s British gentry: long dresses, light fabrics, country-estate light.', searchKeywords: ['edwardian', 'aristocracy', 'estate', 'elegant'], promptText: eraStylePrompt('Edwardian aristocracy portrait (early 20th century)', 'Edit photo: style clothing and background as Edwardian aristocracy portrait. Elegant country-estate attire: tailored suits, long Edwardian dresses, soft natural light, refined early-1900s British gentry aesthetic. Replace clothing and background only.', ['Victorian heavy dark formality only', 'Renaissance or Elizabethan dress', 'modern clothing']) },
      { id: 'dutch-golden', title: 'Dutch Golden Age', description: 'Black garments, white collars, and Rembrandt-style lighting on the room — not a painted face.', searchKeywords: ['dutch', 'golden age', 'rembrandt', 'chiaroscuro'], promptText: eraStylePrompt('Dutch Golden Age portrait (Rembrandt era)', 'Edit photo: style clothing and background as Dutch Golden Age portrait. Rembrandt-inspired chiaroscuro on background and garments only, warm browns, black garments with white collars, dramatic single light source. Replace clothing and background only.', ['Victorian 19th-century fashion', 'Renaissance Florentine colours', 'Rococo pastels']) },
      { id: 'pre-raphaelite', title: 'Pre-Raphaelite', description: 'Jewel-tone flowing garments and a romantic garden or tapestry — British 19th-century costume, real photo.', searchKeywords: ['pre-raphaelite', 'medieval', 'vivid', 'british'], promptText: eraStylePrompt('Pre-Raphaelite portrait (British Victorian art movement)', 'Edit photo: style clothing and background as Pre-Raphaelite portrait. Vivid jewel tones, medieval-inspired flowing garments, romantic British 19th-century Pre-Raphaelite Brotherhood aesthetic — NOT generic Renaissance court dress. Nature or tapestry backgrounds. Replace clothing and background only.', ['Generic Renaissance court portrait', 'Baroque theatre', 'modern clothing']) },
    ],
  },
  {
    id: 'royal-elite',
    title: 'Royal & British Heritage',
    styles: [
      { id: 'british-aristocracy', title: 'British Aristocracy', description: 'Tweed, pearls, and a stately home or parkland — English noble dress in a real photograph.', searchKeywords: ['british', 'aristocracy', 'noble', 'regal'], promptText: eraStylePrompt('British English aristocracy portrait', 'Edit photo: style clothing and background as British English aristocracy. English noble attire — velvet, tweed, pearls, fur trim. Stately home, rolling parkland, or portrait gallery background. Replace clothing and background only.', ['French Rococo', 'Italian Renaissance court', 'American Western', 'modern clothing']) },
      { id: 'royal-court', title: 'Royal Court', description: 'Ceremonial court dress, ermine, optional crown — palace interior, still a photograph.', searchKeywords: ['royal', 'court', 'crown', 'throne'], promptText: eraStylePrompt('Royal court portrait', 'Edit photo: style clothing and background as royal court portrait. Formal ceremonial court dress, ermine trim, crown or tiara optional. Palace throne room or royal gallery. Replace clothing and background only.', ['Casual wear', 'Rustic cottage', 'Dark academia study', 'modern dress']) },
      { id: 'country-manor', title: 'Country Manor', description: 'Riding coats, tweed, and an English estate hall — landed gentry costume, not a painting.', searchKeywords: ['country', 'manor', 'estate', 'landed'], promptText: eraStylePrompt('English country manor / landed gentry portrait', 'Edit photo: style clothing and background as English country manor portrait. Landed gentry attire — tweed, riding coat, cravat. Manor house, estate grounds, or oak-panelled hall. Replace clothing and background only.', ['French Rococo court', 'Urban Victorian factory setting', 'fantasy armour']) },
      { id: 'heritage-museum', title: 'Heritage Gallery', description: 'Formal British historical dress against a National Portrait Gallery–style backdrop.', searchKeywords: ['heritage', 'museum', 'display', 'gallery'], promptText: eraStylePrompt('English Heritage / museum gallery portrait', 'Edit photo: style clothing and background as English Heritage museum portrait. Formal historical British attire. Neutral gallery backdrop or heritage display aesthetic like the National Portrait Gallery. Replace clothing and background only.', ['Cartoon illustration', 'Fantasy costume', 'Casual modern clothing', 'Rococo frivolity']) },
    ],
  },
  {
    id: 'dark-academia',
    title: 'Dark Academia & Intellectual',
    styles: [
      { id: 'dark-academia-scholar', title: 'Dark Academia', description: 'Tweed, wool, and a lamplit library — scholarly dress in a real photograph.', searchKeywords: ['dark academia', 'scholar', 'moody', 'intellectual'], promptText: eraStylePrompt('Dark Academia scholar portrait', 'Edit photo: style clothing and background as Dark Academia scholar. Tweed, wool coats, turtlenecks. Dark wood library, stacked books, warm lamplight. Replace clothing and background only.', ['Bright Rococo pastels', 'Royal court ceremony', 'Outdoor sunny estate only']) },
      { id: 'oxford-don', title: 'Oxford Don', description: 'Academic tweed and an Oxford library or stone quad.', searchKeywords: ['oxford', 'don', 'academic', 'british'], promptText: eraStylePrompt('Oxford don academic portrait (British)', 'Edit photo: style clothing and background as Oxford don portrait. Academic tweed, distinguished scholarly dress. Oxford college library or stone quad. Replace clothing and background only.', ['French court dress', 'Fantasy armour', 'Casual sportswear']) },
    ],
  },
  {
    id: 'storybook-whimsical',
    title: 'Storybook & Whimsical',
    styles: [
      { id: 'classic-storybook', title: 'Storybook Costume', description: 'Cottage garden or woodland glade, whimsical period clothes — a real photo, not a drawing.', searchKeywords: ['storybook', 'cottage', 'children', 'classic'], promptText: eraStylePrompt('Classic British storybook theme (photorealistic)', 'Edit photo: style clothing and background with classic storybook theme. Charming English cottage garden, woodland glade, or cosy period interior. Whimsical period costume — photorealistic fabric. NOT a flat illustration. Replace clothing and background only.', ['Cartoon illustration style', 'Flat drawn look', 'Modern clothing']) },
      { id: 'fairytale-art', title: 'Fairytale Costume', description: 'Enchanted forest or castle backdrop with magical period dress — still a photograph.', searchKeywords: ['fairytale', 'children', 'magical', 'enchanted'], promptText: eraStylePrompt('Fairytale enchanted theme (photorealistic)', 'Edit photo: style clothing and background with fairytale theme. Enchanted forest glade or castle fairytale backdrop. Elegant magical period costume — photorealistic photograph, NOT illustrated. Replace clothing and background only.', ['Cartoon illustration', 'Anime style', 'Modern clothing']) },
      { id: 'hand-painted-watercolour', title: 'Watercolour Palette', description: 'Pale washed colours in clothes and backdrop. Soft palette — not paint on the face.', searchKeywords: ['watercolour', 'watercolor', 'pastel', 'soft'], promptText: eraStylePrompt('Soft watercolour-inspired palette (photorealistic photo)', 'Edit photo: style clothing and background with soft watercolour-inspired pastel environmental tones. Gentle dreamy backdrop, delicate period garments in pale washes — still a real photograph, NOT paint strokes on the face. Replace clothing and background only.', ['Visible brushstrokes on face', 'Watercolour illustration effect', 'Modern dress']) },
      { id: 'soft-pastel', title: 'Soft Pastel Studio', description: 'Pink, mint, cream, and lavender garments in a light airy room — photoreal, not chalk.', searchKeywords: ['pastel', 'soft', 'gentle', 'dreamy'], promptText: eraStylePrompt('Soft pastel colour theme (photorealistic)', 'Edit photo: style clothing and background with soft pastel theme. Light airy backdrop in pale pink, mint, cream, or lavender. Period garments in soft pastels — photorealistic, NOT chalk illustration. Replace clothing and background only.', ['Dark Baroque drama', 'Heavy Victorian black', 'Illustrated cartoon look']) },
      { id: 'whimsical-fantasy', title: 'Whimsical Fantasy', description: 'Playful enchanted garden and fantasy-tinged period costume — real camera look.', searchKeywords: ['whimsical', 'fantasy', 'playful', 'magical'], promptText: eraStylePrompt('Whimsical fantasy theme (photorealistic)', 'Edit photo: style clothing and background with whimsical fantasy theme. Playful enchanted garden or soft magical landscape. Fantasy-inflected period costume — photorealistic photograph. Replace clothing and background only.', ['Horror dark tones', 'Modern streetwear', 'Flat illustration']) },
    ],
  },
  {
    id: 'fantasy-classic',
    title: 'Classic Fantasy',
    styles: [
      { id: 'high-fantasy-kingdom', title: 'High Fantasy Kingdom', description: 'Castle ramparts and noble medieval fantasy attire — cinematic photograph, not CGI cartoon.', searchKeywords: ['high fantasy', 'kingdom', 'medieval', 'fantasy'], promptText: eraStylePrompt('High fantasy medieval kingdom (photorealistic)', 'Edit photo: style clothing and background as high fantasy kingdom portrait. Castle ramparts, mountain kingdom, epic cinematic landscape. Noble medieval fantasy attire, regal capes — not modern dress. Photorealistic photograph. Replace clothing and background only.', ['Modern clothing', 'Victorian parlour', 'Rococo French court']) },
      { id: 'legendary-warrior', title: 'Legendary Warrior', description: 'Fantasy armour and an epic fortress or battlefield — heroic costume, real-photo look.', searchKeywords: ['legendary', 'warrior', 'epic', 'battle'], promptText: eraStylePrompt('Legendary fantasy warrior (photorealistic)', 'Edit photo: style clothing and background as legendary warrior portrait. Epic battlefield or ancient fortress backdrop. Battle-worn fantasy armour or heroic warrior garb. Photorealistic photograph. Replace clothing and background only.', ['Modern military uniform', 'Business suit', 'Rococo court dress']) },
    ],
  },
]

/** Flattened style library for search and lookup (from all groups) */
export const STYLE_LIBRARY: StyleLibraryEntry[] = (() => {
  const seen = new Set<string>()
  const result: StyleLibraryEntry[] = []
  for (const group of STYLE_GROUPS) {
    for (const style of group.styles) {
      if (!seen.has(style.id)) {
        seen.add(style.id)
        result.push(style)
      }
    }
  }
  return result
})()

const styleLibraryById = new Map(STYLE_LIBRARY.map((s) => [s.id, s]))

/** All unique style IDs (for scripts that generate examples) */
export const ALL_STYLE_IDS = STYLE_LIBRARY.map((s) => s.id)

export function getStyleFromLibrary(styleId: string): StyleLibraryEntry | undefined {
  return styleLibraryById.get(styleId)
}

export function searchStyleLibrary(query: string): StyleLibraryEntry[] {
  const q = query.toLowerCase().trim()
  if (!q || q.length < 2) return []
  return STYLE_LIBRARY.filter((style) => {
    const searchable = [
      style.title,
      style.description,
      ...style.searchKeywords,
      ...(style.subStyles?.map((s) => s.title) ?? []),
    ].join(' ').toLowerCase()
    return searchable.includes(q) || style.searchKeywords.some((kw) => kw.includes(q))
  })
}

/** Colour palette options — apply to any style for clothing, fabrics, and background. */
export interface ColourOption {
  id: string
  label: string
  promptText: string
  /** Hex swatches for the card UI (matching colours for easy recognition). */
  colors: string[]
}

export const COLOUR_OPTIONS: ColourOption[] = [
  {
    id: 'style-default',
    label: 'Style default',
    promptText: '',
    colors: ['#4A4A4A', '#6B6B6B', '#8A8A8A', '#ABABAB', '#CCCCCC'],
  },
  { id: 'crimson-gold', label: 'Crimson & Gold', promptText: 'Use a colour palette of deep crimson red and rich gold for clothing, robes, and background. Velvet and brocade in these tones. Golden jewellery and trim.', colors: ['#8B0000', '#B8860B', '#D4AF37', '#FFFFFF', '#2C2C2C'] },
  { id: 'navy-silver', label: 'Navy & Silver', promptText: 'Use a colour palette of deep navy blue and silver for clothing and background. Silver jewellery, grey silk accents. Cool, elegant tones.', colors: ['#1A2A4A', '#4A5568', '#9CA3AF', '#E5E7EB', '#374151'] },
  { id: 'burgundy-cream', label: 'Burgundy & Cream', promptText: 'Use a colour palette of burgundy and cream for clothing and background. Cream lace, burgundy velvet. Warm, classic tones.', colors: ['#722F37', '#8B4513', '#FFF8E7', '#F5F5DC', '#2C2C2C'] },
  { id: 'forest-gold', label: 'Forest Green & Gold', promptText: 'Use a colour palette of forest green and gold for clothing and background. Green velvet, golden embroidery. Rich, natural tones.', colors: ['#228B22', '#2E8B57', '#D4AF37', '#F5DEB3', '#1C2E1C'] },
  { id: 'royal-purple', label: 'Royal Purple & Gold', promptText: 'Use a colour palette of royal purple and gold for clothing and background. Purple velvet, gold trim and jewellery. Regal tones.', colors: ['#4B0082', '#6A0DAD', '#D4AF37', '#E6E6FA', '#2C2C2C'] },
  { id: 'earth-bronze', label: 'Earth Tones & Bronze', promptText: 'Use a colour palette of earth tones (brown, tan, olive) and bronze for clothing and background. Warm, muted, classical.', colors: ['#3D2C1E', '#8B7355', '#CD7F32', '#D2B48C', '#2C2C2C'] },
  { id: 'black-gold', label: 'Classic Black & Gold', promptText: 'Use a colour palette of black and gold for clothing and background. Black velvet, gold embroidery and jewellery. Timeless, formal.', colors: ['#1A1A1A', '#2C2C2C', '#D4AF37', '#FFD700', '#4A4A4A'] },
  { id: 'soft-pastels', label: 'Soft Pastels', promptText: 'Use a soft pastel colour palette (pale pink, mint, cream, lavender) for clothing and background. Photorealistic — no soft filters.', colors: ['#E8A0A0', '#98D8AA', '#FFF8E7', '#E6E6FA', '#F5DEB3'] },
]

export function getColourPromptText(
  colourOptionId: string | undefined,
  styleTitle?: string,
  categoryId?: CategoryId
): string {
  if (!colourOptionId || colourOptionId === 'style-default') return ''
  const opt = COLOUR_OPTIONS.find((c) => c.id === colourOptionId)
  if (!opt?.promptText) return ''
  const petColourNote = ` Apply these colours to the cushion, draped back-cloth, collar, and background ONLY — never to invent a human outfit or sleeves. Keep the "${styleTitle ?? 'selected'}" era in the scene.`
  const petColourBody = opt.promptText
    .replace(/for clothing, robes, and background/gi, 'for the draped back-cloth, collar, cushion, and background')
    .replace(/for clothing and background/gi, 'for the draped cloth, collar, and background')
  const styleNote =
    categoryId === 'pets'
      ? petColourNote
      : styleTitle
        ? ` Apply these colours to clothing, fabrics, trim, and background ONLY — keep the "${styleTitle}" era, silhouettes, and setting exactly as locked above.`
        : ' Apply to clothing, fabrics, and background only — do not change the historical era or style theme.'
  return `\n\nCOLOUR PALETTE (mandatory — user selected "${opt.label}"):\n${categoryId === 'pets' ? petColourBody : opt.promptText}${styleNote}`
}

/** Neutral defaults — only applied when user leaves options unchanged */
export function getDefaultClothingChoices(categoryId: CategoryId): Record<string, string> {
  if (categoryId === 'pets') return { headwear: 'none', cape: 'no' }
  if (categoryId === 'family') return { headwear: 'none', collar: 'open' }
  return {}
}

/** Clothing/accessory options per category */
export interface ClothingChoice {
  id: string
  label: string
  promptText: string
}

export interface ClothingOption {
  id: string
  label: string
  choices: ClothingChoice[]
}

export const CLOTHING_OPTIONS: Record<CategoryId, ClothingOption[]> = {
  pets: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'hat', label: 'Feathered cap or crown', promptText: 'Add a small feathered cap or crown ON TOP of the pet\'s head — do not cover or alter the face, eyes, or muzzle.' },
        { id: 'headband', label: 'Pearl headband', promptText: 'Add a pearl headband ON TOP of existing fur — preserve exact face and markings.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear. Keep the pet\'s face and head fur exactly as in the photo.' },
      ],
    },
    {
      id: 'cape',
      label: 'Cape (draped on the back)',
      choices: [
        { id: 'yes', label: 'Velvet cape', promptText: 'Drape a velvet blanket/cape over the animal\'s BACK and withers only — like a horse cloth, not a human coat. No sleeves, no arms. Face and head fur unchanged.' },
        { id: 'no', label: 'No cape', promptText: 'No cape — face, fur, and markings remain exactly as in the original photo.' },
      ],
    },
  ],
  family: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'hats', label: 'Crowns or feathered hats', promptText: 'Add crowns or feathered hats ON TOP of each person\'s existing hairstyle — do not change hair colour, length, cut, or face.' },
        { id: 'headbands', label: 'Pearl headbands', promptText: 'Add pearl headbands or ribbons ON TOP of existing hair — preserve exact hairstyle and face.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear. Keep every person\'s original hairstyle exactly as in the photo.' },
      ],
    },
    {
      id: 'collar',
      label: 'Collars & ruffs',
      choices: [
        { id: 'ruffs', label: 'Elaborate ruffs', promptText: 'Add elaborate white ruffled ruffs encircling the neckline at the base of the neck — worn properly with the shirt, not floating outside the collar.' },
        { id: 'lace', label: 'Simple lace collars', promptText: 'Add simple lace collars at the neckline, integrated under the shirt collar — faces unchanged, no tie outside the shirt.' },
        { id: 'open', label: 'Open neck', promptText: 'Open neckline with no tie or cravat — shirt collar open naturally, faces and hair exactly as in the original photo.' },
      ],
    },
  ],
}

export function getClothingPromptText(categoryId: CategoryId, choices: Record<string, string>): string {
  const options = CLOTHING_OPTIONS[categoryId]
  if (!options) return ''
  const parts: string[] = []
  for (const opt of options) {
    const choiceId = choices[opt.id]
    const choice = opt.choices.find((c) => c.id === choiceId)
    if (choice?.promptText) parts.push(choice.promptText)
  }
  return parts.length ? '\n\nCLOTHING OPTIONS:\n' + parts.join(' ') : ''
}
