import { useState } from 'react'
import { images, routeOrigins, site } from '../content'
import { useLang } from '../lib/lang'

// Gezeichnete Wege auf der Karte (viewBox 400 × 520, Norden oben). Alle enden am Salon.
const SHOP = [262, 257]
const PATHS = {
  dom: { d: 'M112 260 C118 236 150 226 190 226 S246 234 262 257', start: [112, 260] },
  u: { d: 'M96 300 C130 306 160 304 196 300 S246 286 262 257', start: [96, 300] },
  graben: { d: 'M18 214 L108 232 C140 226 210 222 236 232 S258 248 262 257', start: [18, 214] },
  stubentor: { d: 'M386 228 C350 236 320 244 300 249 S272 255 262 257', start: [386, 228] },
}

function RouteMap({ active, drawKey }) {
  const { t } = useLang()
  const r = t.route
  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full bg-mint" role="img" aria-label={r.imageAlt}>
      {/* Straßen */}
      <g fill="none" stroke="#f8faf5" strokeLinecap="round" strokeWidth="14">
        <path d="M0 212 L112 234" />
        <path d="M128 296 L108 520" />
        <path d="M206 214 L262 40" />
        <path d="M236 226 L400 168" />
        <path d="M246 300 L400 354" />
        <path d="M250 258 L400 226" />
        <path d="M0 420 L120 400" />
      </g>
      {/* Stephansplatz */}
      <rect x="92" y="208" width="176" height="104" rx="18" fill="#f8faf5" />
      {/* Der Dom: Langhaus, Chor im Osten, Südturm */}
      <g fill="#c4d0bc" stroke="#8b9c84" strokeWidth="1.2">
        <path d="M122 246 H214 C230 246 238 254 238 262 C238 270 230 278 214 278 H122 Z" />
        <rect x="170" y="278" width="20" height="18" rx="3" />
      </g>
      <text x="176" y="265" textAnchor="middle" className="fill-forest" style={{ font: '400 8.5px var(--font-sans)', letterSpacing: '0.18em' }}>
        {r.map.dom.toUpperCase()}
      </text>

      {/* Alle Wege leise, der gewählte in Gold, der sich zeichnet */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Object.entries(PATHS).map(([key, p]) => (
          <path key={key} d={p.d} stroke="#a98848" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="2 6" />
        ))}
        <path
          key={`${active}-${drawKey}`}
          d={PATHS[active].d}
          pathLength="1"
          stroke="#a98848"
          strokeWidth="3.2"
          className="route-draw"
        />
      </g>
      {Object.entries(PATHS).map(([key, p]) => (
        <circle key={key} cx={p.start[0]} cy={p.start[1]} r={key === active ? 6 : 4} fill={key === active ? '#a98848' : '#8b9c84'} />
      ))}

      {/* Salon */}
      <circle cx={SHOP[0]} cy={SHOP[1]} r="16" fill="#a98848" className="route-pulse" />
      <circle cx={SHOP[0]} cy={SHOP[1]} r="8" fill="#2f3b32" stroke="#d8bd83" strokeWidth="2" />
      <g transform={`translate(${SHOP[0] + 14} ${SHOP[1] + 30})`}>
        <rect x="-6" y="-15" width="122" height="24" rx="12" fill="#2f3b32" />
        <text x="55" y="1" textAnchor="middle" fill="#d8bd83" style={{ font: 'italic 400 13px var(--font-logo)' }}>
          {r.map.shop}
        </text>
      </g>
    </svg>
  )
}

// Bild bzw. Video aus content.images.route. Fehlt die Datei, bleibt die gezeichnete Karte.
export function RouteVisual({ active, drawKey }) {
  const { t } = useLang()
  const [missing, setMissing] = useState(false)
  const media = images.route

  if (media?.video && !missing)
    return (
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={`/videos/${media.video}.jpg`} aria-label={t.route.imageAlt} onError={() => setMissing(true)}>
        <source src={`/videos/${media.video}.webm`} type="video/webm" />
        <source src={`/videos/${media.video}.mp4`} type="video/mp4" onError={() => setMissing(true)} />
      </video>
    )
  if (media?.src && !missing)
    return <img src={media.src} alt={t.route.imageAlt} decoding="async" onError={() => setMissing(true)} className="absolute inset-0 h-full w-full object-cover" />
  return <RouteMap active={active} drawKey={drawKey} />
}

const distance = (a, b) => {
  const rad = Math.PI / 180
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

export function RoutePanel({ active, onChange }) {
  const { t, lang } = useLang()
  const r = t.route
  const [loc, setLoc] = useState({ state: 'idle' })
  const current = routeOrigins.find((o) => o.key === active)

  const locate = () => {
    if (!navigator.geolocation) return setLoc({ state: 'error' })
    setLoc({ state: 'busy' })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude }
        setLoc({ state: 'done', here, meters: distance(here, site.coords) })
      },
      () => setLoc({ state: 'error' }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  // Bis 3 km zu Fuß, darüber mit den Öffis
  let located = null
  if (loc.state === 'done') {
    const m = loc.meters
    const dist = m < 1000 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toFixed(1).replace('.', lang === 'de' ? ',' : '.')} km`
    const far = m > 3000
    located = {
      text: far ? r.far(dist) : r.near(dist, Math.max(1, Math.ceil((m * 1.25) / 80))),
      href: site.routeLink(`${loc.here.lat},${loc.here.lng}`, lang, far ? 'transit' : 'walking'),
    }
  }

  return (
    <>
      <p className="label text-ink-soft">{r.choose}</p>
      <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {routeOrigins.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={o.key === active}
            onClick={() => onChange(o.key)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-[0.8rem] whitespace-nowrap transition-colors duration-500 ${
              o.key === active ? 'border-forest bg-forest text-mist' : 'border-forest/20 text-ink hover:border-forest/60'
            }`}
          >
            {r.from[o.key].label}
          </button>
        ))}
      </div>

      <div key={active} className="mt-5 max-w-[32rem] animate-[menuIn_0.6s_ease-out] md:mt-7">
        <p className="font-display text-xl text-gold italic">
          {r.from[active].time} {r.walk}
        </p>
        <p className="mt-2 text-[0.95rem] leading-[1.7] text-ink-soft md:text-base">{r.from[active].text}</p>
      </div>

      {located && <p className="mt-4 max-w-[32rem] text-sm text-ink animate-[menuIn_0.6s_ease-out]">{located.text}</p>}
      {loc.state === 'error' && <p className="mt-4 max-w-[32rem] text-sm text-ink-soft">{r.error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-8">
        <a
          href={located ? located.href : site.routeLink(current.origin, lang)}
          target="_blank"
          rel="noreferrer"
          className="btn border-forest bg-forest px-6 py-3.5 text-mist hover:border-gold hover:bg-gold md:px-8 md:py-4"
        >
          {r.go}
          <span aria-hidden="true">→</span>
        </a>
        {!located && (
          <button type="button" onClick={locate} disabled={loc.state === 'busy'} className="label inline-flex items-center gap-3 border-b border-forest/30 pb-1 transition-colors duration-300 hover:border-forest disabled:opacity-60">
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full bg-gold ${loc.state === 'busy' ? 'animate-ping' : ''}`} />
            {loc.state === 'busy' ? r.locating : r.locate}
          </button>
        )}
      </div>
    </>
  )
}
