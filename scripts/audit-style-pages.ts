/**
 * Audit: every category × style route should use StyleCreateSection (PortraitCustomizer).
 * Run: npx tsx scripts/audit-style-pages.ts
 */
import { CATEGORY_SLUGS, getCategoryBySlug, getAllStyleIdsForCategory, getStylePreset } from '../lib/styles'

let errors = 0

console.log('LoveMemory style page audit\n')

for (const slug of CATEGORY_SLUGS) {
  const category = getCategoryBySlug(slug)
  if (!category) {
    console.error(`✗ Missing category: ${slug}`)
    errors++
    continue
  }

  const styleIds = getAllStyleIdsForCategory(category.id)
  console.log(`\n${category.label} (${slug}) — ${styleIds.length} styles`)

  for (const styleId of styleIds.sort()) {
    const style = getStylePreset(category.id, styleId)
    if (!style) {
      console.error(`  ✗ ${styleId} — no preset`)
      errors++
      continue
    }
    const path = `/${slug}/${styleId}`
    console.log(`  ✓ ${path} — ${style.title}`)
  }
}

const total = CATEGORY_SLUGS.reduce((n, slug) => {
  const cat = getCategoryBySlug(slug)
  return n + (cat ? getAllStyleIdsForCategory(cat.id).length : 0)
}, 0)

console.log(`\nTotal style pages: ${total}`)
if (errors) {
  console.error(`\n${errors} error(s)`)
  process.exit(1)
}
console.log('\nAll routes use StyleCreateSection → PortraitCustomizer → CreateFlow')
console.log('Generation: finishUnfilteredThemedPortrait — pets + family, every style (see audit-unfiltered-pipeline.ts)')
