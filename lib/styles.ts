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
STYLE: Refined delicate brushwork, soft sfumato, classical composition. Graceful poses, balanced proportions. Warm golden light. Timeless elegance.`,
    colors: ['#6B2D2D', '#C4A574', '#FFFFFF', '#D4AF37', '#2C2C2C'],
  },
  {
    id: 'renaissance-sky',
    title: 'Renaissance Sky',
    description: 'Atmospheric Renaissance style with dramatic lighting and old master quality.',
    promptModifier: `Renaissance Sky / Caravaggio style with dramatic chiaroscuro.
CLOTHING & FABRICS: Wear dark brown leather and earth-toned robes (#3D2C1E), silver-grey silk accents (#9E9E9E), white lace collars (#FFFFFF). Gold chain jewelry (#D4AF37). Deep navy blue atmospheric background (#1A2A3A).
STYLE: Moody theatrical lighting, rich shadows, dramatic highlights. Old master quality. Atmospheric depth. Theatrical composition.`,
    colors: ['#3D2C1E', '#9E9E9E', '#FFFFFF', '#D4AF37', '#1A2A3A'],
  },
  {
    id: 'baroque-red',
    title: 'Baroque Red',
    description: 'Classic royal portrait with rich velvet drapes and golden baroque frames.',
    promptModifier: `Baroque royal portrait style, 17th-century European court.
CLOTHING & FABRICS: Wear vibrant crimson and deep red velvet (#8B0000), golden brocade embroidery (#D4AF37), silver-trimmed accessories (#C0C0C0), white ruffs (#FFFFFF). Olive green velvet accents (#6B8E23). Rich velvet drapes in background.
STYLE: Opulent, luxurious. Golden baroque ornamental details. Jewel tones. Dramatic court lighting.`,
    colors: ['#8B0000', '#D4AF37', '#C0C0C0', '#FFFFFF', '#6B8E23'],
  },
  {
    id: 'rococo',
    title: 'Rococo',
    description: 'Vibrant painterly style with bold brushstrokes and rich color harmony.',
    promptModifier: `Rococo style, 18th-century French court aesthetic.
CLOTHING & FABRICS: Wear pale mint green silk (#4A7C59), light pink satin and rose accents (#E8A0A0), white lace and ribbons (#FFFFFF), cream and tan brocade (#C4A574). Golden decorative elements (#D4AF37).
STYLE: Vibrant painterly look, bold visible brushstrokes. Soft pastels, rich color harmony. Elegant, light, decorative. Playful ornate details.`,
    colors: ['#4A7C59', '#E8A0A0', '#FFFFFF', '#C4A574', '#D4AF37'],
  },
]

/** Base instruction for face preservation */
export const FACE_PRESERVATION = `CRITICAL - FACE PRESERVATION:
- Keep the subject's face COMPLETELY recognizable - virtually identical to the original photo
- Preserve all facial features, expressions, and likeness exactly as they appear
- Only apply subtle oil painting texture to the face, no other modifications
- Do NOT change face shape, features, or appearance`

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

/** Ensures the full subject is visible — no cropping or zooming that cuts off face/body */
export const FULL_FRAME_INSTRUCTION = `CRITICAL - FRAMING AND COMPOSITION:
- Show the ENTIRE face and subject in the image. Do NOT crop, zoom in, or cut off any part of the face, head, or body.
- Keep the same framing as the original photo: if the original shows head and shoulders, show full head and shoulders; if it shows full body or multiple people, show all of them fully in frame.
- Ensure every person or pet in the photo is fully visible with no body parts cut off at the edges.`

const RENAISSANCE_BASE = `Transform this photo into a Renaissance noble portrait in the style of 15th-16th century European masters.

${FACE_PRESERVATION}

${FULL_FRAME_INSTRUCTION}

ADD RENAISSANCE ELEMENTS:
- Replace clothing with period-appropriate attire (specific colors and styles come from the chosen sub-style)
- Add period jewelry: pearl necklaces, gold chains, jeweled brooches, ornate rings, decorative headpieces
- Include Renaissance accessories: feathered hats, lace collars (ruffs), embroidered gloves, decorative belts
- Use rich fabrics: velvet, silk, brocade
- Add a classical background (colors and style from chosen sub-style)

ARTISTIC STYLE:
- Classical oil painting technique with visible brushwork
- Use the exact color palette specified in the sub-style for clothing, jewelry, and background
- Museum-quality, gallery-worthy composition
- Dignified, noble pose`

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
- Keep the pet's face and features completely recognizable
- Dress the pet in miniature Renaissance royal attire or place on luxurious velvet cushions with gold tassels
- Add a small jeweled collar or decorative accessories appropriate for nobility
- Position on ornate furniture or with rich fabric draping`,
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
- Keep all subjects' faces completely recognizable and unchanged
- Dress each person in coordinated Renaissance noble attire appropriate to their age
- Add family or couple jewelry: matching brooches, coordinated necklaces, or crests
- Create a formal portrait composition with elegant poses (family or couple)`,
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

/** Helper to create style prompt with face preservation */
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
      { id: 'baroque-royal', title: 'Baroque Royal Portrait', description: 'Rich velvet drapes, golden baroque frames.', searchKeywords: ['baroque', 'royal', 'velvet', 'golden'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Baroque royal portrait. 17th-century European court. Rich crimson velvet, golden brocade, white ruffs. Opulent, luxurious. Replace clothing and background only.') },
      { id: 'rococo-elegance', title: 'Rococo Elegance', description: 'Vibrant painterly style with bold brushstrokes.', searchKeywords: ['rococo', 'elegance', 'pastels', 'french court'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Rococo portrait. 18th-century French court. Pale mint silk, pink satin, cream brocade. Soft pastels, rich color harmony. Replace clothing and background only.') },
      { id: 'victorian-era', title: 'Victorian Era Portrait', description: 'Formal Victorian period style.', searchKeywords: ['victorian', 'era', 'formal', '19th century'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Victorian era portrait. Formal period attire. Dark fabrics, high collars. Moody, dignified. Replace clothing and background only.') },
      { id: 'edwardian', title: 'Edwardian Aristocracy', description: 'Elegant Edwardian country estate.', searchKeywords: ['edwardian', 'aristocracy', 'estate', 'elegant'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Edwardian aristocracy portrait. Country estate elegance. Refined period attire. Soft natural light. Replace clothing and background only.') },
      { id: 'dutch-golden', title: 'Dutch Golden Age', description: 'Rembrandt-inspired chiaroscuro.', searchKeywords: ['dutch', 'golden age', 'rembrandt', 'chiaroscuro'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Dutch Golden Age portrait. Rembrandt-inspired chiaroscuro. Warm browns, dramatic light. Classical oil painting. Replace clothing and background only.') },
      { id: 'pre-raphaelite', title: 'Pre-Raphaelite Style', description: 'Vivid, British Pre-Raphaelite.', searchKeywords: ['pre-raphaelite', 'medieval', 'vivid', 'british'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Pre-Raphaelite portrait. Vivid colors, medieval-inspired. Flowing hair, nature elements. Dreamy, romantic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'royal-elite',
    title: 'Royal & British Heritage',
    styles: [
      { id: 'british-aristocracy', title: 'British Aristocracy', description: 'Regal British noble style.', searchKeywords: ['british', 'aristocracy', 'noble', 'regal'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into British aristocracy portrait. Regal noble attire. Velvet, fur trim, pearls. Country estate background. Replace clothing and background only.') },
      { id: 'royal-court', title: 'Royal Court Portrait', description: 'Grand royal court style.', searchKeywords: ['royal', 'court', 'crown', 'throne'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into royal court portrait. Crown or tiara. Formal court attire. Throne room or palace. Replace clothing and background only.') },
      { id: 'country-manor', title: 'Country Manor Painting', description: 'Estate manor portrait style.', searchKeywords: ['country', 'manor', 'estate', 'landed'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into country manor portrait. Landed gentry style. Refined country attire. Manor house background. Replace clothing and background only.') },
      { id: 'heritage-museum', title: 'Heritage Museum Display', description: 'Museum-quality heritage portrait.', searchKeywords: ['heritage', 'museum', 'display', 'gallery'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into heritage museum portrait. Gallery-quality. Formal historical attire. Museum display aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'dark-academia',
    title: 'Dark Academia & Intellectual',
    styles: [
      { id: 'dark-academia-scholar', title: 'Dark Academia Scholar', description: 'Moody scholarly portrait.', searchKeywords: ['dark academia', 'scholar', 'moody', 'intellectual'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Dark Academia scholar portrait. Moody, scholarly. Books, tweed, warm lamplight. Library or study. Replace clothing and background only.') },
      { id: 'oxford-don', title: 'Oxford Don Aesthetic', description: 'Academic Oxford don style.', searchKeywords: ['oxford', 'don', 'academic', 'british'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Oxford don portrait. Academic, distinguished. Tweed, spectacles. University library. Replace clothing and background only.') },
    ],
  },
  {
    id: 'storybook-whimsical',
    title: 'Storybook & Whimsical',
    styles: [
      { id: 'classic-storybook', title: 'Classic Storybook Illustration', description: 'Beloved children\'s book style.', searchKeywords: ['storybook', 'illustration', 'children', 'classic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into classic storybook illustration. Whimsical, illustrated. Soft lines, gentle colors. Children\'s book aesthetic. Replace clothing and background only.') },
      { id: 'fairytale-art', title: "Children's Fairytale Art", description: 'Magical fairytale illustration.', searchKeywords: ['fairytale', 'children', 'magical', 'enchanted'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into children\'s fairytale art. Magical, enchanting. Soft colors, dreamy. Storybook aesthetic. Replace clothing and background only.') },
      { id: 'hand-painted-watercolour', title: 'Hand-Painted Watercolour', description: 'Delicate watercolour washes.', searchKeywords: ['watercolour', 'watercolor', 'hand painted', 'soft'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into hand-painted watercolour portrait. Delicate washes, flowing colors. Dreamy, artistic. Replace clothing and background only.') },
      { id: 'soft-pastel', title: 'Soft Pastel Illustration', description: 'Gentle pastel tones.', searchKeywords: ['pastel', 'soft', 'gentle', 'dreamy'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into soft pastel illustration. Gentle tones, dreamy. Chalk-like texture. Whimsical aesthetic. Replace clothing and background only.') },
      { id: 'whimsical-fantasy', title: 'Whimsical Fantasy', description: 'Playful fantasy style.', searchKeywords: ['whimsical', 'fantasy', 'playful', 'magical'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into whimsical fantasy portrait. Playful, magical. Soft fantasy elements. Dreamy aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'fantasy-classic',
    title: 'Classic Fantasy',
    styles: [
      { id: 'high-fantasy-kingdom', title: 'High Fantasy Kingdom', description: 'Medieval fantasy world.', searchKeywords: ['high fantasy', 'kingdom', 'medieval', 'fantasy'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into high fantasy kingdom portrait. Medieval fantasy world. Noble or heroic attire. Castle, mountains. Replace clothing and background only.') },
      { id: 'legendary-warrior', title: 'Legendary Warrior', description: 'Epic warrior portrait.', searchKeywords: ['legendary', 'warrior', 'epic', 'battle'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into legendary warrior portrait. Epic battle attire. Heroic pose. Fantasy world. Replace clothing and background only.') },
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
  { id: 'crimson-gold', label: 'Crimson & Gold', promptText: 'Use a colour palette of deep crimson red and rich gold for clothing, robes, and background. Velvet and brocade in these tones. Golden jewellery and trim.', colors: ['#8B0000', '#B8860B', '#D4AF37', '#FFFFFF', '#2C2C2C'] },
  { id: 'navy-silver', label: 'Navy & Silver', promptText: 'Use a colour palette of deep navy blue and silver for clothing and background. Silver jewellery, grey silk accents. Cool, elegant tones.', colors: ['#1A2A4A', '#4A5568', '#9CA3AF', '#E5E7EB', '#374151'] },
  { id: 'burgundy-cream', label: 'Burgundy & Cream', promptText: 'Use a colour palette of burgundy and cream for clothing and background. Cream lace, burgundy velvet. Warm, classic tones.', colors: ['#722F37', '#8B4513', '#FFF8E7', '#F5F5DC', '#2C2C2C'] },
  { id: 'forest-gold', label: 'Forest Green & Gold', promptText: 'Use a colour palette of forest green and gold for clothing and background. Green velvet, golden embroidery. Rich, natural tones.', colors: ['#228B22', '#2E8B57', '#D4AF37', '#F5DEB3', '#1C2E1C'] },
  { id: 'royal-purple', label: 'Royal Purple & Gold', promptText: 'Use a colour palette of royal purple and gold for clothing and background. Purple velvet, gold trim and jewellery. Regal tones.', colors: ['#4B0082', '#6A0DAD', '#D4AF37', '#E6E6FA', '#2C2C2C'] },
  { id: 'earth-bronze', label: 'Earth Tones & Bronze', promptText: 'Use a colour palette of earth tones (brown, tan, olive) and bronze for clothing and background. Warm, muted, classical.', colors: ['#3D2C1E', '#8B7355', '#CD7F32', '#D2B48C', '#2C2C2C'] },
  { id: 'black-gold', label: 'Classic Black & Gold', promptText: 'Use a colour palette of black and gold for clothing and background. Black velvet, gold embroidery and jewellery. Timeless, formal.', colors: ['#1A1A1A', '#2C2C2C', '#D4AF37', '#FFD700', '#4A4A4A'] },
  { id: 'soft-pastels', label: 'Soft Pastels', promptText: 'Use a soft pastel colour palette (pale pink, mint, cream, lavender) for clothing and background. Gentle, dreamy tones.', colors: ['#E8A0A0', '#98D8AA', '#FFF8E7', '#E6E6FA', '#F5DEB3'] },
]

export function getColourPromptText(colourOptionId: string | undefined): string {
  if (!colourOptionId) return ''
  const opt = COLOUR_OPTIONS.find((c) => c.id === colourOptionId)
  return opt ? `\n\nCOLOUR PALETTE: ${opt.promptText}` : ''
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
        { id: 'hat', label: 'Feathered cap or crown', promptText: 'Add an elaborate feathered cap or small jeweled crown to the pet.' },
        { id: 'headband', label: 'Pearl headband', promptText: 'Add a delicate pearl headband to the pet.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear on the pet.' },
      ],
    },
    {
      id: 'cape',
      label: 'Cape or robe',
      choices: [
        { id: 'yes', label: 'Velvet cape', promptText: 'Dress the pet in a flowing velvet cape or regal robe.' },
        { id: 'no', label: 'No cape', promptText: 'No cape or robe, just the main attire.' },
      ],
    },
  ],
  family: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'hats', label: 'Crowns or feathered hats', promptText: 'Add crowns, feathered hats, or ornate headpieces to family members.' },
        { id: 'headbands', label: 'Pearl headbands', promptText: 'Add pearl headbands or decorative hair ribbons.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear on any family member.' },
      ],
    },
    {
      id: 'collar',
      label: 'Collars & ruffs',
      choices: [
        { id: 'ruffs', label: 'Elaborate ruffs', promptText: 'Add elaborate white ruffled ruffs to all subjects.' },
        { id: 'lace', label: 'Simple lace collars', promptText: 'Add simple lace collars or delicate neckpieces.' },
        { id: 'open', label: 'Open neck', promptText: 'Open neckline, no ruff or collar.' },
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
