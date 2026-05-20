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
    description: 'Timeless elegance with refined brushwork and classical composition.',
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
    title: 'Rococo',
    description: 'Vibrant painterly style with bold brushstrokes and rich color harmony.',
    promptModifier: `Rococo style, 18th-century French court aesthetic.
CLOTHING & FABRICS: Wear pale mint green silk (#4A7C59), light pink satin and rose accents (#E8A0A0), white lace and ribbons (#FFFFFF), cream and tan brocade (#C4A574). Golden decorative elements (#D4AF37).
STYLE: Photorealistic pastel garments and background. Natural photograph — no painterly or soft filters.`,
    colors: ['#4A7C59', '#E8A0A0', '#FFFFFF', '#C4A574', '#D4AF37'],
  },
]

/** Whole-image photoreal mandate — theme on clothes/background only, no filters anywhere */
export const PHOTOREALISTIC_WHOLE_IMAGE = `PHOTOREALISTIC PHOTOGRAPH — ENTIRE IMAGE (mandatory, all categories):
- Output must look like an unedited DSLR photograph — NOT a painting, illustration, watercolour, or AI art
- Apply the selected THEME only via period clothing, fabrics, props, and background setting
- ZERO filters on the whole picture: no soft focus, no glow, no colour grading, no beauty filter, no airbrush, no painterly effect, no dreamy haze, no Instagram look
- Sharp natural detail everywhere — background, clothing, skin, fur — like a real camera photo
- Theme = wardrobe + environment. Everything else stays photoreal and unfiltered`

/** Virtual try-on edit lock — must be first in every prompt (OpenAI cookbook pattern) */
export const FACE_EDIT_LOCK = `EDIT MODE — THEME ONLY, NO FILTERS (highest priority):
Edit this photo like a costume + set change on a real photoshoot. Change ONLY clothing and background to match the selected theme.
The ENTIRE image must remain a sharp, raw, unfiltered photograph — identical photo quality to the upload.
DO NOT change: face, skin texture, pores, expression, hair, body shape, or pose.
FORBIDDEN on the whole image: beauty filter, skin smoothing, soft focus, glow, painterly effect, illustration style, colour grading, AI art look.`

/** Absolute no-filter rule — both pets and people, every style */
export const NO_FILTER_FACE = `ZERO FILTERS ON FACES (mandatory — all categories):
- Copy the face from the source photo unchanged — treat it as a locked layer that must NOT be repainted
- Faces must look like unedited photographs: raw, sharp, natural — NOT retouched or beautified
- Preserve natural skin/fur texture: pores, fine lines, natural shadows, real imperfections, exact tone from the upload
- FORBIDDEN on any face: beauty filter, skin smoothing, airbrush, soft glow, porcelain skin, glamour retouch, makeup enhancement, Instagram/Snapchat filter, painterly or soft-focus skin, AI face enhancement`

/** Correct period clothing layering — prevents tie/cravat outside shirt */
export const PERIOD_CLOTHING_FIT = `CLOTHING FIT & LAYERING (mandatory for people):
- Cravats, neckties, and ascots must be worn INSIDE the shirt collar — knotted at the neck with collar points properly over the neckwear
- NEVER place a tie, cravat, or bow tie floating OUTSIDE or ON TOP of an open shirt collar — that is incorrect
- Dress shirts buttoned correctly at the collar when formal neckwear is worn; waistcoat and jacket lapels sit naturally over the shirt
- Ruffs and lace collars encircle the neckline at the base of the neck — integrated with the garment, not floating detached on top of the shirt
- All clothing must look physically correct: no impossible layering, no accessories clipping through fabric`

/** Pet costume/collar placement */
export const PET_COLLAR_FIT = `COLLAR & COSTUME FIT (mandatory for pets):
- Collars, capes, and costumes sit around neck/chest only — never covering eyes, muzzle, nose, or ears
- Accessories must attach naturally; no floating elements through fur`

/** Shared light-touch generation instruction — applies to pets and family on every style */
export const LIGHT_TOUCH_EDIT = `THEME-ONLY EDIT (all categories):
- Change clothing, accessories, and background to match the selected theme
- Keep the whole image looking like an unfiltered photograph — no AI processing look
- Sharp detail, natural colours, real textures throughout the entire picture`

/** Base instruction for face preservation — no filters; maximum recognizability for pets and humans */
export const FACE_PRESERVATION = `CRITICAL - FACE PRESERVATION (NO FILTERS):
- Keep every face (person or animal) COMPLETELY recognizable — identical to the original photo. Faces must look like real photographs, not paintings.
- Do NOT apply any filter, blur, softening, airbrush, beauty filter, oil painting texture, or artistic effect to the face, skin, fur, or hair.
- Preserve all facial features, expressions, skin/fur texture, markings, and likeness exactly as they appear — zero stylization on the face
- For people: preserve hairstyle exactly (colour, length, cut, texture, parting). For pets: preserve fur colour, pattern, and markings on the face exactly
- Apply the artistic style to clothing, background, and surroundings only; leave all faces photographically clear and unchanged
- Do NOT change face shape, features, or appearance. The customer must instantly recognize themselves or their pet`

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

ONLY stylize: decorative clothing/collars (away from face), cushion, background, and scene.`

/** Repeated at end of pet prompts */
export const PET_FACE_IDENTITY_EMPHASIS = `FINAL REMINDER — PET IDENTITY: Face, fur, markings, and expression must match the upload — photorealistic, zero filters. The owner must recognize their pet instantly. Style applies to costume and background ONLY.`

/** Family/couple: identity lock — must be first in prompt for human portraits */
export const FAMILY_FACE_IDENTITY_FIRST = `HIGHEST PRIORITY — IDENTITY (HUMANS). The customer MUST instantly recognize every person as themselves. This overrides all artistic style instructions below.

FACE — must match the upload exactly:
- Same face shape, jaw, cheeks, forehead, chin, eye shape and colour, nose, mouth, lips, eyebrows, skin tone, freckles, moles, wrinkles, and expression
- Photorealistic skin — sharp, clear, completely unfiltered. NO oil paint, brushstrokes, soft focus, smoothing, beautification, glamour retouch, or "portrait painting" effect on any face
- Natural skin texture with pores and real shadows — like a DSLR photo, not a magazine cover
- Treat each face as a photograph composited unchanged onto the styled portrait — do NOT repaint faces

HAIR — must match the upload exactly:
- Same hair colour, length, cut, texture, curl, volume, parting, fringe/bangs, and style as the original photo
- Do NOT restyle, recolour, shorten, or give period/Victorian/Renaissance hairstyles
- Optional headwear may sit ON TOP of the existing hair only — never replace or paint over the hair

ONLY stylize: clothing, body garments, jewellery (not replacing facial features), and background.`

/** Repeated at end of family prompts */
export const FAMILY_FACE_IDENTITY_EMPHASIS = `FINAL REMINDER — IDENTITY: Every face and hairstyle must be identical to the upload — photorealistic, zero filters, instantly recognizable. The user must see themselves. Style applies to clothes and background ONLY. Do NOT paint over faces or hair.`

/** Repeated at end of prompt: faces must stay photorealistic and untouched by the art style */
export const FACE_PRESERVATION_EMPHASIS = `REMINDER - FACES AND HAIR UNCHANGED: Do NOT paint over the face or hair. Do NOT apply oil painting, brushstrokes, soft focus, or any art style to the face, skin, or hairstyle. The face must look like a real photograph of the same person or animal — instantly recognizable. Style goes on clothes and background only.`

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
export const FULL_FRAME_INSTRUCTION = `CRITICAL - FRAMING AND COMPOSITION:
- Show the ENTIRE face and subject in the image. Do NOT crop, zoom in, or cut off any part of the face, head, or body.
- Keep the same framing as the original photo: if the original shows head and shoulders, show full head and shoulders; if it shows full body or multiple people, show all of them fully in frame.
- Ensure every person or pet in the photo is fully visible with no body parts cut off at the edges.`

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
- Natural dignified pose; sharp camera-photo quality throughout
- NO filters, NO soft focus, NO painterly effects on any part of the image`

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'pets',
    label: 'Pet Portraits',
    slug: 'pets',
    tagline: 'Your beloved pet as Renaissance royalty',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Classical oil painting style inspired by European masters. Regal, timeless, museum-quality.',
        subStyles: RENAISSANCE_SUB_STYLES,
        promptText: `${RENAISSANCE_BASE}

FOR PETS SPECIFICALLY:
- Face and fur on the head must remain photorealistic and identical to the upload
- Dress the pet in miniature attire or place on velvet cushions — clothing/cape on body only, not over the face
- Small jeweled collar at neck only if chosen — never obscuring the face
- Position on ornate furniture or rich fabric draping in the background`,
      },
    ],
  },
  {
    id: 'family',
    label: 'Family / Couple',
    slug: 'family-couple',
    tagline: 'Your family or couple immortalized in classic style',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Classical oil painting style inspired by European masters. Elegant, timeless, gallery-worthy.',
        subStyles: RENAISSANCE_SUB_STYLES,
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

export function getStylesForCategory(categoryId: CategoryId): StylePreset[] {
  return getCategoryById(categoryId)?.styles ?? []
}

export function getStylePrompt(categoryId: CategoryId, styleId: string, subStyleId?: string): string | undefined {
  const style = getStylePreset(categoryId, styleId)
  if (!style?.promptText) return undefined
  if (subStyleId && style.subStyles) {
    const subStyle = style.subStyles.find((s) => s.id === subStyleId)
    if (subStyle) {
      return `${style.promptText}\n\nSUB-STYLE: ${subStyle.promptModifier}`
    }
  }
  return style.promptText
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
  const subject = category.id === 'pets' ? 'beloved pet' : 'family or couple'
  return `Your ${subject} in ${style.title} style`
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
  return `${FACE_PRESERVATION}

STYLE LOCK — ${eraLabel} (mandatory): The portrait MUST read unmistakably as ${eraLabel}. Do NOT default to a generic Renaissance or Elizabethan look unless that is the selected style.

${styleInstructions}${forbidden}`
}

function stylePrompt(base: string, styleInstructions: string): string {
  return `${base}\n\n${styleInstructions}`
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
      { id: 'renaissance', title: 'Renaissance Oil Painting', description: '15th–16th century European masters.', searchKeywords: ['renaissance', 'oil', 'classical', 'old master'], subStyles: RENAISSANCE_SUB_STYLES, promptText: RENAISSANCE_BASE },
      { id: 'baroque-royal', title: 'Baroque Royal Portrait', description: 'Rich velvet drapes, golden baroque frames.', searchKeywords: ['baroque', 'royal', 'velvet', 'golden'], promptText: eraStylePrompt('Baroque royal portrait (17th-century European court)', 'Edit photo: style clothing and background as Baroque royal portrait. Rich crimson or deep velvet, golden brocade trim, white lace collars or modest ruffs appropriate to the 1600s. Opulent, dramatic court lighting. Dark or draped background. Replace clothing and background only.', ['Victorian 19th-century dress', 'Renaissance 15th–16th century Florentine style', 'Rococo pastels', 'modern clothing']) },
      { id: 'rococo-elegance', title: 'Rococo Elegance', description: 'Vibrant painterly style with bold brushstrokes.', searchKeywords: ['rococo', 'elegance', 'pastels', 'french court'], promptText: eraStylePrompt('Rococo portrait (18th-century French court)', 'Edit photo: style clothing and background as Rococo portrait. Pale silk, pink satin, cream brocade, soft pastels, playful ornate details. Light, airy, decorative 18th-century French court aesthetic. Replace clothing and background only.', ['Victorian dark formal wear', 'Renaissance doublets and Tudor ruffs', 'Baroque heavy velvet', 'modern clothing']) },
      { id: 'victorian-era', title: 'Victorian Era Portrait', description: 'Formal Victorian period style.', searchKeywords: ['victorian', 'era', 'formal', '19th century'], promptText: eraStylePrompt('Victorian era portrait (19th century, c. 1837–1901)', `Edit photo: style clothing and background as a formal Victorian-era cabinet photograph aesthetic (NOT an oil painting of the face).
CLOTHING: 19th-century formal dress — dark wool, velvet, or silk; high necklines; frock coats for men; modest bustled or period silhouettes for women; muted palette (black, navy, deep burgundy, brown, charcoal). Simple lace at collar if any — NOT large Elizabethan ruffs. Men's cravats or neckties worn INSIDE the shirt collar, knotted at the neck — never floating outside the collar.
BACKGROUND: Moody studio backdrop, dark interior, or subtle Victorian parlour — not golden Renaissance halos or Baroque theatre drapes.
MOOD: Restrained, dignified, photorealistic studio portrait of the Victorian period — like a real cabinet photograph, NOT a painting.
Replace clothing and background only; keep faces photographic.`, ['Renaissance 15th–16th century dress', 'Elizabethan ruffs and doublets', 'gold brocade Renaissance sleeves', 'feathered Tudor caps', 'Baroque opulent crimson court', 'Rococo pastels']) },
      { id: 'edwardian', title: 'Edwardian Aristocracy', description: 'Elegant Edwardian country estate.', searchKeywords: ['edwardian', 'aristocracy', 'estate', 'elegant'], promptText: eraStylePrompt('Edwardian aristocracy portrait (early 20th century)', 'Edit photo: style clothing and background as Edwardian aristocracy portrait. Elegant country-estate attire: tailored suits, long Edwardian dresses, soft natural light, refined early-1900s British gentry aesthetic. Replace clothing and background only.', ['Victorian heavy dark formality only', 'Renaissance or Elizabethan dress', 'modern clothing']) },
      { id: 'dutch-golden', title: 'Dutch Golden Age', description: 'Rembrandt-inspired chiaroscuro.', searchKeywords: ['dutch', 'golden age', 'rembrandt', 'chiaroscuro'], promptText: eraStylePrompt('Dutch Golden Age portrait (Rembrandt era)', 'Edit photo: style clothing and background as Dutch Golden Age portrait. Rembrandt-inspired chiaroscuro on background and garments only, warm browns, black garments with white collars, dramatic single light source. Replace clothing and background only.', ['Victorian 19th-century fashion', 'Renaissance Florentine colours', 'Rococo pastels']) },
      { id: 'pre-raphaelite', title: 'Pre-Raphaelite Style', description: 'Vivid, British Pre-Raphaelite.', searchKeywords: ['pre-raphaelite', 'medieval', 'vivid', 'british'], promptText: eraStylePrompt('Pre-Raphaelite portrait (British Victorian art movement)', 'Edit photo: style clothing and background as Pre-Raphaelite portrait. Vivid jewel tones, medieval-inspired flowing garments, romantic British 19th-century Pre-Raphaelite Brotherhood aesthetic — NOT generic Renaissance court dress. Nature or tapestry backgrounds. Replace clothing and background only.', ['Generic Renaissance court portrait', 'Baroque theatre', 'modern clothing']) },
    ],
  },
  {
    id: 'royal-elite',
    title: 'Royal & British Heritage',
    styles: [
      { id: 'british-aristocracy', title: 'British Aristocracy', description: 'Regal British noble style.', searchKeywords: ['british', 'aristocracy', 'noble', 'regal'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as British aristocracy portrait. Regal noble attire. Velvet, fur trim, pearls. Country estate background. Replace clothing and background only.') },
      { id: 'royal-court', title: 'Royal Court Portrait', description: 'Grand royal court style.', searchKeywords: ['royal', 'court', 'crown', 'throne'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as royal court portrait. Crown or tiara. Formal court attire. Throne room or palace. Replace clothing and background only.') },
      { id: 'country-manor', title: 'Country Manor Painting', description: 'Estate manor portrait style.', searchKeywords: ['country', 'manor', 'estate', 'landed'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as country manor portrait. Landed gentry style. Refined country attire. Manor house background. Replace clothing and background only.') },
      { id: 'heritage-museum', title: 'Heritage Museum Display', description: 'Museum-quality heritage portrait.', searchKeywords: ['heritage', 'museum', 'display', 'gallery'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as heritage museum portrait. Gallery-quality. Formal historical attire. Museum display aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'dark-academia',
    title: 'Dark Academia & Intellectual',
    styles: [
      { id: 'dark-academia-scholar', title: 'Dark Academia Scholar', description: 'Moody scholarly portrait.', searchKeywords: ['dark academia', 'scholar', 'moody', 'intellectual'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as Dark Academia scholar portrait. Moody, scholarly. Books, tweed, warm lamplight. Library or study. Replace clothing and background only.') },
      { id: 'oxford-don', title: 'Oxford Don Aesthetic', description: 'Academic Oxford don style.', searchKeywords: ['oxford', 'don', 'academic', 'british'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as Oxford don portrait. Academic, distinguished. Tweed, spectacles. University library. Replace clothing and background only.') },
    ],
  },
  {
    id: 'storybook-whimsical',
    title: 'Storybook & Whimsical',
    styles: [
      { id: 'classic-storybook', title: 'Classic Storybook Illustration', description: 'Beloved children\'s book style.', searchKeywords: ['storybook', 'illustration', 'children', 'classic'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background with classic storybook theme. Whimsical period costume and charming storybook-style background. Photorealistic photograph — NOT an illustration. Replace clothing and background only.') },
      { id: 'fairytale-art', title: "Children's Fairytale Art", description: 'Magical fairytale illustration.', searchKeywords: ['fairytale', 'children', 'magical', 'enchanted'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background with fairytale theme. Magical period costume and enchanted background setting. Photorealistic photograph — NOT an illustration. Replace clothing and background only.') },
      { id: 'hand-painted-watercolour', title: 'Hand-Painted Watercolour', description: 'Delicate watercolour washes.', searchKeywords: ['watercolour', 'watercolor', 'hand painted', 'soft'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background with soft watercolour-inspired pastel theme colours. Photorealistic photograph — NOT a watercolour painting. Replace clothing and background only.') },
      { id: 'soft-pastel', title: 'Soft Pastel Illustration', description: 'Gentle pastel tones.', searchKeywords: ['pastel', 'soft', 'gentle', 'dreamy'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background with soft pastel theme colours. Photorealistic photograph — NOT an illustration. Replace clothing and background only.') },
      { id: 'whimsical-fantasy', title: 'Whimsical Fantasy', description: 'Playful fantasy style.', searchKeywords: ['whimsical', 'fantasy', 'playful', 'magical'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background with whimsical fantasy theme. Playful period costume and fantasy background. Photorealistic photograph — no filters. Replace clothing and background only.') },
    ],
  },
  {
    id: 'fantasy-classic',
    title: 'Classic Fantasy',
    styles: [
      { id: 'high-fantasy-kingdom', title: 'High Fantasy Kingdom', description: 'Medieval fantasy world.', searchKeywords: ['high fantasy', 'kingdom', 'medieval', 'fantasy'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as high fantasy kingdom portrait. Medieval fantasy world. Noble or heroic attire. Castle, mountains. Replace clothing and background only.') },
      { id: 'legendary-warrior', title: 'Legendary Warrior', description: 'Epic warrior portrait.', searchKeywords: ['legendary', 'warrior', 'epic', 'battle'], promptText: stylePrompt(FACE_PRESERVATION, 'Edit photo: style clothing and background as legendary warrior portrait. Epic battle attire. Heroic pose. Fantasy world. Replace clothing and background only.') },
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

export function getColourPromptText(colourOptionId: string | undefined): string {
  if (!colourOptionId || colourOptionId === 'style-default') return ''
  const opt = COLOUR_OPTIONS.find((c) => c.id === colourOptionId)
  return opt?.promptText ? `\n\nCOLOUR PALETTE: ${opt.promptText}` : ''
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
      label: 'Cape or robe',
      choices: [
        { id: 'yes', label: 'Velvet cape', promptText: 'Add a velvet cape on the body/shoulders only — face and head fur unchanged.' },
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
