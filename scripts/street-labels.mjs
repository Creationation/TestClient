// Straßennamen für die Karte „Der Weg zu uns“: OSM teilt eine Straße in viele kurze Stücke. Früher stand der Name
// nur auf dem längsten Stück (bei der Schulerstraße z. B. das Stück nördlich vom Dom statt der Straße am Salon).
// Hier werden die Stücke jeder Straße zu durchgehenden Linien verbunden; die Seite sucht sich darauf zur Laufzeit
// eine freie, ganz sichtbare Stelle (Route.jsx, placeLabels).
//   cd scripts/carte-dom && node ../street-labels.mjs ../../src/data/carte-dom.json
import { readFileSync, writeFileSync } from 'node:fs'

const [json] = process.argv.slice(2)
const SHOP = { lat: 48.2085676, lon: 16.3746127 }
const R = 6371000
const k = Math.cos((SHOP.lat * Math.PI) / 180)
const P = (lat, lon) => [((lon - SHOP.lon) * Math.PI) / 180 * R * k, -((lat - SHOP.lat) * Math.PI) / 180 * R]
const f = (n) => Math.round(n * 10) / 10
const key = ([x, y]) => `${f(x)},${f(y)}`
const len = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

const NAMES = ['Graben', 'Kärntner Straße', 'Rotenturmstraße', 'Wollzeile', 'Singerstraße', 'Schulerstraße', 'Bäckerstraße', 'Stubenring', 'Domgasse', 'Blutgasse', 'Goldschmiedgasse', 'Jasomirgottstraße', 'Stubenbastei']
const els = JSON.parse(readFileSync('area.json', 'utf8')).elements
const map = JSON.parse(readFileSync(json, 'utf8'))

// Stücke einer Straße an gemeinsamen Endpunkten zu Ketten verbinden
const chains = (segs) => {
  const out = []
  const left = segs.map((s) => [...s])
  while (left.length) {
    let chain = left.shift()
    let grew = true
    while (grew) {
      grew = false
      for (let i = 0; i < left.length; i++) {
        const s = left[i]
        const a = key(chain[0])
        const b = key(chain[chain.length - 1])
        if (key(s[0]) === b) chain = [...chain, ...s.slice(1)]
        else if (key(s[s.length - 1]) === b) chain = [...chain, ...s.slice(0, -1).reverse()]
        else if (key(s[s.length - 1]) === a) chain = [...s.slice(0, -1), ...chain]
        else if (key(s[0]) === a) chain = [...s.slice(1).reverse(), ...chain]
        else continue
        left.splice(i, 1)
        grew = true
        break
      }
    }
    out.push(chain)
  }
  return out
}

const labels = []
for (const name of NAMES) {
  const segs = els
    .filter((e) => e.tags?.name === name && e.tags.highway && e.geometry && e.tags.area !== 'yes' && e.tags.highway !== 'platform')
    .map((e) => e.geometry.map((g) => P(g.lat, g.lon)))
  if (!segs.length) continue
  // die längste durchgehende Linie (Fahrbahn), Nebenstücke wie Gehsteige fallen weg
  const best = chains(segs).sort((a, b) => len(b) - len(a))[0]
  labels.push({ name, pts: best.map(([x, y]) => [f(x), f(y)]), length: Math.round(len(best)) })
}
map.labels = labels
writeFileSync(json, JSON.stringify(map, null, 1))
console.log(labels.map((l) => `${l.name}:${l.length}m`).join(', '))
