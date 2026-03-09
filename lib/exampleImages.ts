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

/** AI-generated family examples: /examples/family-{styleId}-1.png, etc. */
function getFamilyExamplePaths(styleId: string): string[] {
  return [
    `/examples/family-${styleId}-1.png`,
    `/examples/family-${styleId}-2.png`,
    `/examples/family-${styleId}-3.png`,
  ]
}

/** Per-category example images (3 per category) - used when no per-style images exist */
const BY_CATEGORY: Record<string, string[]> = {
  // pets: AI-generated per style - see getExampleImages
  'family-couple': [], // family uses getFamilyExamplePaths per style
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
  if (categorySlug === 'family' || categorySlug === 'family-couple') {
    return getFamilyExamplePaths(styleId)
  }
  const styleKey = `${categorySlug}-${styleId}`
  return BY_STYLE[styleKey] ?? BY_CATEGORY[categorySlug] ?? []
}
