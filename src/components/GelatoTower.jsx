// Waffel mit drei gestapelten Kugeln (Pistazie, Erdbeere, Schokolade).
// Jede Kugel ist eine eigene Gruppe (.tower-ball-0/1/2), damit sie beim Scrollen einzeln „fallen“ kann.
// `.ball-tex` dreht sich innerhalb der Kugel, Glanz & Schatten bleiben stehen.

import { scoopFlavors } from '../content'

// Kugel in Normkoordinaten (Mitte 200/215, Radius 125) – wird per transform platziert
const BALLS = [
  { cx: 200, cy: 215, s: 1 },
  { cx: 205, cy: 32, s: 0.9 },
  { cx: 196, cy: -138, s: 0.8 },
]

const bits = Array.from({ length: 22 }, (_, i) => {
  const a = i * 2.39996
  const r = 20 + ((i * 37) % 96)
  return { x: 200 + Math.cos(a) * r, y: 215 + Math.sin(a) * r, s: 3 + (i % 4) * 1.5, rot: (i * 47) % 180, chunk: i % 3 === 0 }
})

function Ball({ index, f }) {
  const { cx, cy, s } = BALLS[index]
  const id = `tw-${index}`
  return (
    <g className={`tower-ball tower-ball-${index}`}>
      <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-200 -215)`}>
        <defs>
          <radialGradient id={`${id}-body`} cx="36%" cy="30%" r="78%">
            <stop offset="0" stopColor={f.light} />
            <stop offset="0.55" stopColor={f.mid} />
            <stop offset="1" stopColor={f.dark} />
          </radialGradient>
          <radialGradient id={`${id}-shade`} cx="35%" cy="28%" r="80%">
            <stop offset="0.55" stopColor="#2F3B32" stopOpacity="0" />
            <stop offset="1" stopColor="#2F3B32" stopOpacity="0.28" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx="200" cy="215" r="125" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
          <circle cx="200" cy="215" r="125" fill={`url(#${id}-body)`} />
          <g className="ball-tex">
            <path
              d="M110 170 C150 120 230 130 260 170 S300 260 240 270 M95 240 C140 210 190 300 260 250 M150 110 C190 90 250 100 290 140"
              fill="none"
              stroke={f.light}
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path d="M120 300 C170 270 230 320 300 280" fill="none" stroke={f.dark} strokeWidth="10" strokeLinecap="round" opacity="0.45" />
            {bits.map((b, i) =>
              b.chunk ? (
                <ellipse key={i} cx={b.x} cy={b.y} rx={b.s * 1.5} ry={b.s} fill={f.bit} opacity="0.85" transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
              ) : (
                <ellipse key={i} cx={b.x} cy={b.y} rx={b.s * 0.45} ry={b.s * 0.8} fill="#FFF8EE" opacity="0.7" transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
              ),
            )}
          </g>
          <circle cx="200" cy="215" r="125" fill={`url(#${id}-shade)`} />
        </g>
        {/* Gekräuselter Rand */}
        <path
          d="M78 262 C76 296 96 312 112 302 C120 322 146 324 156 308 C168 328 196 328 204 310 C214 328 244 326 252 308 C262 324 290 318 296 300 C312 306 326 288 322 260 Z"
          fill={f.lip}
        />
        <ellipse cx="150" cy="150" rx="34" ry="19" fill="#fff" opacity="0.42" transform="rotate(-35 150 150)" />
        <circle cx="122" cy="186" r="5" fill="#fff" opacity="0.45" />
      </g>
    </g>
  )
}

export default function GelatoTower({ className = '' }) {
  return (
    <svg viewBox="0 -300 400 905" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tw-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6C48A" />
          <stop offset="1" stopColor="#B88A4E" />
        </linearGradient>
        <clipPath id="tw-cone-clip">
          <path d="M92 300 L308 300 L212 588 Q200 600 188 588 Z" />
        </clipPath>
      </defs>

      <ellipse className="tower-shadow" cx="200" cy="598" rx="70" ry="6" fill="#2F3B32" opacity="0.12" />

      {/* Waffel */}
      <g className="tower-cone">
        <path d="M92 300 L308 300 L212 588 Q200 600 188 588 Z" fill="url(#tw-cone)" />
        <g clipPath="url(#tw-cone-clip)" stroke="#9C7140" strokeWidth="2.5" opacity="0.45">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`a${i}`} x1={40 + i * 28} y1="290" x2={-120 + i * 28} y2="600" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`b${i}`} x1={40 + i * 28} y1="290" x2={200 + i * 28} y2="600" />
          ))}
        </g>
      </g>

      {/* Tropfen, der langsam die Waffel hinunterläuft */}
      <path className="tower-drip" d="M196 300 C200 340 212 360 210 392 C208 408 194 408 194 392 C194 360 190 336 196 300 Z" fill={scoopFlavors[0].lip} />

      {/* Waffelröllchen steckt hinter der obersten Kugel */}
      <g className="tower-wafer">
        <g transform="rotate(22 250 -190)">
          <rect x="239" y="-290" width="22" height="120" rx="11" fill="#E9C68C" />
          <path d="M241 -272 L259 -260 M241 -252 L259 -240 M241 -232 L259 -220 M241 -212 L259 -200" stroke="#B8854A" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="250" cy="-288" rx="11" ry="5" fill="#4A2C21" />
        </g>
      </g>
      {scoopFlavors.map((f, i) => (
        <Ball key={f.key} index={i} f={f} />
      ))}

    </svg>
  )
}
