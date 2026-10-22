// Karte „Der Weg zu uns“ neu erzeugen: OSM-Daten + Fußwege (OSRM) → public/images/carte-dom.svg
// (nur Formen) und src/data/carte-dom.json (Wege, Startpunkte, Straßennamen), in Metern,
// Salon-Eingang = 0 0, Norden oben. Daten © OpenStreetMap-Mitwirkende (ODbL).
//
// 1. Im Ordner scripts/carte-dom die OSM-Daten laden (nicht im Repo, 2,5 MB):
//    curl -s --data-urlencode 'data=[out:json][timeout:60];(way["building"](48.2040,16.3665,48.2120,16.3820);relation["building"](48.2040,16.3665,48.2120,16.3820);way["highway"](48.2040,16.3665,48.2120,16.3820);way["place"="square"](48.2040,16.3665,48.2120,16.3820);way["area:highway"](48.2040,16.3665,48.2120,16.3820););out geom;' https://overpass-api.de/api/interpreter -o area.json
// 2. Wege (liegen schon da), z. B.: https://routing.openstreetmap.de/routed-foot/route/v1/driving/<lon,lat Start>;16.3746127,48.2085676?overview=full&geometries=geojson
//    dom 16.37236,48.20857 (Haupttor) · u 16.37195,48.20812 (Ausgang Stock-im-Eisen-Platz)
//    graben 16.36988,48.20878 (Pestsäule) · stubentor 16.379313,48.207754 über 16.3767,48.2078 (durch die Schulerstraße)
// 3. cd scripts/carte-dom && node ../build-map.mjs ../../public/images/carte-dom.svg ../../src/data/carte-dom.json
import { readFileSync, writeFileSync } from 'node:fs'

const [outSvg, outJson] = process.argv.slice(2)
const SHOP = { lat: 48.2085676, lon: 16.3746127 }
const R = 6371000
const k = Math.cos((SHOP.lat * Math.PI) / 180)
const P = (lat, lon) => [((lon - SHOP.lon) * Math.PI / 180) * R * k, -((lat - SHOP.lat) * Math.PI / 180) * R]
const f = (n) => Math.round(n * 10) / 10
const i = (n) => Math.round(n)
const shapeOf = (pts) => 'M' + pts.map(([x, y]) => i(x) + ' ' + i(y)).join('L') + 'Z'
const pathOf = (pts, close) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + (close ? 'Z' : '')

const data = JSON.parse(readFileSync('area.json', 'utf8'))
const els = data.elements

// Bounds of the drawn area (metres)
const [W0, N0] = P(48.2120, 16.3665)
const [E0, S0] = P(48.2040, 16.3820)
const box = { x: f(W0), y: f(N0), w: f(E0 - W0), h: f(S0 - N0) }

const buildings = []
let cathedral = ''
const plazas = []
for (const e of els) {
  const t = e.tags || {}
  if (e.id === 212496461) {
    cathedral = pathOf(e.geometry.map((g) => P(g.lat, g.lon)), true)
    continue
  }
  if (t.building && e.type === 'way' && e.geometry) buildings.push(shapeOf(e.geometry.map((g) => P(g.lat, g.lon))))
  if (t.building && e.type === 'relation')
    for (const m of e.members || []) if (m.geometry) buildings.push(shapeOf(m.geometry.map((g) => P(g.lat, g.lon))))
  if ((t['area:highway'] || (t.highway === 'pedestrian' && t.area === 'yes') || t.place === 'square') && e.geometry)
    plazas.push(shapeOf(e.geometry.map((g) => P(g.lat, g.lon))))
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.w} ${box.h}" width="${Math.round(box.w * 2)}" height="${Math.round(box.h * 2)}">
<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="#E9EFE4"/>
<path d="${plazas.join('')}" fill="#F6F8F2"/>
<defs><path id="b" d="${buildings.join('')}" fill-rule="evenodd"/></defs>
<use href="#b" x="1.4" y="1.8" fill="#AEBCA6"/>
<use href="#b" fill="#CAD5C2" stroke="#B9C6B1" stroke-width="0.6"/>
<g transform="translate(1.6 2.2)"><path d="${cathedral}" fill="#1E2620"/></g>
<path d="${cathedral}" fill="#2F3B32" stroke="#A98848" stroke-width="1.2"/>
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
    const pts = e.geometry.map((g) => P(g.lat, g.lon))
    if (!best || len(pts) > len(best)) best = pts
  }
  if (!best) continue
  if (best[best.length - 1][0] < best[0][0]) best.reverse()
  labels.push({ name, d: pathOf(best), length: Math.round(len(best)) })
}

const dom = JSON.parse(readFileSync('area.json', 'utf8')).elements.find((e) => e.id === 212496461).geometry
const cx = dom.reduce((s, g) => s + g.lon, 0) / dom.length
const cy = dom.reduce((s, g) => s + g.lat, 0) / dom.length

writeFileSync(outJson, JSON.stringify({ box, cathedral: P(cy, cx).map(f), routes, labels }, null, 1))
console.log('svg kB', Math.round(svg.length / 1024), 'buildings', buildings.length, 'labels', labels.map((l) => l.name + ':' + l.length).join(', '))
console.log(Object.fromEntries(Object.entries(routes).map(([k2, r]) => [k2, r.meters + ' m start ' + r.start])))
