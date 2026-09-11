/**
 * Generate AI pet example images for each style.
 * Run with: npm run generate-pet-examples -- --force
 * Requires XAI_API_KEY in frontend/.env.local
 * Every pet is generated lying down, as a real quadruped (no human arms).
 *
 * 1. Uses 3 seed images from public/seed/pets/: pet1, pet2, pet3 (jpg or png).
 *    Recommended: cat (1), horse (2), dachshund (3) — centered, not too zoomed.
 *    If missing, downloads fallback images from Unsplash.
 * 2. For each style (Renaissance, Baroque, Rococo, etc.), generates 3 images.
 * 3. Saves to public/examples/pets-{styleId}-1.png, pets-{styleId}-2.png, pets-{styleId}-3.png.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALL_STYLE_IDS } from '../lib/styles'
import { buildPortraitPrompt } from '../lib/buildPortraitPrompt'
import { generatePortraitImage } from '../lib/portraitGeneration'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SEED_DIR = path.join(ROOT, 'public', 'seed', 'pets')
const EXAMPLES_DIR = path.join(ROOT, 'public', 'examples')

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

/** Unsplash fallback URLs if seed images are missing (dog, cat, dog) */
const SEED_URLS = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1024',
]

function findSeedPath(index: number): string | null {
  const base = path.join(SEED_DIR, `pet${index}`)
  for (const ext of ['.jpg', '.jpeg', '.png', '.avif']) {
    const p = base + ext
    if (fs.existsSync(p)) return p
  }
  return null
}

async function ensureSeedImages(): Promise<string[]> {
  fs.mkdirSync(SEED_DIR, { recursive: true })
  const paths: string[] = []
  for (let i = 1; i <= 3; i++) {
    let p = findSeedPath(i)
    if (!p) {
      console.log(`No pet${i} image found, downloading fallback...`)
      p = path.join(SEED_DIR, `pet${i}.jpg`)
      const res = await fetch(SEED_URLS[i - 1])
      if (!res.ok) {
        if (i > 1) {
          console.log(`  Failed (${res.status}), using pet1 as fallback`)
          fs.copyFileSync(paths[0], p)
        } else {
          throw new Error(`Failed to download seed ${i}: ${res.status}`)
        }
      } else {
        const buf = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(p, buf)
        console.log(`  Saved to ${p}`)
      }
    } else {
      console.log(`Using seed: ${path.basename(p)}`)
    }
    paths.push(p)
  }
  return paths
}

async function generateOne(imagePath: string, styleId: string, species: 'cat' | 'horse' | 'dog'): Promise<Buffer> {
  const apiKey = process.env.XAI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('XAI_API_KEY is not set in .env.local')
  }
  const prompt = buildPortraitPrompt({
    categoryId: 'pets',
    styleId,
    petPose: 'laying',
    petSpecies: species,
  })
  const b64 = await generatePortraitImage({
    apiKey,
    sourceBuffer: fs.readFileSync(imagePath),
    prompt,
    category: 'pets',
    tier: 'preview',
  })
  return Buffer.from(b64, 'base64')
}

async function main() {
  // Usage: npx tsx scripts/generate-pet-examples [--force] [limit]
  // --force = regenerate even if file exists (for fixing framing/headroom)
  // limit = number of styles to process (e.g. 5 for quick test)
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const stylesArg = args.find((a) => a.startsWith('--styles='))?.slice('--styles='.length)
  const slotsArg = args.find((a) => a.startsWith('--slots='))?.slice('--slots='.length)
  const limitArg = args.find((a) => !a.startsWith('--') && a !== '--force')
  const limit = limitArg ? parseInt(limitArg, 10) : undefined
  const styleIds = stylesArg
    ? stylesArg.split(',').map((s) => s.trim()).filter(Boolean)
    : limit
      ? ALL_STYLE_IDS.slice(0, limit)
      : ALL_STYLE_IDS
  const slots = slotsArg
    ? slotsArg.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => n >= 1 && n <= 3)
    : [1, 2, 3]
  const speciesForSlot: Array<'cat' | 'horse' | 'dog'> = ['cat', 'horse', 'dog']

  console.log('Generating pet examples for', styleIds.length, 'styles')
  if (force) console.log('(--force: regenerating existing files)')
  if (limit) console.log('(limited to first', limit, 'styles - remove arg for all)')
  console.log('Seed images:', SEED_DIR)
  console.log('Output:', EXAMPLES_DIR)
  console.log('')

  const seedPaths = await ensureSeedImages()
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true })

  let done = 0
  const total = styleIds.length * slots.length

  for (const styleId of styleIds) {
    for (const slot of slots) {
      const i = slot - 1
      const outPath = path.join(EXAMPLES_DIR, `pets-${styleId}-${slot}.png`)
      if (!force && fs.existsSync(outPath)) {
        console.log(`Skip (exists): pets-${styleId}-${slot}.png`)
        done++
        continue
      }
      try {
        console.log(`Generating: pets-${styleId}-${slot}.png (${speciesForSlot[i]})`)
        const buf = await generateOne(seedPaths[i], styleId, speciesForSlot[i])
        fs.writeFileSync(outPath, buf)
        done++
        console.log(`  Done (${done}/${styleIds.length * slots.length})`)
      } catch (err) {
        console.error(`  Error:`, err)
      }
    }
  }

  console.log('')
  console.log('Finished.', done, 'images generated.')
}

main().catch(console.error)
