/**
 * Verify theme-only / no-filter pipeline covers every category × style (and Renaissance sub-styles).
 * Also verifies per-style theme locks and colour palette integration.
 * Run: npx tsx scripts/audit-unfiltered-pipeline.ts
 */
import { buildPortraitPrompt } from '../lib/buildPortraitPrompt'
import {
  CATEGORIES,
  COLOUR_OPTIONS,
  STYLE_THEME_DEFINITIONS,
  getAllStyleIdsForCategory,
  getStylePrompt,
  RENAISSANCE_SUB_STYLES,
} from '../lib/styles'

const REQUIRED_MARKERS = [
  'PHOTOREALISTIC PHOTOGRAPH',
  'ZERO filters',
  'THEME ONLY',
  'theme on clothing and background',
  'STYLE LOCK',
] as const

let errors = 0
let checked = 0

console.log('LoveMemory — unfiltered pipeline + theme lock audit\n')

// Every library style must have a theme definition
for (const styleId of Object.keys(STYLE_THEME_DEFINITIONS)) {
  const def = STYLE_THEME_DEFINITIONS[styleId]
  if (!def.era || !def.setting || !def.clothing) {
    console.error(`  ✗ STYLE_THEME_DEFINITIONS["${styleId}"] incomplete`)
    errors++
  }
}

for (const category of CATEGORIES) {
  const styleIds = getAllStyleIdsForCategory(category.id)
  console.log(`\n${category.label} (${category.id}) — ${styleIds.length} styles`)

  for (const styleId of styleIds.sort()) {
    if (!STYLE_THEME_DEFINITIONS[styleId]) {
      console.error(`  ✗ ${styleId} — missing STYLE_THEME_DEFINITIONS entry`)
      errors++
    }

    const subStyles =
      styleId === 'renaissance' ? RENAISSANCE_SUB_STYLES.map((s) => s.id) : [undefined]

    for (const subStyleId of subStyles) {
      const label = subStyleId ? `${styleId}/${subStyleId}` : styleId
      const stylePrompt = getStylePrompt(category.id, styleId, subStyleId)
      const fullPrompt = buildPortraitPrompt({
        categoryId: category.id,
        styleId,
        subStyleId,
        colourOptionId: 'crimson-gold',
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

      if (!fullPrompt.includes('COLOUR PALETTE (mandatory')) {
        console.error(`  ✗ ${label} — colour palette not applied when user selects crimson-gold`)
        errors++
        itemOk = false
      }

      if (category.id === 'pets' && !fullPrompt.includes('FOR PETS (mandatory)')) {
        console.error(`  ✗ ${label} — missing PET_STYLE_SUFFIX for pets`)
        errors++
        itemOk = false
      }

      if (itemOk) {
        console.log(`  ✓ ${label}`)
      }
    }
  }
}

// Colour options (except style-default) must have prompt text
for (const opt of COLOUR_OPTIONS) {
  if (opt.id !== 'style-default' && !opt.promptText) {
    console.error(`  ✗ COLOUR_OPTIONS["${opt.id}"] missing promptText`)
    errors++
  }
}

console.log(`\nChecked ${checked} category × style combinations`)

if (errors) {
  console.error(`\n${errors} error(s) — pipeline or theme lock incomplete`)
  process.exit(1)
}

console.log('\nAll categories and styles use theme locks, colour integration, and no-filter prompts.')
