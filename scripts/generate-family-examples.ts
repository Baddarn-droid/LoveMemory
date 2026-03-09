/**
 * Generate AI family example images for each style.
 * Run with: npx tsx scripts/generate-family-examples.ts
 * Requires: npm run dev running on http://localhost:3000
 *
 * 1. Uses 3 seed images from public/seed/family/: family1, family2, family3 (jpg, png, or avif).
 *    If missing, tries C:\Users\adria\Documents\Road to glory\Bilder and uses the first 3 image files.
 * 2. For each style, generates 3 images with family composition (everyone fully visible, headroom).
 * 3. Saves to public/examples/family-{styleId}-1.png, family-{styleId}-2.png, family-{styleId}-3.png.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALL_STYLE_IDS } from '../lib/styles'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SEED_DIR = path.join(ROOT, 'public', 'seed', 'family')
const BILDER_DIR = path.join(ROOT, '..', 'Bilder')
const EXAMPLES_DIR = path.join(ROOT, 'public', 'examples')
const PORT = process.env.PORT || 3000
const API_URL = `http://localhost:${PORT}/api/generate-portrait`

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.avif', '.webp']

function findSeedPath(index: number): string | null {
  const base = path.join(SEED_DIR, `family${index}`)
  for (const ext of IMAGE_EXT) {
    const p = base + ext
    if (fs.existsSync(p)) return p
  }
  return null
}

function getImageFilesFromDir(dir: string): string[] {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return []
  return fs
    .readdirSync(dir)
    .map((f) => path.join(dir, f))
    .filter((p) => {
      const stat = fs.statSync(p)
      if (!stat.isFile()) return false
      const ext = path.extname(p).toLowerCase()
      return IMAGE_EXT.includes(ext)
    })
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)))
}

async function ensureSeedImages(): Promise<string[]> {
  fs.mkdirSync(SEED_DIR, { recursive: true })
  const paths: string[] = []
  for (let i = 1; i <= 3; i++) {
    const p = findSeedPath(i)
    if (p) {
      console.log(`Using seed: ${path.basename(p)}`)
      paths.push(p)
    } else break
  }
  if (paths.length === 3) return paths

  const fromBilder = getImageFilesFromDir(BILDER_DIR).slice(0, 3)
  if (fromBilder.length < 3) {
    throw new Error(
      `Need 3 family seed images. Add family1, family2, family3 to public/seed/family/ (or add at least 3 images to ${BILDER_DIR})`
    )
  }
  fromBilder.forEach((p) => console.log(`Using from Bilder: ${path.basename(p)}`))
  return fromBilder
}

async function generateOne(
  imagePath: string,
  styleId: string,
  index: number
): Promise<Buffer> {
  const formData = new FormData()
  const ext = path.extname(imagePath).toLowerCase()
  const mime =
    ext === '.png'
      ? 'image/png'
      : ext === '.avif'
        ? 'image/avif'
        : ext === '.webp'
          ? 'image/webp'
          : 'image/jpeg'
  const blob = new Blob([fs.readFileSync(imagePath)], { type: mime })
  formData.append('image', blob, path.basename(imagePath))
  formData.append('category', 'family')
  formData.append('style', styleId)

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  const text = await res.text()
  let data: { b64?: string; url?: string; error?: string }
  try {
    data = JSON.parse(text) as { b64?: string; url?: string; error?: string }
  } catch {
    throw new Error(
      !res.ok ? `API ${res.status}: ${text.slice(0, 200)}` : 'Response was not JSON'
    )
  }
  if (!res.ok) throw new Error(data.error || `API ${res.status}`)
  if (data.b64) return Buffer.from(data.b64, 'base64')
  if (data.url) {
    const imgRes = await fetch(data.url)
    return Buffer.from(await imgRes.arrayBuffer())
  }
  throw new Error('No image in response')
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const limitArg = args.find((a) => a !== '--force')
  const limit = limitArg ? parseInt(limitArg, 10) : undefined
  const styleIds = limit ? ALL_STYLE_IDS.slice(0, limit) : ALL_STYLE_IDS

  console.log('Generating family examples for', styleIds.length, 'styles')
  if (force) console.log('(--force: regenerating existing files)')
  if (limit) console.log('(limited to first', limit, 'styles - remove arg for all)')
  console.log('Seed dir:', SEED_DIR)
  console.log('Bilder fallback:', BILDER_DIR)
  console.log('Output:', EXAMPLES_DIR)
  console.log('')

  const seedPaths = await ensureSeedImages()
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true })

  let done = 0
  const total = styleIds.length * 3

  for (const styleId of styleIds) {
    for (let i = 0; i < 3; i++) {
      const outPath = path.join(EXAMPLES_DIR, `family-${styleId}-${i + 1}.png`)
      if (!force && fs.existsSync(outPath)) {
        console.log(`Skip (exists): family-${styleId}-${i + 1}.png`)
        done++
        continue
      }
      try {
        console.log(`Generating: family-${styleId}-${i + 1}.png`)
        const buf = await generateOne(seedPaths[i], styleId, i + 1)
        fs.writeFileSync(outPath, buf)
        done++
        console.log(`  Done (${done}/${total})`)
      } catch (err) {
        console.error(`  Error:`, err)
      }
    }
  }

  console.log('')
  console.log('Finished.', done, 'images generated.')
}

main().catch(console.error)
