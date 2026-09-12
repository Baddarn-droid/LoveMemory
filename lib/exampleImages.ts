/**
 * Example images for each category and style.
 * Pets: 1 = cat, 2 = horse, 3 = dachshund
 * People: 1 = family of four, 2 = parents & children, 3 = individual man, 4 = individual woman
 */

/** Bump when example PNGs are replaced so Next/browser do not keep old thumbs. */
const EXAMPLE_ASSET_VERSION = 'people-wide-1'

function withVersion(path: string): string {
  return `${path}?v=${EXAMPLE_ASSET_VERSION}`
}

function getPetExamplePaths(styleId: string): string[] {
  return [
    withVersion(`/examples/pets-${styleId}-1.png`),
    withVersion(`/examples/pets-${styleId}-2.png`),
    withVersion(`/examples/pets-${styleId}-3.png`),
  ]
}

function getFamilyExamplePaths(styleId: string): string[] {
  return [
    withVersion(`/examples/family-${styleId}-1.png`),
    withVersion(`/examples/family-${styleId}-2.png`),
    withVersion(`/examples/family-${styleId}-3.png`),
    withVersion(`/examples/family-${styleId}-4.png`),
  ]
}

/**
 * Get example image URLs for a category and style (different subjects).
 */
export function getExampleImages(categorySlug: string, styleId: string): string[] {
  if (categorySlug === 'pets') {
    return getPetExamplePaths(styleId)
  }
  if (categorySlug === 'family' || categorySlug === 'family-couple') {
    return getFamilyExamplePaths(styleId)
  }
  return []
}

/** Rotate cat / horse / dachshund (pets) or different family groups (people) across a list. */
export function getCatalogThumb(categorySlug: string, styleId: string, mixIndex: number): string | undefined {
  const images = getExampleImages(categorySlug, styleId)
  if (!images.length) return undefined
  return images[mixIndex % images.length]
}

const PET_EXAMPLE_LABELS = ['Cat', 'Horse', 'Dachshund']
const PEOPLE_EXAMPLE_LABELS = ['Family of four', 'Parents & children', 'Portrait', 'Portrait']

export function getExampleSubjectLabel(categorySlug: string, exampleIndex: number): string {
  const labels = categorySlug === 'pets' ? PET_EXAMPLE_LABELS : PEOPLE_EXAMPLE_LABELS
  return labels[exampleIndex] ?? `Example ${exampleIndex + 1}`
}

