// Waffel mit drei gestapelten Kugeln wie die Skulptur im Salon:
// unten Erdbeere, in der Mitte Vanille, oben Pistazie.
// Jede Kugel ist eine organische Form (kein Kreis, kein Band davor) mit Spatel-Falten,
// weichem Licht und Kontaktschatten. Gruppen .tower-ball-0/1/2 werden beim Scrollen animiert.

import { scoopFlavors } from '../content'

// Position & Größe je Kugel (Mittelpunkt, Radien)
const BALLS = [
  { cx: 200, cy: 236, rx: 134, ry: 116, seed: 0.4 },
  { cx: 204, cy: 72, rx: 121, ry: 105, seed: 1.7 },
  { cx: 197, cy: -78, rx: 108, ry: 95, seed: 2.9 },
]

// Organische Umrisslinie: leicht unregelmäßig, unten gewellte, überhängende Kante
function blobPath({ rx, ry, seed }) {
  const N = 72
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2
    const s = Math.sin(a)
    const noise = 1 + 0.022 * Math.sin(3 * a + seed) + 0.014 * Math.sin(7 * a + 2 * seed) + 0.008 * Math.sin(13 * a + seed)
    let x = rx * Math.cos(a) * noise
    let y = ry * s * noise
    if (s > 0.25) {
      const k = (s - 0.25) / 0.75
      x *= 1 + 0.07 * k // Rand steht leicht über
      y += ry * 0.1 * k * Math.pow(0.5 + 0.5 * Math.cos(10 * a + seed * 3), 2) // weiche Wellen
    }
    return [x, y]
  })
  // Catmull-Rom → kubische Bézier-Kurven für eine weiche Linie
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % N]
    const p3 = pts[(i + 2) % N]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

// Spatel-Falten: flache Bögen quer über die Kugel
const folds = (rx, ry) => [
  `M${-rx * 0.85} ${-ry * 0.05} Q${-rx * 0.1} ${ry * 0.28} ${rx * 0.8} ${-ry * 0.12}`,
  `M${-rx * 0.7} ${-ry * 0.42} Q${rx * 0.05} ${-ry * 0.2} ${rx * 0.62} ${-ry * 0.5}`,
  `M${-rx * 0.9} ${ry * 0.38} Q${0} ${ry * 0.7} ${rx * 0.88} ${ry * 0.32}`,
]

// Stückchen/Samen, deterministisch
const specks = (rx, ry, n, seed) =>
  Array.from({ length: n }, (_, i) => {
    const a = i * 2.39996 + seed
    const r = Math.sqrt((i + 0.5) / n) * 0.8
    return { x: Math.cos(a) * rx * r, y: Math.sin(a) * ry * r * 0.9, rot: (i * 47) % 180, big: i % 3 === 0 }
  })

function Ball({ index, f }) {
  const b = BALLS[index]
  const id = `tw${index}`
  const d = blobPath(b)
  return (
    <g className={`tower-ball tower-ball-${index}`}>
      <g transform={`translate(${b.cx} ${b.cy})`}>
        <defs>
          <radialGradient id={`${id}-body`} cx="34%" cy="26%" r="85%">
            <stop offset="0" stopColor={f.light} />
            <stop offset="0.5" stopColor={f.mid} />
            <stop offset="1" stopColor={f.dark} />
          </radialGradient>
          <linearGradient id={`${id}-ao`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#2F3B32" stopOpacity="0" />
            <stop offset="1" stopColor="#2F3B32" stopOpacity="0.22" />
          </linearGradient>
          <radialGradient id={`${id}-spec`}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-contact`}>
            <stop offset="0" stopColor="#2F3B32" stopOpacity="0.32" />
            <stop offset="1" stopColor="#2F3B32" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <path d={d} />
          </clipPath>
        </defs>

        {/* Kontaktschatten auf der Kugel darunter (die unterste sitzt in der Waffel) */}
        {index > 0 && <ellipse cx="0" cy={b.ry * 1.02} rx={b.rx * 0.85} ry={b.ry * 0.18} fill={`url(#${id}-contact)`} />}

        <path d={d} fill={`url(#${id}-body)`} />
        <g clipPath={`url(#${id}-clip)`}>
          {folds(b.rx, b.ry).map((p, i) => (
            <g key={i}>
              <path d={p} fill="none" stroke={f.crease} strokeWidth="9" strokeLinecap="round" opacity="0.14" />
              <path d={p} transform="translate(0 -6)" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.18" />
            </g>
          ))}
          {specks(b.rx, b.ry, 26, b.seed).map((s, i) =>
            s.big && f.chunks !== false ? (
              <ellipse key={i} cx={s.x} cy={s.y} rx="4.5" ry="3" fill={f.bit} opacity="0.75" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
            ) : (
              <ellipse key={i} cx={s.x} cy={s.y} rx="1.2" ry="1.8" fill={f.seed} opacity="0.65" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
            ),
          )}
          <rect x={-b.rx * 1.2} y={-b.ry * 1.2} width={b.rx * 2.4} height={b.ry * 2.6} fill={`url(#${id}-ao)`} />
          <ellipse cx={-b.rx * 0.32} cy={-b.ry * 0.42} rx={b.rx * 0.38} ry={b.ry * 0.24} fill={`url(#${id}-spec)`} transform={`rotate(-20 ${-b.rx * 0.32} ${-b.ry * 0.42})`} />
        </g>
        <path d={d} fill="none" stroke={f.dark} strokeWidth="1.5" opacity="0.45" />
      </g>
    </g>
  )
}

export default function GelatoTower({ className = '' }) {
  const bottom = scoopFlavors[0]
  return (
    <svg viewBox="0 -300 400 905" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tw-cone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C8954F" />
          <stop offset="0.35" stopColor="#E9C88C" />
          <stop offset="0.65" stopColor="#D9AE6A" />
          <stop offset="1" stopColor="#A9773D" />
        </linearGradient>
        <linearGradient id="tw-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0D39B" />
          <stop offset="1" stopColor="#B98A4C" />
        </linearGradient>
        <clipPath id="tw-cone-clip">
          <path d="M104 306 L296 306 L208 588 Q200 600 192 588 Z" />
        </clipPath>
      </defs>

      <ellipse className="tower-shadow" cx="200" cy="600" rx="64" ry="6" fill="#2F3B32" opacity="0.14" />

      {/* Waffel: zylindrisch schattiert, Waffelmuster, gerollter Rand */}
      <g className="tower-cone">
        <path d="M104 306 L296 306 L208 588 Q200 600 192 588 Z" fill="url(#tw-cone)" />
        <g clipPath="url(#tw-cone-clip)" stroke="#9E6E36" strokeWidth="2.2" opacity="0.5">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`a${i}`} x1={30 + i * 26} y1="300" x2={-140 + i * 26} y2="610" />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`b${i}`} x1={30 + i * 26} y1="300" x2={200 + i * 26} y2="610" />
          ))}
        </g>
        <path d="M104 306 L296 306 L208 588 Q200 600 192 588 Z" fill="none" stroke="#9E6E36" strokeWidth="1.5" opacity="0.5" />
        <rect x="96" y="294" width="208" height="22" rx="11" fill="url(#tw-rim)" />
      </g>

      {/* Tropfen, der langsam die Waffel hinunterläuft */}
      <path
        className="tower-drip"
        d="M226 330 C228 352 236 366 234 392 C232 410 216 410 216 392 C216 368 220 352 222 330 Z"
        fill={bottom.mid}
        stroke={bottom.dark}
        strokeWidth="1"
      />

      {/* Waffelröllchen steckt hinter der obersten Kugel */}
      <g className="tower-wafer">
        <g transform="rotate(22 250 -190)">
          <rect x="239" y="-300" width="22" height="240" rx="11" fill="#E9C68C" />
          <path d="M241 -282 L259 -270 M241 -262 L259 -250 M241 -242 L259 -230 M241 -222 L259 -210 M241 -202 L259 -190" stroke="#B8854A" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="250" cy="-298" rx="11" ry="5" fill="#4A2C21" />
        </g>
      </g>

      {scoopFlavors.map((f, i) => (
        <Ball key={f.key} index={i} f={f} />
      ))}
    </svg>
  )
}
