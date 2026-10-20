// Schwebende Zutaten rund um die Waffel – je Sorte eine Gruppe (.ing-0/1/2).

const Pistachio = () => (
  <svg viewBox="0 0 40 30" className="h-full w-full">
    <ellipse cx="20" cy="15" rx="17" ry="11" fill="#8C6E5A" />
    <ellipse cx="20" cy="15" rx="14" ry="9" fill="#A9B86F" />
    <ellipse cx="16" cy="12" rx="6" ry="3" fill="#CBD69C" opacity="0.8" />
  </svg>
)

const Strawberry = () => (
  <svg viewBox="0 0 40 44" className="h-full w-full">
    <path d="M20 42C10 36 3 26 4 16 5 9 11 6 20 8c9-2 15 1 16 8 1 10-6 20-16 26Z" fill="#D2475D" />
    <path d="M12 8c3-6 13-6 16 0-4 3-12 3-16 0Z" fill="#7E9A55" />
    {[
      [13, 18],
      [20, 16],
      [27, 18],
      [16, 25],
      [24, 25],
      [20, 32],
    ].map(([x, y]) => (
      <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1" ry="1.6" fill="#F6D98B" />
    ))}
  </svg>
)

// Vanilleschote mit Blüte
const Vanilla = () => (
  <svg viewBox="0 0 44 44" className="h-full w-full">
    <path d="M6 38 C14 30 26 16 38 6" stroke="#3A2A20" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <path d="M7 37 C15 29 27 15 37 7" stroke="#6B4E3A" strokeWidth="1" strokeLinecap="round" fill="none" />
    <g transform="translate(30 30)">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-6" rx="3.6" ry="6" fill="#FFF8E6" stroke="#E8D9B5" strokeWidth="0.6" transform={`rotate(${r})`} />
      ))}
      <circle r="2.4" fill="#E9C46A" />
    </g>
  </svg>
)

// Reihenfolge wie die Kugeln: Erdbeere, Vanille, Pistazie
const KINDS = [Strawberry, Vanilla, Pistachio]

// Position (in % der Bühne), Größe (px), Startdrehung
const LAYOUT = [
  { x: 12, y: 24, s: 46, r: -20 },
  { x: 80, y: 18, s: 38, r: 25 },
  { x: 86, y: 58, s: 52, r: -35 },
  { x: 8, y: 66, s: 36, r: 40 },
  { x: 70, y: 84, s: 30, r: 10 },
  { x: 26, y: 88, s: 26, r: -50 },
]

export default function Ingredients() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {KINDS.map((Kind, k) => (
        <div key={k} className={`ing ing-${k} absolute inset-0 ${k > 0 ? "motion-reduce:hidden" : ""}`}>
          {LAYOUT.map((p, i) => (
            <div
              key={i}
              className="ing-item absolute will-change-transform"
              style={{ left: `${(p.x + k * 7) % 100}%`, top: `${p.y}%`, width: p.s, height: p.s, rotate: `${p.r}deg` }}
            >
              <Kind />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
