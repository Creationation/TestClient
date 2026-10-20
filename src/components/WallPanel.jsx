// Die Wand aus dem Salon: geschwungene Salbei-Fläche mit warm leuchtender LED-Kante
// und Efeuranken links und rechts der Waffel. Rein statisch – wird einmal gezeichnet, flackert nicht.

const PANEL =
  'M95 0 C150 130 40 230 62 350 C84 470 175 520 140 640 C112 740 58 800 88 900 L338 900 C306 800 378 720 352 610 C328 500 248 440 278 320 C306 200 384 110 318 0 Z'

// Ranke als Bézier-Kurve; Blätter wechseln die Seite entlang der Kurve
const bezier = (p, t) => {
  const u = 1 - t
  return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k])
}
const VINES = [
  [
    [170, 150],
    [70, 300],
    [190, 520],
    [120, 780],
  ],
  [
    [250, 140],
    [360, 320],
    [230, 530],
    [300, 790],
  ],
]
const leavesOf = (pts, n, seed) =>
  Array.from({ length: n }, (_, i) => {
    const t = 0.04 + (i / (n - 1)) * 0.92
    const [x, y] = bezier(pts, t)
    const side = i % 2 ? 1 : -1
    return { x, y, r: side * (40 + ((i * seed) % 50)) + (side > 0 ? 0 : 180), s: 1.1 + ((i * 7 + seed) % 6) / 10 }
  })
const LEAVES = [...leavesOf(VINES[0], 18, 13), ...leavesOf(VINES[1], 18, 29)]

const Leaf = ({ x, y, r, s }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C5 -9 16 -10 22 -1 C16 8 5 8 0 0 Z" fill="#4C6A45" />
    <path d="M0 0 C7 -1 14 -1 21 -1" stroke="#3A5435" strokeWidth="0.7" fill="none" />
  </g>
)

export default function WallPanel({ className = '' }) {
  return (
    <svg viewBox="0 0 420 900" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
      <defs>
        <filter id="wp-glow" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <linearGradient id="wp-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B4C2AC" />
          <stop offset="0.5" stopColor="#C6D2BE" />
          <stop offset="1" stopColor="#B4C2AC" />
        </linearGradient>
      </defs>
      {/* warmes LED-Licht hinter der Kante */}
      <path d={PANEL} fill="none" stroke="#FFD58F" strokeWidth="18" opacity="0.6" filter="url(#wp-glow)" />
      <path d={PANEL} fill="url(#wp-fill)" />
      <path d={PANEL} fill="none" stroke="#FFF0C8" strokeWidth="1.5" opacity="0.85" />
      {/* Efeuranken */}
      {VINES.map((p, i) => (
        <path key={i} d={`M${p[0]} C${p[1]} ${p[2]} ${p[3]}`} fill="none" stroke="#3E5838" strokeWidth="1.4" opacity="0.8" />
      ))}
      {LEAVES.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
    </svg>
  )
}
