/**
 * Example images for each category and style.
 * Pet examples are AI-generated per style and stored in /examples/.
 * Other categories use Unsplash or local files until AI examples are added.
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80`

/** AI-generated pet examples: /examples/pets-{styleId}-1.png, etc. */
function getPetExamplePaths(styleId: string): string[] {
  return [
    `/examples/pets-${styleId}-1.png`,
    `/examples/pets-${styleId}-2.png`,
    `/examples/pets-${styleId}-3.png`,
  ]
}

/** Per-category example images (3 per category) - used when no per-style images exist */
const BY_CATEGORY: Record<string, string[]> = {
  // pets: AI-generated per style - see getExampleImages
  family: [
    '/examples/family-renaissance-1.png', // Local example
    U('1511895426328-dc8714191300'),     // Family
    U('1529156069898-49953e39b3ac'),     // Family outdoor
  ],
  kids: [
    U('1503454537195-1dcabb73ffb9'), // Child
    U('1544776193-352d25d82dab'),    // Kids
    U('1503919886217-6752b63d596c'), // Child portrait
  ],
  couples: [
    U('1522673607200-164d1b6ce486'), // Couple
    U('1529333166437-7750ae6912c6'), // Couple portrait
    U('1519741497674-611481863552'), // Couple
  ],
  self: [
    U('1507003211169-0a1dd7228f2d'), // Portrait
    U('1500648767791-00dcc994a43e'), // Man portrait
    U('1494790108377-be9c29b29330'), // Woman portrait
  ],
}

/** Per-style overrides: key = "category-styleId", value = [url1, url2, url3] */
const BY_STYLE: Record<string, string[]> = {
  // Add per-style overrides here when you have style-specific images
  // e.g. 'pets-renaissance': [url1, url2, url3],
}

/**
 * Get 3 example image URLs for a category and style.
 * Pets: AI-generated per style at /examples/pets-{styleId}-1|2|3.png
 * Others: BY_STYLE override or BY_CATEGORY fallback.
 */
export function getExampleImages(categorySlug: string, styleId: string): string[] {
  if (categorySlug === 'pets') {
    return getPetExamplePaths(styleId)
  }
  const styleKey = `${categorySlug}-${styleId}`
  return BY_STYLE[styleKey] ?? BY_CATEGORY[categorySlug] ?? []
}
