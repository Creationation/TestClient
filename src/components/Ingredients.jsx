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

const Chocolate = () => (
  <svg viewBox="0 0 40 34" className="h-full w-full">
    <path d="M6 6 30 3 36 26 10 31Z" fill="#4A2C21" />
    <path d="M6 6 30 3 31 8 8 11Z" fill="#6A4334" />
    <path d="M10 14 31 11" stroke="#3A2219" strokeWidth="1.5" />
  </svg>
)

const KINDS = [Pistachio, Strawberry, Chocolate]

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
