// Karte „Der Weg zu uns“ neu erzeugen: OSM-Daten + Fußwege (OSRM) → public/images/carte-dom.svg
// (nur Formen) und src/data/carte-dom.json (Wege, Startpunkte, Straßennamen), in Metern,
// Salon-Eingang = 0 0, Norden oben. Daten © OpenStreetMap-Mitwirkende (ODbL).
//
// 1. Im Ordner scripts/carte-dom die OSM-Daten laden (nicht im Repo, ~3 MB). Overpass verlangt einen User-Agent:
//    curl -s -A "gelati-am-dom-map/1.0" --data-urlencode 'data=[out:json][timeout:90];(way["building"](48.2040,16.3665,48.2120,16.3820);relation["building"](48.2040,16.3665,48.2120,16.3820);way["highway"](48.2040,16.3665,48.2120,16.3820);way["place"="square"](48.2040,16.3665,48.2120,16.3820);way["area:highway"](48.2040,16.3665,48.2120,16.3820);way["leisure"="park"](48.2040,16.3665,48.2120,16.3820);way["landuse"="grass"](48.2040,16.3665,48.2120,16.3820););out geom;' https://overpass-api.de/api/interpreter -o area.json
//    Dachflächen und Türme des Doms (building:part):
//    curl -s -A "gelati-am-dom-map/1.0" --data-urlencode 'data=[out:json][timeout:60];(way["building:part"](48.2078,16.3718,48.2092,16.3745);relation["building:part"](48.2078,16.3718,48.2092,16.3745););out geom;' https://overpass-api.de/api/interpreter -o parts.json
// 2. Wege (liegen schon da), z. B.: https://routing.openstreetmap.de/routed-foot/route/v1/driving/<lon,lat Start>;16.3746127,48.2085676?overview=full&geometries=geojson
//    dom 16.37236,48.20857 (Haupttor) · u 16.37195,48.20812 (Ausgang Stock-im-Eisen-Platz)
//    graben 16.36988,48.20878 (Pestsäule) · stubentor 16.379313,48.207754 über 16.3767,48.2078 (durch die Schulerstraße)
// 3. cd scripts/carte-dom && node ../build-map.mjs ../../public/images/carte-dom.svg ../../src/data/carte-dom.json
import { readFileSync, writeFileSync } from 'node:fs'

const [outSvg, outJson] = process.argv.slice(2)
const SHOP = { lat: 48.2085676, lon: 16.3746127 }
const DOM_ID = 212496461
const R = 6371000
const k = Math.cos((SHOP.lat * Math.PI) / 180)
const P = (lat, lon) => [((lon - SHOP.lon) * Math.PI / 180) * R * k, -((lat - SHOP.lat) * Math.PI / 180) * R]
const f = (n) => Math.round(n * 10) / 10
const pathOf = (pts, close) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + (close ? 'Z' : '')
const geo = (e) => e.geometry.map((g) => P(g.lat, g.lon))

// Douglas-Peucker: glatte Kanten statt Meter-Treppchen, ohne unnötige Punkte
const simplify = (pts, tol = 0.25) => {
  if (pts.length < 4) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [ax, ay] = pts[a]
    const [bx, by] = pts[b]
    const len = Math.hypot(bx - ax, by - ay) || 1
    let max = 0
    let idx = -1
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len
      if (d > max) (max = d), (idx = i)
    }
    if (max > tol) (keep[idx] = 1), stack.push([a, idx], [idx, b])
  }
  return pts.filter((_, i) => keep[i])
}
// geschlossener Ring: am entferntesten Punkt teilen, beide Hälften vereinfachen
const shapeOf = (ring) => {
  const pts = ring.slice(0, -1)
  if (pts.length < 4) return pathOf(pts, true)
  let far = 1
  for (let i = 1; i < pts.length; i++)
    if (Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]) > Math.hypot(pts[far][0] - pts[0][0], pts[far][1] - pts[0][1])) far = i
  return pathOf([...simplify(pts.slice(0, far + 1)), ...simplify([...pts.slice(far), pts[0]]).slice(1, -1)], true)
}

const data = JSON.parse(readFileSync('area.json', 'utf8'))
const els = data.elements
const parts = JSON.parse(readFileSync('parts.json', 'utf8')).elements.filter((e) => e.geometry)

// Bounds of the drawn area (metres)
const [W0, N0] = P(48.2120, 16.3665)
const [E0, S0] = P(48.2040, 16.3820)
const box = { x: f(W0), y: f(N0), w: f(E0 - W0), h: f(S0 - N0) }

const buildings = []
const plazas = []
const green = []
let dom = null
for (const e of els) {
  const t = e.tags || {}
  if (e.id === DOM_ID) {
    dom = geo(e)
    continue
  }
  if (t.building && e.type === 'way' && e.geometry) buildings.push(shapeOf(geo(e)))
  if (t.building && e.type === 'relation') for (const m of e.members || []) if (m.geometry) buildings.push(shapeOf(geo(m)))
  if ((t['area:highway'] || (t.highway === 'pedestrian' && t.area === 'yes') || t.place === 'square') && e.geometry) plazas.push(shapeOf(geo(e)))
  if ((t.leisure === 'park' || t.landuse === 'grass') && e.geometry) green.push(shapeOf(geo(e)))
}

// ---------- Stephansdom: Dachflächen und Türme aus den OSM-Bauteilen ----------
const inside = ([x, y], poly) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const centroid = (pts) => {
  const p = pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1] ? pts.slice(0, -1) : pts
  return [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length]
}
const area = (pts) => Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0) / 2)
const COMPASS = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 }
const bearing = (v) => (v in COMPASS ? COMPASS[v] : Number(v))
// Licht von Nordwesten: Flächen, die nach Südosten schauen, liegen im Schatten
const shade = (facing) => {
  const lit = Math.cos(((facing - 315) * Math.PI) / 180)
  return lit > 0 ? `<path d="__D__" fill="#FFF8E6" fill-opacity="${f(lit * 0.16 * 10) / 10}"/>` : `<path d="__D__" fill="#1E2620" fill-opacity="${f(-lit * 0.3 * 100) / 100}"/>`
}
const withShade = (d, facing) => shade(facing).replace('__D__', d)
// Polygon an einer Geraden durch c mit Richtung (dx, dy) teilen (Sutherland-Hodgman)
const clipHalf = (pts, c, n, sign) => {
  const side = (p) => sign * ((p[0] - c[0]) * n[0] + (p[1] - c[1]) * n[1])
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const sa = side(a)
    const sb = side(b)
    if (sa >= 0) out.push(a)
    if (sa * sb < 0) {
      const t = sa / (sa - sb)
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
    }
  }
  return out
}
// Kompassrichtung → SVG-Vektor (x Osten, y Süden)
const vec = (b) => [Math.sin((b * Math.PI) / 180), -Math.cos((b * Math.PI) / 180)]

const domParts = parts
  .map((e) => ({ tags: e.tags, pts: geo(e).slice(0, -1) }))
  .filter((p) => inside(centroid(p.pts), dom) && p.tags.height)
  .sort((a, b) => Number(a.tags.height) - Number(b.tags.height))

const NAVE = 125 // Firstrichtung des Langhauses
const cathedral = []
for (const { tags, pts } of domParts) {
  const d = pathOf(pts, true)
  const shape = tags['roof:shape']
  const tiles = tags['roof:material'] === 'roof_tiles'
  const big = Number(tags.height) >= 36
  if (shape === 'pyramidal') {
    // Turmhelm von oben: Dreiecke zur Spitze, jedes nach seiner Himmelsrichtung schattiert
    const c = centroid(pts)
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      const mx = (a[0] + b[0]) / 2 - c[0]
      const my = (a[1] + b[1]) / 2 - c[1]
      const tri = pathOf([a, b, c], true)
      cathedral.push(`<path d="${tri}" fill="#D9CBA4" stroke="#B8A57A" stroke-width="0.25" stroke-linejoin="round"/>`)
      cathedral.push(withShade(tri, ((Math.atan2(mx, -my) * 180) / Math.PI + 360) % 360))
    }
    continue
  }
  if (shape === 'dome' || tags['roof:material'] === 'copper') {
    const c = centroid(pts)
    const r = Math.sqrt(area(pts) / Math.PI)
    cathedral.push(`<path d="${d}" fill="url(#copper)" stroke="#5F8573" stroke-width="0.3"/>`)
    cathedral.push(`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * 0.18)}" fill="#C8A35A"/>`)
    continue
  }
  if (!tiles) {
    cathedral.push(`<path d="${d}" fill="#DCCFAE" stroke="#BCA97E" stroke-width="0.3" stroke-linejoin="round"/>`)
    continue
  }
  const fill = big ? 'url(#roof)' : '#A9B39F'
  if (shape === 'gabled') {
    // Satteldach: zwei Hälften am First, eine im Licht, eine im Schatten
    const ridge = tags['roof:direction'] ? bearing(tags['roof:direction']) + 90 : area(pts) > 600 ? NAVE : NAVE - 90
    const [rx, ry] = vec(ridge)
    const n = [-ry, rx]
    const c = centroid(pts)
    for (const sign of [1, -1]) {
      const half = clipHalf(pts, c, n, sign)
      if (half.length < 3) continue
      const hd = pathOf(half, true)
      const facing = (Math.atan2(sign * n[0], -sign * n[1]) * 180) / Math.PI
      cathedral.push(`<path d="${hd}" fill="${fill}"/>`, withShade(hd, (facing + 360) % 360))
    }
    cathedral.push(`<path d="${d}" fill="none" stroke="#5C6656" stroke-width="0.3" stroke-linejoin="round"/>`)
    continue
  }
  cathedral.push(`<path d="${d}" fill="${fill}" stroke="#5C6656" stroke-width="0.3" stroke-linejoin="round"/>`)
  if (tags['roof:direction']) cathedral.push(withShade(d, bearing(tags['roof:direction'])))
}

// Schatten des Südturms (138 m) fällt lang nach Südosten
const south = domParts.find((p) => p.tags.name === 'Südturm').pts
const apex = (() => {
  const c = centroid(south)
  return [c[0] + 26, c[1] + 34]
})()
const towerShadow = (() => {
  // Hülle aus Turmgrundriss und Schattenspitze
  const pts = [...south, apex]
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const lower = []
  for (const p of s) {
    while (lower.length > 1 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper = []
  for (const p of s.reverse()) {
    while (upper.length > 1 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop()
    upper.push(p)
  }
  return pathOf([...lower.slice(0, -1), ...upper.slice(0, -1)], true)
})()

const domD = pathOf(dom, true)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.w} ${box.h}" width="${Math.round(box.w * 2)}" height="${Math.round(box.h * 2)}">
<defs>
<!-- das Zickzack-Ziegeldach des Doms: spitze Chevrons in Gold, Elfenbein und Grün, entlang des Firsts -->
<pattern id="roof" width="4" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(${NAVE - 90})">
<rect width="4" height="6" fill="#55705C"/>
${[0, 1, 2, 3, 4, 5]
  .map((j) => {
    const y = j * 1.5 - 1.5
    const c = ['#C9AD6E', '#ECE4CC', '#55705C', '#93A88A'][(j + 3) % 4]
    return `<path d="M0 ${y}L2 ${y - 1.5}L4 ${y}L4 ${y + 1.5}L2 ${y}L0 ${y + 1.5}Z" fill="${c}"/>`
  })
  .join('')}
</pattern>
<radialGradient id="copper" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#B9D6C4"/><stop offset="1" stop-color="#6F9A86"/></radialGradient>
<path id="b" d="${buildings.join('')}"/>
</defs>
<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="#EEF2E9"/>
<path d="${plazas.join('')}" fill="#F8FAF5"/>
<path d="${green.join('')}" fill="#D5E2C9"/>
<use href="#b" x="1.2" y="1.6" fill="#C3CFBA" stroke="#C3CFBA" stroke-width="1.4" stroke-linejoin="round"/>
<use href="#b" fill="#D9E2D1" stroke="#D9E2D1" stroke-width="1.4" stroke-linejoin="round"/>
<path d="${towerShadow}" fill="#1E2620" fill-opacity="0.12"/>
<path d="${domD}" transform="translate(1.4 1.9)" fill="#1E2620" fill-opacity="0.28"/>
<path d="${domD}" fill="#DCCFAE" stroke="#A98848" stroke-width="0.6" stroke-linejoin="round"/>
${cathedral.join('\n')}
<path d="${domD}" fill="none" stroke="#8E7440" stroke-width="0.5" stroke-linejoin="round"/>
</svg>`
writeFileSync(outSvg, svg)

// Walking routes
const origins = { dom: 'route-dom.json', u: 'route-u.json', graben: 'route-graben.json', stubentor: 'route-stubentor.json' }
const routes = {}
for (const [key, file] of Object.entries(origins)) {
  const r = JSON.parse(readFileSync(file, 'utf8')).routes[0]
  const pts = r.geometry.coordinates.map(([lon, lat]) => P(lat, lon))
  // finish exactly at the shop door
  pts.push([0, 0])
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  routes[key] = {
    d: pathOf(pts),
    start: pts[0].map(f),
    meters: Math.round(r.distance),
    bbox: [f(Math.min(...xs)), f(Math.min(...ys)), f(Math.max(...xs)), f(Math.max(...ys))],
  }
}

// Street labels along the longest OSM way of each name, written left to right
const NAMES = ['Graben', 'Kärntner Straße', 'Rotenturmstraße', 'Wollzeile', 'Singerstraße', 'Schulerstraße', 'Stephansplatz', 'Domgasse', 'Goldschmiedgasse', 'Jasomirgottstraße', 'Churhausgasse', 'Dr.-Karl-Lueger-Platz', 'Stubenbastei', 'Stubenring', 'Bäckerstraße', 'Blutgasse']
const len = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
const labels = []
for (const name of NAMES) {
  let best = null
  for (const e of els) {
    if (e.tags?.name !== name || !e.tags.highway || !e.geometry || e.tags.area === 'yes') continue
    const pts = geo(e)
    if (!best || len(pts) > len(best)) best = pts
  }
  if (!best) continue
  if (best[best.length - 1][0] < best[0][0]) best.reverse()
  labels.push({ name, d: pathOf(best), length: Math.round(len(best)) })
}

writeFileSync(outJson, JSON.stringify({ box, cathedral: centroid(dom).map(f), routes, labels }, null, 1))
console.log('svg kB', Math.round(svg.length / 1024), 'buildings', buildings.length, 'dom parts', domParts.length, 'labels', labels.map((l) => l.name + ':' + l.length).join(', '))
console.log(Object.fromEntries(Object.entries(routes).map(([k2, r]) => [k2, r.meters + ' m start ' + r.start])))
