import { useEffect, useRef, useState } from 'react'
import { routeOrigins, site } from '../content'
import map from '../data/carte-dom.json'
import { gsap, prefersReduced } from '../lib/gsap'
import { useLang } from '../lib/lang'

// Echte Karte: Gebäude, Dom und Fußwege aus OpenStreetMap (© OpenStreetMap-Mitwirkende, ODbL),
// in Metern, Salon-Eingang = 0 0, Norden oben. Erzeugt von scripts/build-map.mjs.
const LABELS = ['Graben', 'Kärntner Straße', 'Rotenturmstraße', 'Wollzeile', 'Singerstraße', 'Schulerstraße', 'Bäckerstraße', 'Stubenring', 'Domgasse']

// Bildausschnitt im Seitenverhältnis des Rahmens: Weg, Dom und Salon mit Luft, nie über den Kartenrand hinaus
const frame = (key, aspect) => {
  const [x0, y0, x1, y1] = map.routes[key].bbox
  const [cx, cy] = map.cathedral
  const minX = Math.min(x0, cx - 70, -70)
  const maxX = Math.max(x1, cx + 70, 70)
  const minY = Math.min(y0, cy - 40, 0)
  // unter dem Salon steht sein Name
  const maxY = Math.max(y1, cy + 40, 50)
  const pad = 1.45
  let w = Math.max((maxX - minX) * pad, (maxY - minY) * pad * aspect, 260)
  w = Math.min(w, map.box.w, map.box.h * aspect)
  const h = w / aspect
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
  return {
    x: clamp((minX + maxX) / 2 - w / 2, map.box.x, map.box.x + map.box.w - w),
    y: clamp((minY + maxY) / 2 - h / 2, map.box.y, map.box.y + map.box.h - h),
    w,
    h,
  }
}

function RouteMap({ active, drawKey }) {
  const { t } = useLang()
  const r = t.route
  const svg = useRef(null)
  const cam = useRef(null)
  const tween = useRef(null)

  // Kamera gleitet zum gewählten Weg. --s = Karteneinheiten pro Bildschirmpixel (Schrift & Marker bleiben gleich groß)
  useEffect(() => {
    const el = svg.current
    const apply = () => {
      const c = cam.current
      el.setAttribute('viewBox', `${c.x} ${c.y} ${c.w} ${c.h}`)
      if (el.clientWidth) el.style.setProperty('--s', c.w / el.clientWidth)
    }
    const move = (animate) => {
      if (!el.clientWidth || !el.clientHeight) return
      const target = frame(active, el.clientWidth / el.clientHeight)
      tween.current?.kill()
      if (!cam.current || !animate || prefersReduced()) {
        cam.current = { ...target }
        apply()
      } else tween.current = gsap.to(cam.current, { ...target, duration: 1.8, ease: 'power3.inOut', onUpdate: apply })
    }
    move(true)
    const ro = new ResizeObserver(() => move(false))
    ro.observe(el)
    return () => {
      ro.disconnect()
      tween.current?.kill()
    }
  }, [active])

  const px = (n) => `calc(var(--s, 1) * ${n}px)`
  const pin = (x, y) => ({ transform: `translate(${x}px, ${y}px) scale(var(--s, 1))` })
  const route = map.routes[active]

  return (
    <svg ref={svg} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full bg-[#E9EFE4]" role="img" aria-label={r.imageAlt}>
      <image href="/images/carte-dom.svg" x={map.box.x} y={map.box.y} width={map.box.w} height={map.box.h} />

      <defs>
        {map.labels.map((l, i) => (
          <path key={l.name} id={`street-${i}`} d={l.d} />
        ))}
      </defs>
      <g fill="#5d695f" style={{ font: `400 ${px(9)} var(--font-sans)`, letterSpacing: px(2.4) }}>
        {map.labels.map((l, i) =>
          LABELS.includes(l.name) ? (
            <text key={l.name} dominantBaseline="central">
              <textPath href={`#street-${i}`} startOffset="50%" textAnchor="middle">
                {l.name.toUpperCase()}
              </textPath>
            </text>
          ) : null,
        )}
      </g>

      {/* Alle Wege ganz leise, der gewählte zeichnet sich in Gold */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {routeOrigins.map((o) => (
          <path key={o.key} d={map.routes[o.key].d} stroke="#a98848" strokeOpacity="0.28" style={{ strokeWidth: px(1.5) }} />
        ))}
        <path d={route.d} stroke="#f8faf5" strokeOpacity="0.9" style={{ strokeWidth: px(7) }} />
        <path key={`${active}-${drawKey}`} d={route.d} pathLength="1" stroke="#a98848" className="route-draw" style={{ strokeWidth: px(3.5) }} />
      </g>

      <text
        x={map.cathedral[0]}
        y={map.cathedral[1]}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#d8bd83"
        style={{ font: `italic 400 ${px(15)} var(--font-display)`, letterSpacing: px(0.4) }}
      >
        {r.map.dom}
      </text>

      {/* Startpunkte */}
      {routeOrigins.map((o) => {
        const [x, y] = map.routes[o.key].start
        const on = o.key === active
        return (
          <g key={o.key} style={pin(x, y)} className="transition-opacity duration-700" opacity={on ? 1 : 0.55}>
            <circle r={on ? 6 : 4} fill={on ? '#a98848' : '#8b9c84'} stroke="#f8faf5" strokeWidth="2" />
            {on && (
              <text y="-14" textAnchor="middle" fill="#2f3b32" stroke="#f3f6ef" strokeWidth="4" paintOrder="stroke" style={{ font: '400 12px var(--font-sans)' }}>
                {r.from[o.key].label}
              </text>
            )}
          </g>
        )
      })}

      {/* Salon */}
      <g style={pin(0, 0)}>
        <circle r="18" fill="#a98848" className="route-pulse" />
        <circle r="8" fill="#2f3b32" stroke="#d8bd83" strokeWidth="2.5" />
        <g transform="translate(-62 34)">
          <rect x="0" y="-14" width="124" height="28" rx="14" fill="#2f3b32" />
          <text x="62" y="1" textAnchor="middle" dominantBaseline="middle" fill="#d8bd83" style={{ font: 'italic 400 14px var(--font-logo)' }}>
            {r.map.shop}
          </text>
        </g>
      </g>
    </svg>
  )
}

export function RouteVisual(props) {
  return (
    <>
      <RouteMap {...props} />
      {/* Pflichtnachweis der Kartendaten (ODbL) */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 bottom-2 text-[0.6rem] text-ink-soft/70 transition-colors hover:text-ink md:right-4 md:bottom-3"
      >
        © OpenStreetMap
      </a>
    </>
  )
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
