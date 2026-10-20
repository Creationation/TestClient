// Eiskugel in der Waffel. Farben kommen aus CSS-Variablen (--s-light, --s-mid, --s-dark, --s-lip, --s-bit),
// damit GSAP die Sorte beim Scrollen weich überblenden kann. `.scoop-texture` dreht sich in der Kugel,
// Glanzlicht und Schatten bleiben stehen → wirkt wie eine rotierende Kugel.

const CX = 200
const CY = 215
const R = 125
const v = (name) => ({ fill: `var(${name})` })

// Stückchen – deterministisch verteilt
const bits = Array.from({ length: 24 }, (_, i) => {
  const a = i * 2.39996
  const r = 20 + ((i * 37) % 96)
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, s: 3 + (i % 4) * 1.5, rot: (i * 47) % 180, chunk: i % 3 === 0 }
})

export default function Scoop({ className = '', style }) {
  return (
    <svg viewBox="0 0 400 600" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="sc-body" cx="36%" cy="30%" r="78%">
          <stop offset="0" style={{ stopColor: 'var(--s-light)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--s-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--s-dark)' }} />
        </radialGradient>
        <radialGradient id="sc-shade" cx="35%" cy="28%" r="80%">
          <stop offset="0.55" stopColor="#1E1712" stopOpacity="0" />
          <stop offset="1" stopColor="#1E1712" stopOpacity="0.28" />
        </radialGradient>
        <linearGradient id="sc-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6C48A" />
          <stop offset="1" stopColor="#B88A4E" />
        </linearGradient>
        <clipPath id="sc-cone-clip">
          <path d="M92 300 L308 300 L212 588 Q200 600 188 588 Z" />
        </clipPath>
        <clipPath id="sc-ball">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      <ellipse className="scoop-shadow" cx="200" cy="594" rx="66" ry="6" fill="#1E1712" opacity="0.12" />

      {/* Waffel */}
      <path d="M92 300 L308 300 L212 588 Q200 600 188 588 Z" fill="url(#sc-cone)" />
      <g clipPath="url(#sc-cone-clip)" stroke="#9C7140" strokeWidth="2.5" opacity="0.45">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`a${i}`} x1={40 + i * 28} y1="290" x2={-120 + i * 28} y2="600" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`b${i}`} x1={40 + i * 28} y1="290" x2={200 + i * 28} y2="600" />
        ))}
      </g>

      {/* Waffelröllchen (steckt hinter der Kugel) */}
      <g transform="rotate(24 280 120)">
        <rect x="268" y="40" width="22" height="110" rx="11" fill="#E9C68C" />
        <path d="M270 58 L288 70 M270 78 L288 90 M270 98 L288 110 M270 118 L288 130" stroke="#B8854A" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="279" cy="42" rx="11" ry="5" fill="#4A2C21" />
      </g>

      {/* Kugel */}
      <g clipPath="url(#sc-ball)">
        <circle cx={CX} cy={CY} r={R} fill="url(#sc-body)" />
        <g className="scoop-texture">
          <path
            d="M110 170 C150 120 230 130 260 170 S300 260 240 270 M95 240 C140 210 190 300 260 250 M150 110 C190 90 250 100 290 140"
            fill="none"
            style={{ stroke: 'var(--s-light)' }}
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path d="M120 300 C170 270 230 320 300 280" fill="none" style={{ stroke: 'var(--s-dark)' }} strokeWidth="10" strokeLinecap="round" opacity="0.45" />
          {bits.map((b, i) =>
            b.chunk ? (
              <ellipse key={i} cx={b.x} cy={b.y} rx={b.s * 1.5} ry={b.s} style={v('--s-bit')} opacity="0.85" transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
            ) : (
              <ellipse key={i} cx={b.x} cy={b.y} rx={b.s * 0.45} ry={b.s * 0.8} fill="#FFF8EE" opacity="0.75" transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
            ),
          )}
        </g>
        <circle cx={CX} cy={CY} r={R} fill="url(#sc-shade)" />
      </g>

      {/* Gekräuselter Rand über der Waffel */}
      <path
        d="M78 262 C76 296 96 312 112 302 C120 322 146 324 156 308 C168 328 196 328 204 310 C214 328 244 326 252 308 C262 324 290 318 296 300 C312 306 326 288 322 260 Z"
        style={v('--s-lip')}
      />
      <path d="M200 312 C204 340 212 352 210 372 C208 386 196 386 196 372 C196 352 192 336 196 312 Z" style={v('--s-lip')} />

      {/* Glanzlichter */}
      <ellipse cx="150" cy="150" rx="34" ry="19" fill="#fff" opacity="0.45" transform="rotate(-35 150 150)" />
      <circle cx="122" cy="186" r="5" fill="#fff" opacity="0.5" />
    </svg>
  )
}
