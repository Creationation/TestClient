// Lädt die Unsplash-Platzhalterbilder einmalig nach public/images/stock, damit die Website keine
// Anfragen an Unsplash schickt (keine Weitergabe von IP-Adressen an Dritte, DSGVO).
// Aufruf: node scripts/stock-images.mjs  (nur nötig, wenn sich Bilder in src/content.js ändern)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { flavors, images, stockName } from '../src/content.js'

const dir = new URL('../public/images/stock/', import.meta.url)
mkdirSync(dir, { recursive: true })

const jobs = []
for (const f of flavors) for (const w of [480, 760, 1100]) jobs.push([f.image.id, w, Math.round(w * 1.25), f.image.crop])
for (const img of [...images.offer, ...images.gallery])
  if (img.id) for (const w of [500, 900, 1400]) jobs.push([img.id, w, Math.round(w / (img.ratio ?? 0.8)), img.crop])

for (const [id, w, h, crop = ''] of jobs) {
  const file = new URL(stockName(id, w, h), dir)
  if (existsSync(file)) continue
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&fm=jpg&q=75${crop}`)
  if (!res.ok) throw new Error(`${id} ${w}x${h}: ${res.status}`)
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  console.log('ok', stockName(id, w, h))
}
