/**
 * Portrait categories and style presets.
 * Currently using Renaissance style across all categories.
 * Easy to extend: add new styles to each category's styles array.
 */

export type CategoryId = 'pets' | 'family' | 'kids' | 'couples' | 'self'

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
    label: 'Family',
    slug: 'family',
    tagline: 'Your family immortalized in classic style',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Classical oil painting style inspired by European masters. Elegant, timeless, gallery-worthy.',
        subStyles: RENAISSANCE_SUB_STYLES,
        promptText: `${RENAISSANCE_BASE}

FOR FAMILIES SPECIFICALLY:
- Keep all family members' faces completely recognizable and unchanged
- Dress each person in coordinated Renaissance noble attire appropriate to their age
- Add family jewelry: matching brooches, coordinated necklaces, or family crests
- Create a formal family portrait composition with elegant poses`,
      },
    ],
  },
  {
    id: 'kids',
    label: 'Kids',
    slug: 'kids',
    tagline: 'Capture their wonder in timeless art',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Gentle, classical oil painting style. Soft lighting, warm tones, age-appropriate elegance.',
        subStyles: RENAISSANCE_SUB_STYLES,
        promptText: `${RENAISSANCE_BASE}

FOR CHILDREN SPECIFICALLY:
- Keep the child's face completely recognizable and unchanged
- Dress in age-appropriate Renaissance children's attire: soft velvet dresses or doublets with delicate embroidery
- Add gentle accessories: small pearl necklaces, ribbon headbands, or simple gold chains
- Use softer, warmer lighting and tender, innocent poses
- Include playful Renaissance elements like flowers or small toys from the period`,
      },
    ],
  },
  {
    id: 'couples',
    label: 'Couples',
    slug: 'couples',
    tagline: 'Your love story in classical elegance',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Romantic classical oil painting. Elegant, tender, museum-quality.',
        subStyles: RENAISSANCE_SUB_STYLES,
        promptText: `${RENAISSANCE_BASE}

FOR COUPLES SPECIFICALLY:
- Keep both subjects' faces completely recognizable and unchanged
- Dress both in coordinated Renaissance noble attire that complements each other
- Add romantic jewelry: matching rings, complementary necklaces, intertwined elements
- Create an intimate, romantic composition with elegant poses showing connection
- Use warm, flattering lighting that enhances the romantic mood`,
      },
    ],
  },
  {
    id: 'self',
    label: 'Self',
    slug: 'self',
    tagline: 'Your portrait as a work of art',
    styles: [
      {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Professional classical oil painting. Refined, distinguished, gallery-quality.',
        subStyles: RENAISSANCE_SUB_STYLES,
        promptText: `${RENAISSANCE_BASE}

FOR SELF PORTRAITS SPECIFICALLY:
- Keep the subject's face completely recognizable and unchanged
- Dress in distinguished Renaissance noble attire: elaborate doublet or gown with rich embroidery
- Add prominent jewelry: statement necklace, ornate rings, jeweled brooch, or decorative headpiece
- Create a powerful, confident pose befitting Renaissance nobility
- Use dramatic lighting to create depth and gravitas`,
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
  const subject = category.id === 'pets' ? 'beloved pet' : category.id === 'family' ? 'family' : category.id === 'kids' ? 'kids' : category.id === 'couples' ? 'couple' : 'portrait'
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

export const STYLE_GROUPS: StyleGroup[] = [
  {
    id: 'classic-art',
    title: 'Classic Art & Historical',
    styles: [
      { id: 'renaissance', title: 'Renaissance Oil Painting', description: '15th-16th century European masters.', searchKeywords: ['renaissance', 'oil', 'classical', 'old master'], subStyles: RENAISSANCE_SUB_STYLES, promptText: RENAISSANCE_BASE },
      { id: 'baroque-royal', title: 'Baroque Royal Portrait', description: 'Rich velvet drapes, golden baroque frames.', searchKeywords: ['baroque', 'royal', 'velvet', 'golden'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Baroque royal portrait. 17th-century European court. Rich crimson velvet, golden brocade, white ruffs. Opulent, luxurious. Replace clothing and background only.') },
      { id: 'rococo-elegance', title: 'Rococo Elegance', description: 'Vibrant painterly style with bold brushstrokes.', searchKeywords: ['rococo', 'elegance', 'pastels', 'french court'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Rococo portrait. 18th-century French court. Pale mint silk, pink satin, cream brocade. Soft pastels, rich color harmony. Replace clothing and background only.') },
      { id: 'neoclassical', title: 'Neoclassical Sculpture Style', description: 'Clean lines, marble-like elegance.', searchKeywords: ['neoclassical', 'sculpture', 'marble', 'greek'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Neoclassical portrait. Sculptural, marble-like elegance. Clean lines, classical drapery. Greek/Roman inspired. Replace clothing and background only.') },
      { id: 'victorian-era', title: 'Victorian Era Portrait', description: 'Formal Victorian period style.', searchKeywords: ['victorian', 'era', 'formal', '19th century'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Victorian era portrait. Formal period attire. Dark fabrics, high collars. Moody, dignified. Replace clothing and background only.') },
      { id: 'edwardian', title: 'Edwardian Aristocracy', description: 'Elegant Edwardian country estate.', searchKeywords: ['edwardian', 'aristocracy', 'estate', 'elegant'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Edwardian aristocracy portrait. Country estate elegance. Refined period attire. Soft natural light. Replace clothing and background only.') },
      { id: 'georgian', title: 'Georgian Noble Painting', description: '18th-century Georgian noble style.', searchKeywords: ['georgian', 'noble', '18th century'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Georgian noble portrait. 18th-century style. Rich fabrics, formal pose. Classical oil painting. Replace clothing and background only.') },
      { id: 'dutch-golden', title: 'Dutch Golden Age', description: 'Rembrandt-inspired chiaroscuro.', searchKeywords: ['dutch', 'golden age', 'rembrandt', 'chiaroscuro'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Dutch Golden Age portrait. Rembrandt-inspired chiaroscuro. Warm browns, dramatic light. Classical oil painting. Replace clothing and background only.') },
      { id: 'romanticism', title: 'Romanticism Painting', description: 'Emotional, dramatic Romantic era.', searchKeywords: ['romanticism', 'romantic', 'emotional', 'dramatic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Romanticism portrait. Emotional, dramatic. Nature-inspired, moody lighting. Romantic era aesthetic. Replace clothing and background only.') },
      { id: 'pre-raphaelite', title: 'Pre-Raphaelite Style', description: 'Vivid, medieval-inspired Pre-Raphaelite.', searchKeywords: ['pre-raphaelite', 'medieval', 'vivid', 'art nouveau'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Pre-Raphaelite portrait. Vivid colors, medieval-inspired. Flowing hair, nature elements. Dreamy, romantic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'royal-elite',
    title: 'Royal, Elite & Prestige',
    styles: [
      { id: 'british-aristocracy', title: 'British Aristocracy', description: 'Regal British noble style.', searchKeywords: ['british', 'aristocracy', 'noble', 'regal'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into British aristocracy portrait. Regal noble attire. Velvet, fur trim, pearls. Country estate background. Replace clothing and background only.') },
      { id: 'royal-court', title: 'Royal Court Portrait', description: 'Grand royal court style.', searchKeywords: ['royal', 'court', 'crown', 'throne'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into royal court portrait. Crown or tiara. Formal court attire. Throne room or palace. Replace clothing and background only.') },
      { id: 'country-manor', title: 'Country Manor Painting', description: 'Estate manor portrait style.', searchKeywords: ['country', 'manor', 'estate', 'landed'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into country manor portrait. Landed gentry style. Refined country attire. Manor house background. Replace clothing and background only.') },
      { id: 'heritage-museum', title: 'Heritage Museum Display', description: 'Museum-quality heritage portrait.', searchKeywords: ['heritage', 'museum', 'display', 'gallery'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into heritage museum portrait. Gallery-quality. Formal historical attire. Museum display aesthetic. Replace clothing and background only.') },
      { id: 'dynasty-portrait', title: 'Dynasty Portrait', description: 'Noble lineage, family dynasty.', searchKeywords: ['dynasty', 'lineage', 'noble', 'family'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into dynasty portrait. Noble lineage style. Formal hereditary attire. Grand family portrait aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'dark-academia',
    title: 'Dark Academia & Intellectual',
    styles: [
      { id: 'dark-academia-scholar', title: 'Dark Academia Scholar', description: 'Moody scholarly portrait.', searchKeywords: ['dark academia', 'scholar', 'moody', 'intellectual'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Dark Academia scholar portrait. Moody, scholarly. Books, tweed, warm lamplight. Library or study. Replace clothing and background only.') },
      { id: 'candlelit-library', title: 'Candlelit Library Portrait', description: 'Intimate library by candlelight.', searchKeywords: ['candlelit', 'library', 'candles', 'books'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into candlelit library portrait. Intimate study. Leather-bound books. Warm candlelight. Replace clothing and background only.') },
      { id: 'gothic-study', title: 'Gothic Study Room', description: 'Gothic study atmosphere.', searchKeywords: ['gothic', 'study', 'dark', 'moody'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into gothic study portrait. Dark, atmospheric. Stone walls, candlelight. Scholarly gothic aesthetic. Replace clothing and background only.') },
      { id: 'oxford-don', title: 'Oxford Don Aesthetic', description: 'Academic Oxford don style.', searchKeywords: ['oxford', 'don', 'academic', 'ivy league'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into Oxford don portrait. Academic, distinguished. Tweed, spectacles. University library. Replace clothing and background only.') },
      { id: 'classical-philosophy', title: 'Classical Philosophy Portrait', description: 'Philosopher, thinker aesthetic.', searchKeywords: ['philosophy', 'philosopher', 'thinker', 'classical'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into classical philosophy portrait. Thinker, scholar. Classical robes or academic attire. Ancient library. Replace clothing and background only.') },
      { id: 'midnight-academia', title: 'Midnight Academia', description: 'Late-night scholarly mood.', searchKeywords: ['midnight', 'academia', 'night', 'study'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into midnight academia portrait. Late-night study. Moonlight, lamp. Dark scholarly mood. Replace clothing and background only.') },
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
      { id: 'enchanted-forest', title: 'Enchanted Forest Style', description: 'Magical forest setting.', searchKeywords: ['enchanted', 'forest', 'magical', 'nature'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into enchanted forest portrait. Magical woodland. Soft fantasy lighting. Nature-inspired. Replace clothing and background only.') },
      { id: 'picture-book-art', title: 'Picture Book Art', description: 'Illustrated picture book style.', searchKeywords: ['picture book', 'illustration', 'children'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into picture book art portrait. Illustrated, storybook. Warm, friendly. Children\'s book aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'fantasy-mythical',
    title: 'Fantasy & Mythical',
    styles: [
      { id: 'high-fantasy-kingdom', title: 'High Fantasy Kingdom', description: 'Medieval fantasy world.', searchKeywords: ['high fantasy', 'kingdom', 'medieval', 'fantasy'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into high fantasy kingdom portrait. Medieval fantasy world. Noble or heroic attire. Castle, mountains. Replace clothing and background only.') },
      { id: 'epic-medieval-fantasy', title: 'Epic Medieval Fantasy', description: 'Epic fantasy hero style.', searchKeywords: ['epic', 'medieval', 'fantasy', 'hero'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into epic medieval fantasy portrait. Heroic fantasy attire. Dramatic lighting. Fantasy world. Replace clothing and background only.') },
      { id: 'mythical-hero', title: 'Mythical Hero Portrait', description: 'Legendary hero aesthetic.', searchKeywords: ['mythical', 'hero', 'legendary', 'epic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into mythical hero portrait. Legendary hero attire. Dramatic, epic. Fantasy world. Replace clothing and background only.') },
      { id: 'elven-nobility', title: 'Elven Nobility', description: 'Elegant elven noble style.', searchKeywords: ['elven', 'elf', 'nobility', 'fantasy'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into elven nobility portrait. Elegant elven attire. Ethereal, refined. Fantasy forest. Replace clothing and background only.') },
      { id: 'dark-fantasy-world', title: 'Dark Fantasy World', description: 'Moody dark fantasy style.', searchKeywords: ['dark fantasy', 'moody', 'gothic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into dark fantasy world portrait. Moody, dramatic. Dark fantasy attire. Atmospheric. Replace clothing and background only.') },
      { id: 'legendary-warrior', title: 'Legendary Warrior', description: 'Epic warrior portrait.', searchKeywords: ['legendary', 'warrior', 'epic', 'battle'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into legendary warrior portrait. Epic battle attire. Heroic pose. Fantasy world. Replace clothing and background only.') },
      { id: 'sword-sorcery', title: 'Sword & Sorcery', description: 'Classic sword and sorcery style.', searchKeywords: ['sword', 'sorcery', 'fantasy', 'adventure'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into sword and sorcery portrait. Adventurer attire. Fantasy world. Classic fantasy aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'rpg-game',
    title: 'RPG / Game-Inspired',
    styles: [
      { id: 'high-fantasy-rpg', title: 'High-Fantasy RPG Character', description: 'Fantasy RPG hero style.', searchKeywords: ['rpg', 'fantasy', 'game', 'character'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into high-fantasy RPG character portrait. Adventurer, heroic. Game art style. Fantasy world. Replace clothing and background only.') },
      { id: 'fantasy-champion', title: 'Fantasy Champion Style', description: 'Champion hero portrait.', searchKeywords: ['champion', 'fantasy', 'hero', 'game'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into fantasy champion portrait. Heroic champion attire. Arena or battlefield. Game-inspired aesthetic. Replace clothing and background only.') },
      { id: 'adventure-hero', title: 'Open-World Adventure Hero', description: 'Adventure game hero style.', searchKeywords: ['adventure', 'hero', 'open world', 'explorer'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into open-world adventure hero portrait. Explorer attire. Dramatic landscape. Adventure game aesthetic. Replace clothing and background only.') },
      { id: 'lore-hero', title: 'Lore-Driven Hero Portrait', description: 'Story-driven hero style.', searchKeywords: ['lore', 'hero', 'story', 'fantasy'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into lore-driven hero portrait. Fantasy hero attire. Rich narrative aesthetic. Epic fantasy world. Replace clothing and background only.') },
    ],
  },
  {
    id: 'sci-fi',
    title: 'Science Fiction',
    styles: [
      { id: 'futuristic-sci-fi', title: 'Futuristic Sci-Fi Portrait', description: 'Future sci-fi style.', searchKeywords: ['sci-fi', 'futuristic', 'future', 'space'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into futuristic sci-fi portrait. Sleek future attire. Space or tech background. Sci-fi aesthetic. Replace clothing and background only.') },
      { id: 'cyberpunk-neon', title: 'Cyberpunk Neon City', description: 'Neon cyberpunk style.', searchKeywords: ['cyberpunk', 'neon', 'city', 'futuristic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into cyberpunk neon city portrait. Neon lighting, tech accessories. Urban sci-fi. Blade Runner aesthetic. Replace clothing and background only.') },
      { id: 'space-opera', title: 'Space Opera Epic', description: 'Grand space opera style.', searchKeywords: ['space opera', 'space', 'epic', 'galactic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into space opera epic portrait. Galactic attire. Stars, spacecraft. Epic sci-fi. Replace clothing and background only.') },
      { id: 'starship-commander', title: 'Starship Commander', description: 'Space fleet commander style.', searchKeywords: ['starship', 'commander', 'space', 'military'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into starship commander portrait. Military space attire. Bridge or starship. Sci-fi command aesthetic. Replace clothing and background only.') },
      { id: 'interstellar-explorer', title: 'Interstellar Explorer', description: 'Space explorer style.', searchKeywords: ['interstellar', 'explorer', 'space', 'adventure'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into interstellar explorer portrait. Explorer space suit. Alien world or spacecraft. Sci-fi adventure. Replace clothing and background only.') },
    ],
  },
  {
    id: 'movie-poster',
    title: 'Movie Poster & Cinematic',
    styles: [
      { id: 'classic-hollywood-poster', title: 'Classic Hollywood Poster', description: 'Golden age cinema poster.', searchKeywords: ['hollywood', 'poster', 'classic', 'cinema'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into classic Hollywood poster portrait. Golden age cinema. Bold poster art. Film star quality. Replace clothing and background only.') },
      { id: 'epic-blockbuster-poster', title: 'Epic Blockbuster Poster', description: 'Dramatic blockbuster style.', searchKeywords: ['blockbuster', 'epic', 'poster', 'dramatic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into epic blockbuster poster portrait. Dramatic lighting. Bold composition. Film poster aesthetic. Replace clothing and background only.') },
      { id: 'noir-cinema', title: 'Noir Cinema', description: 'Film noir style.', searchKeywords: ['noir', 'cinema', 'film', 'moody'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into noir cinema portrait. Black and white. Moody shadows. 1940s film noir. Replace clothing and background only.') },
      { id: 'golden-age-cinema', title: 'Golden Age Cinema', description: 'Classic Hollywood glamour.', searchKeywords: ['golden age', 'cinema', 'hollywood', 'glamour'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into golden age cinema portrait. Classic Hollywood glamour. Soft lighting. Film star quality. Replace clothing and background only.') },
      { id: 'dramatic-key-art', title: 'Dramatic Key Art', description: 'Cinematic key art style.', searchKeywords: ['dramatic', 'key art', 'cinematic', 'poster'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into dramatic key art portrait. Cinematic composition. Bold lighting. Film poster aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'photography-modern',
    title: 'Photography & Modern',
    styles: [
      { id: 'professional-studio', title: 'Professional Studio Portrait', description: 'Studio portrait lighting.', searchKeywords: ['professional', 'studio', 'portrait', 'lighting'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into professional studio portrait. Clean studio lighting. High-end retouch. Magazine quality. Replace background only, keep face virtually identical.') },
      { id: 'cinematic-photography', title: 'Cinematic Photography', description: 'Film-like photography.', searchKeywords: ['cinematic', 'photography', 'film', 'dramatic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into cinematic photography portrait. Film-like color grading. Dramatic lighting. Movie still quality. Replace background only.') },
      { id: 'editorial-magazine', title: 'Editorial Magazine Cover', description: 'Magazine cover style.', searchKeywords: ['editorial', 'magazine', 'cover', 'vogue'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into editorial magazine cover portrait. Fashion editorial lighting. Clean, high-fashion. Magazine cover aesthetic. Replace background only.') },
      { id: 'black-white-film', title: 'Black & White Film Photography', description: 'Classic B&W film look.', searchKeywords: ['black white', 'film', 'photography', 'bw'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into black and white film photography portrait. Classic film grain. Timeless B&W. Replace background only.') },
      { id: 'golden-hour-portrait', title: 'Golden Hour Portrait', description: 'Warm golden hour light.', searchKeywords: ['golden hour', 'portrait', 'warm', 'sunset'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into golden hour portrait. Warm sunset lighting. Soft, flattering. Natural light aesthetic. Replace background only.') },
    ],
  },
  {
    id: 'vintage-retro',
    title: 'Vintage & Retro',
    styles: [
      { id: '1920s-art-deco', title: '1920s Art Deco', description: 'Roaring twenties style.', searchKeywords: ['1920s', 'art deco', 'roaring twenties', 'jazz age'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into 1920s Art Deco portrait. Flapper era. Geometric patterns. Jazz age glamour. Replace clothing and background only.') },
      { id: '1940s-film-noir', title: '1940s Film Noir', description: 'Classic film noir era.', searchKeywords: ['1940s', 'film noir', 'noir', 'classic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into 1940s film noir portrait. Moody shadows. Black and white. Classic noir aesthetic. Replace clothing and background only.') },
      { id: '1950s-classic', title: '1950s Classic Portrait', description: 'Mid-century classic style.', searchKeywords: ['1950s', 'classic', 'mid century', 'vintage'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into 1950s classic portrait. Mid-century style. Clean, elegant. Vintage glamour. Replace clothing and background only.') },
      { id: 'sepia-toned', title: 'Sepia Toned Portrait', description: 'Vintage sepia tones.', searchKeywords: ['sepia', 'toned', 'vintage', 'antique'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into sepia toned portrait. Vintage antique aesthetic. Warm brown tones. Old photograph feel. Replace background only.') },
    ],
  },
  {
    id: 'illustration-digital',
    title: 'Illustration & Digital Art',
    styles: [
      { id: 'pencil-illustration', title: 'Pencil Illustration', description: 'Hand-drawn pencil style.', searchKeywords: ['pencil', 'illustration', 'sketch', 'hand drawn'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into pencil illustration portrait. Hand-drawn sketch style. Graphite texture. Artistic illustration. Replace clothing and background only.') },
      { id: 'ink-drawing', title: 'Ink Drawing', description: 'Bold ink line art.', searchKeywords: ['ink', 'drawing', 'line art', 'bold'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into ink drawing portrait. Bold line art. Pen and ink style. Graphic illustration. Replace clothing and background only.') },
      { id: 'charcoal-portrait', title: 'Charcoal Portrait', description: 'Expressive charcoal art.', searchKeywords: ['charcoal', 'portrait', 'expressive', 'artistic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into charcoal portrait. Expressive charcoal technique. Dramatic shading. Fine art aesthetic. Replace clothing and background only.') },
      { id: 'digital-painting', title: 'Digital Painting', description: 'Painterly digital art.', searchKeywords: ['digital', 'painting', 'painterly', 'art'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into digital painting portrait. Painterly digital art. Rich colors. Concept art quality. Replace clothing and background only.') },
      { id: 'graphic-novel-style', title: 'Graphic Novel Style', description: 'Graphic novel illustration.', searchKeywords: ['graphic novel', 'illustration', 'comic', 'bold'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into graphic novel style portrait. Bold illustration. Comic art aesthetic. Dynamic composition. Replace clothing and background only.') },
    ],
  },
  {
    id: 'cartoon-stylized',
    title: 'Cartoon & Stylized',
    styles: [
      { id: '3d-animated-family', title: '3D Animated Family Style', description: 'Family-friendly 3D animated look.', searchKeywords: ['3d', 'animated', 'family', 'pixar'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into 3D animated family style portrait. Clean, friendly 3D animation. Warm, approachable. Family-friendly aesthetic. Replace clothing and background only.') },
      { id: 'anime-inspired', title: 'Anime-Inspired Portrait', description: 'Japanese anime style.', searchKeywords: ['anime', 'japanese', 'manga', 'stylized'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into anime-inspired portrait. Japanese anime aesthetic. Expressive, stylized. High-quality illustration. Replace clothing and background only.') },
      { id: 'manga-illustration', title: 'Manga Illustration', description: 'Manga comic style.', searchKeywords: ['manga', 'illustration', 'japanese', 'comic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into manga illustration portrait. Manga comic style. Clean lines. Japanese aesthetic. Replace clothing and background only.') },
      { id: 'storybook-cartoon', title: 'Storybook Cartoon', description: 'Gentle cartoon illustration.', searchKeywords: ['storybook', 'cartoon', 'gentle', 'children'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into storybook cartoon portrait. Gentle cartoon style. Warm, friendly. Children\'s book aesthetic. Replace clothing and background only.') },
    ],
  },
  {
    id: 'pet-specific',
    title: 'Pet-Specific Styles',
    styles: [
      { id: 'royal-pet-portrait', title: 'Royal Pet Portrait', description: 'Regal pet as nobility.', searchKeywords: ['royal', 'pet', 'noble', 'regal'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform pet into royal portrait. Regal attire. Velvet cushions. Crown or jewels. Keep pet face completely recognizable. Replace clothing and background only.') },
      { id: 'knight-warrior-pet', title: 'Knight / Warrior Pet', description: 'Pet as noble knight.', searchKeywords: ['knight', 'warrior', 'pet', 'armor'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform pet into knight/warrior portrait. Miniature armor. Heroic pose. Medieval setting. Keep pet face completely recognizable. Replace clothing and background only.') },
      { id: 'fantasy-familiar', title: 'Fantasy Familiar', description: 'Pet as magical familiar.', searchKeywords: ['fantasy', 'familiar', 'pet', 'magical'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform pet into fantasy familiar portrait. Magical companion. Fantasy setting. Mystical elements. Keep pet face completely recognizable. Replace clothing and background only.') },
      { id: 'storybook-animal', title: 'Storybook Animal', description: 'Pet as storybook character.', searchKeywords: ['storybook', 'animal', 'pet', 'whimsical'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform pet into storybook animal portrait. Whimsical illustration. Children\'s book style. Keep pet face completely recognizable. Replace clothing and background only.') },
      { id: 'medieval-bestiary', title: 'Medieval Bestiary Style', description: 'Pet in medieval bestiary style.', searchKeywords: ['medieval', 'bestiary', 'pet', 'illuminated'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform pet into medieval bestiary portrait. Illuminated manuscript style. Medieval decorative. Keep pet face completely recognizable. Replace clothing and background only.') },
    ],
  },
  {
    id: 'mood-based',
    title: 'Mood-Based Styles',
    styles: [
      { id: 'dramatic-moody', title: 'Dramatic & Moody', description: 'Dark, dramatic atmosphere.', searchKeywords: ['dramatic', 'moody', 'dark', 'atmospheric'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into dramatic moody portrait. Dark atmosphere. Strong shadows. Emotional depth. Replace background only.') },
      { id: 'light-airy', title: 'Light & Airy', description: 'Soft, breezy feel.', searchKeywords: ['light', 'airy', 'soft', 'bright'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into light airy portrait. Soft lighting. Bright, fresh. Minimal shadows. Replace background only.') },
      { id: 'warm-romantic', title: 'Warm & Romantic', description: 'Romantic, warm tones.', searchKeywords: ['warm', 'romantic', 'soft', 'loving'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into warm romantic portrait. Soft warm tones. Romantic atmosphere. Flattering light. Replace background only.') },
      { id: 'epic-grand', title: 'Epic & Grand', description: 'Grand, monumental feel.', searchKeywords: ['epic', 'grand', 'monumental', 'dramatic'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into epic grand portrait. Monumental composition. Dramatic scale. Heroic atmosphere. Replace background only.') },
      { id: 'calm-minimal', title: 'Calm & Minimal', description: 'Clean, minimal aesthetic.', searchKeywords: ['calm', 'minimal', 'clean', 'simple'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into calm minimal portrait. Clean composition. Simple background. Peaceful aesthetic. Replace background only.') },
      { id: 'powerful-heroic', title: 'Powerful & Heroic', description: 'Strong, heroic presence.', searchKeywords: ['powerful', 'heroic', 'strong', 'bold'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into powerful heroic portrait. Strong presence. Heroic pose. Bold lighting. Replace background only.') },
      { id: 'dreamlike-ethereal', title: 'Dreamlike & Ethereal', description: 'Soft, dreamy atmosphere.', searchKeywords: ['dreamlike', 'ethereal', 'dreamy', 'soft'], promptText: stylePrompt(FACE_PRESERVATION, 'Transform into dreamlike ethereal portrait. Soft, dreamy. Mystical atmosphere. Replace background only.') },
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
  kids: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'crown', label: 'Small crown', promptText: 'Add a small crown or tiara.' },
        { id: 'ribbon', label: 'Ribbon or headband', promptText: 'Add a delicate ribbon or pearl headband.' },
        { id: 'flower', label: 'Flower crown', promptText: 'Add a gentle flower crown or floral hairpiece.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear.' },
      ],
    },
    {
      id: 'jewelry',
      label: 'Jewelry',
      choices: [
        { id: 'pearls', label: 'Pearl necklace', promptText: 'Add a delicate pearl necklace.' },
        { id: 'ribbon', label: 'Ribbon bow', promptText: 'Add a ribbon bow or simple necklace.' },
        { id: 'minimal', label: 'Minimal', promptText: 'Minimal jewelry, keep it simple.' },
      ],
    },
  ],
  couples: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'both-ornate', label: 'Both ornate', promptText: 'Both subjects wear ornate headwear: crowns, feathered hats, or decorative headpieces.' },
        { id: 'complementary', label: 'Complementary', promptText: 'Complementary headwear: one ornate (crown/hat), one simpler (headband).' },
        { id: 'minimal', label: 'Minimal or none', promptText: 'Minimal headwear or none.' },
      ],
    },
    {
      id: 'style',
      label: 'Formality',
      choices: [
        { id: 'matching', label: 'Matching formal', promptText: 'Both wear matching formal Renaissance attire with coordinated colors.' },
        { id: 'contrast', label: 'Bold & soft', promptText: 'Contrasting styles: one in bold rich fabrics, one in softer complementary tones.' },
        { id: 'romantic', label: 'Romantic', promptText: 'Romantic, intimate styling with flowing fabrics and tender accessories.' },
      ],
    },
  ],
  self: [
    {
      id: 'headwear',
      label: 'Headwear',
      choices: [
        { id: 'hat', label: 'Feathered hat', promptText: 'Add an elaborate feathered cap or beret.' },
        { id: 'crown', label: 'Crown or tiara', promptText: 'Add a crown, tiara, or jeweled headpiece.' },
        { id: 'headband', label: 'Headband', promptText: 'Add a pearl or gold headband.' },
        { id: 'none', label: 'No headwear', promptText: 'No headwear.' },
      ],
    },
    {
      id: 'collar',
      label: 'Neckpiece',
      choices: [
        { id: 'ruff', label: 'Elaborate ruff', promptText: 'Add an elaborate white ruffled ruff.' },
        { id: 'lace', label: 'Lace collar', promptText: 'Add a delicate lace collar.' },
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
