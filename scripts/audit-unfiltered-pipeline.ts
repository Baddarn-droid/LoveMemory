/**
 * Verify theme-only / no-filter pipeline covers every category × style (and Renaissance sub-styles).
 * Run: npx tsx scripts/audit-unfiltered-pipeline.ts
 */
import { buildPortraitPrompt } from '../lib/buildPortraitPrompt'
import {
  CATEGORIES,
  PHOTOREALISTIC_WHOLE_IMAGE,
  getAllStyleIdsForCategory,
  getStylePrompt,
  RENAISSANCE_SUB_STYLES,
  type CategoryId,
} from '../lib/styles'

const REQUIRED_MARKERS = [
  'PHOTOREALISTIC PHOTOGRAPH',
  'ZERO filters',
  'THEME ONLY',
  'theme on clothing and background',
] as const

let errors = 0
let checked = 0

console.log('LoveMemory — unfiltered pipeline audit\n')

for (const category of CATEGORIES) {
  const styleIds = getAllStyleIdsForCategory(category.id)
  console.log(`\n${category.label} (${category.id}) — ${styleIds.length} styles`)

  for (const styleId of styleIds.sort()) {
    const subStyles =
      styleId === 'renaissance' ? RENAISSANCE_SUB_STYLES.map((s) => s.id) : [undefined]

    for (const subStyleId of subStyles) {
      const label = subStyleId ? `${styleId}/${subStyleId}` : styleId
      const stylePrompt = getStylePrompt(category.id, styleId, subStyleId)
      const fullPrompt = buildPortraitPrompt({
        categoryId: category.id,
        styleId,
        subStyleId,
        clothingChoices: undefined,
      })

      checked++

      let itemOk = true

      if (!stylePrompt?.includes('PHOTOREALISTIC PHOTOGRAPH')) {
        console.error(`  ✗ ${label} — getStylePrompt missing PHOTOREALISTIC wrapper`)
        errors++
        itemOk = false
      }

      for (const marker of REQUIRED_MARKERS) {
        if (!fullPrompt.toLowerCase().includes(marker.toLowerCase())) {
          console.error(`  ✗ ${label} — buildPortraitPrompt missing "${marker}"`)
          errors++
          itemOk = false
        }
      }

      if (itemOk) {
        console.log(`  ✓ ${label}`)
      }
    }
  }
}

console.log(`\nChecked ${checked} category × style combinations`)

if (errors) {
  console.error(`\n${errors} error(s) — unfiltered pipeline not universal`)
  process.exit(1)
}

console.log('\nAll categories and styles use theme-only, no-filter prompts + post-process finish.')
