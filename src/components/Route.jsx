import { useEffect, useId, useRef, useState } from 'react'
import { routeOrigins, site } from '../content'
import map from '../data/carte-dom.json'
import { gsap, prefersReduced } from '../lib/gsap'
import { useLang } from '../lib/lang'

// Echte Karte: Gebäude, Dom und Fußwege aus OpenStreetMap (© OpenStreetMap-Mitwirkende, ODbL),
// in Metern, Salon-Eingang = 0 0, Norden oben. Erzeugt von scripts/build-map.mjs.
const LABELS = ['Graben', 'Kärntner Straße', 'Rotenturmstraße', 'Wollzeile', 'Singerstraße', 'Schulerstraße', 'Bäckerstraße', 'Stubenring', 'Domgasse']
const HERE = 'here'

const distance = (a, b) => {
  const rad = Math.PI / 180
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

// Position in Kartenmetern (gleiche Projektion wie scripts/build-map.mjs)
const toMap = ({ lat, lng }) => {
  const rad = Math.PI / 180
  return [(lng - site.coords.lng) * rad * 6371000 * Math.cos(site.coords.lat * rad), -(lat - site.coords.lat) * rad * 6371000]
}
const onMap = ([x, y]) => x > map.box.x && x < map.box.x + map.box.w && y > map.box.y && y < map.box.y + map.box.h

// Gewählter Startpunkt und Standort, geteilt von Karte und Auswahl
export function useRoute() {
  const [active, setActive] = useState('dom')
  const [loc, setLoc] = useState({ state: 'idle' })

  const locate = () => {
    if (!navigator.geolocation) return setLoc({ state: 'error' })
    setLoc({ state: 'busy' })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude }
        setLoc({ state: 'done', here, meters: distance(here, site.coords), xy: toMap(here) })
      },
      () => setLoc({ state: 'error' }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  const select = (key) => {
    setActive(key)
    if (key === HERE && loc.state !== 'done' && loc.state !== 'busy') locate()
  }

  return { active, loc, select }
}

// Bereich, den die Kamera zeigen soll
const focusOf = (active, loc) => {
  if (active !== HERE) return map.routes[active].bbox
  if (loc.state === 'done' && onMap(loc.xy)) {
    const [x, y] = loc.xy
    return [Math.min(x, 0), Math.min(y, 0), Math.max(x, 0), Math.max(y, 0)]
  }
  return map.routes.dom.bbox
}

// Bildausschnitt im Seitenverhältnis des Rahmens: Ziel, Dom und Salon mit Luft, rechts Platz für das Salon-Schild,
// nie über den Kartenrand hinaus
const frame = ([x0, y0, x1, y1], cw, ch) => {
  const aspect = cw / ch
  const [cx, cy] = map.cathedral
  const minX = Math.min(x0, cx - 70, -70)
  const maxX = Math.max(x1, cx + 70, 70)
  const minY = Math.min(y0, cy - 40, -40)
  const maxY = Math.max(y1, cy + 40, 40)
  let w = Math.max((maxX - minX) * 1.4, (maxY - minY) * 1.4 * aspect, 260)
  w = Math.min(w, map.box.w, map.box.h * aspect)
  const h = w / aspect
  const s = w / cw
  let x = (minX + maxX) / 2 - w / 2
  // das Schild „Gelati am Dom“ (rechts vom Punkt, ~150 px) muss ganz ins Bild
  x = Math.max(x, 158 * s - w)
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
  return {
    x: clamp(x, map.box.x, map.box.x + map.box.w - w),
    y: clamp((minY + maxY) / 2 - h / 2, map.box.y, map.box.y + map.box.h - h),
    w,
    h,
  }
}

function RouteMap({ route: { active, loc }, drawKey }) {
  const { t } = useLang()
  const r = t.route
  // eindeutige IDs, die Karte steht zweimal auf der Seite
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const svg = useRef(null)
  const cam = useRef(null)
  const tween = useRef(null)
  const focus = focusOf(active, loc)
  const focusKey = focus.join(',')

  // Kamera gleitet zum Ziel. --s = Karteneinheiten pro Bildschirmpixel (Schrift & Marker bleiben gleich groß)
  useEffect(() => {
    const el = svg.current
    const apply = () => {
      const c = cam.current
      el.setAttribute('viewBox', `${c.x} ${c.y} ${c.w} ${c.h}`)
      if (el.clientWidth) el.style.setProperty('--s', c.w / el.clientWidth)
    }
    const move = (animate) => {
      if (!el.clientWidth || !el.clientHeight) return
      const target = frame(focusKey.split(',').map(Number), el.clientWidth, el.clientHeight)
      tween.current?.kill()
      if (!cam.current || !animate || prefersReduced()) {
        cam.current = { ...target }
        apply()
      } else tween.current = gsap.to(cam.current, { ...target, duration: 1.6, ease: 'power3.inOut', onUpdate: apply })
    }
    move(true)
    const ro = new ResizeObserver(() => move(false))
    ro.observe(el)
    return () => {
      ro.disconnect()
      tween.current?.kill()
    }
  }, [focusKey])

  const px = (n) => `calc(var(--s, 1) * ${n}px)`
  const pin = (x, y) => ({ transform: `translate(${x}px, ${y}px) scale(var(--s, 1))` })
  const route = map.routes[active]
  const you = active === HERE && loc.state === 'done' && onMap(loc.xy) ? loc.xy : null

  return (
    <svg ref={svg} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full bg-[#E9EFE4]" role="img" aria-label={r.imageAlt}>
      <image href="/images/carte-dom.svg" x={map.box.x} y={map.box.y} width={map.box.w} height={map.box.h} />

      <defs>
        {map.labels.map((l, i) => (
          <path key={l.name} id={`${uid}-street-${i}`} d={l.d} />
        ))}
      </defs>
      <g fill="#5d695f" style={{ font: `400 ${px(9)} var(--font-sans)`, letterSpacing: px(2.4) }}>
        {map.labels.map((l, i) =>
          LABELS.includes(l.name) ? (
            <text key={l.name} dominantBaseline="central">
              <textPath href={`#${uid}-street-${i}`} startOffset="50%" textAnchor="middle">
                {l.name.toUpperCase()}
              </textPath>
            </text>
          ) : null,
        )}
      </g>

      {/* Alle Wege ganz leise, der gewählte zeichnet sich in Gold */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {routeOrigins.map((o) => (
          <path key={o.key} d={map.routes[o.key].d} stroke="#a98848" strokeOpacity="0.22" style={{ strokeWidth: px(1.5) }} />
        ))}
        {route && (
          <>
            <path d={route.d} stroke="#f8faf5" strokeOpacity="0.9" style={{ strokeWidth: px(7) }} />
            <path key={`${active}-${drawKey}`} d={route.d} pathLength="1" stroke="#a98848" className="route-draw" style={{ strokeWidth: px(3.5) }} />
          </>
        )}
      </g>

      <text
        x={map.cathedral[0]}
        y={map.cathedral[1]}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#d8bd83"
        // weit herausgezoomt ist der Dom zu klein für seinen Namen → blendet aus
        style={{ font: `italic 400 ${px(15)} var(--font-display)`, letterSpacing: px(0.4), opacity: 'calc(2.2 - var(--s, 1) * 1.5)' }}
      >
        {r.map.dom}
      </text>

      {/* Startpunkt (nur der gewählte trägt seinen Namen) */}
      {route && (
        <g style={pin(...route.start)}>
          <circle r="6" fill="#a98848" stroke="#f8faf5" strokeWidth="2" />
          {/* Name läuft zur Kartenmitte hin, nie über den Rand */}
          <text
            x={route.start[0] < 0 ? -8 : 8}
            y="-14"
            textAnchor={route.start[0] < 0 ? 'start' : 'end'}
            fill="#2f3b32"
            stroke="#f3f6ef"
            strokeWidth="4"
            paintOrder="stroke"
            style={{ font: '400 12px var(--font-sans)' }}
          >
            {r.from[active].label}
          </text>
        </g>
      )}
      {you && (
        <g style={pin(...you)}>
          <circle r="14" fill="#a98848" className="route-pulse" />
          <circle r="6" fill="#a98848" stroke="#f8faf5" strokeWidth="2" />
          <text y="-14" textAnchor="middle" fill="#2f3b32" stroke="#f3f6ef" strokeWidth="4" paintOrder="stroke" style={{ font: '400 12px var(--font-sans)' }}>
            {r.map.you}
          </text>
        </g>
      )}

      {/* Salon, das Schild steht rechts daneben und verdeckt nie den Dom */}
      <g style={pin(0, 0)}>
        <circle r="18" fill="#a98848" className="route-pulse" />
        <circle r="8" fill="#2f3b32" stroke="#d8bd83" strokeWidth="2.5" />
        <g transform="translate(16 0)">
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

const Chevron = ({ open }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 transition-transform duration-500 ${open ? 'rotate-180' : ''}`}>
    <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Locate = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 1.5v2.5M8 12v2.5M1.5 8H4M12 8h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

// Auswahl des Startpunkts: ein ruhiges Feld, das eine Liste öffnet (nach unten oder, wenn kein Platz ist, nach oben)
function OriginSelect({ active, onSelect }) {
  const { t } = useLang()
  const r = t.route
  const id = useId()
  const root = useRef(null)
  const button = useRef(null)
  const list = useRef(null)
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(false)
  const options = [...routeOrigins.map((o) => o.key), HERE]
  const name = (key) => (key === HERE ? r.locate : r.from[key].label)

  useEffect(() => {
    if (!open) return
    const close = (e) => !root.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', close)
    list.current.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true })
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const toggle = () => {
    if (!open) {
      const box = button.current.getBoundingClientRect()
      setUp(window.innerHeight - box.bottom < options.length * 54 + 24 && box.top > window.innerHeight - box.bottom)
    }
    setOpen((o) => !o)
  }

  const pick = (key) => {
    onSelect(key)
    setOpen(false)
    button.current.focus({ preventScroll: true })
  }

  const onListKey = (e) => {
    const items = [...list.current.querySelectorAll('[role="option"]')]
    const i = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus({ preventScroll: true })
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false)
      if (e.key === 'Escape') button.current.focus({ preventScroll: true })
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (i >= 0) pick(options[i])
    }
  }

  return (
    <div ref={root} className="relative w-full max-w-[26rem]">
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={toggle}
        onKeyDown={(e) => e.key === 'ArrowDown' && !open && (e.preventDefault(), toggle())}
        className={`group flex w-full items-center gap-4 rounded-[16px] border bg-paper/80 px-5 py-3.5 text-left transition-[border-color,box-shadow] duration-500 md:py-4 ${
          open ? 'border-forest/40 shadow-[0_18px_40px_-24px_rgba(36,45,38,0.45)]' : 'border-forest/15 hover:border-forest/35'
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="label block text-[0.6rem] text-ink-soft">{r.choose}</span>
          <span className="font-display mt-1 flex items-center gap-2 truncate text-[1.35rem] leading-tight text-ink">
            {active === HERE && <Locate />}
            {name(active)}
          </span>
        </span>
        <span className="text-ink-soft group-hover:text-ink">
          <Chevron open={open} />
        </span>
      </button>

      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        aria-label={r.choose}
        onKeyDown={onListKey}
        className={`absolute inset-x-0 z-30 overflow-hidden rounded-[16px] border border-forest/10 bg-paper py-2 shadow-[0_28px_60px_-24px_rgba(36,45,38,0.5)] transition-[opacity,transform,visibility] duration-300 ease-out ${
          up ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
        } ${open ? 'visible translate-y-0 scale-100 opacity-100' : `invisible scale-[0.98] opacity-0 ${up ? 'translate-y-1' : '-translate-y-1'}`}`}
      >
        {options.map((key) => {
          const on = key === active
          return (
            <li
              key={key}
              role="option"
              tabIndex={-1}
              aria-selected={on}
              onClick={() => pick(key)}
              className={`flex cursor-pointer items-center gap-3 px-5 py-3 outline-none transition-colors duration-300 hover:bg-mint/70 focus-visible:bg-mint/70 ${
                key === HERE ? 'mt-1 border-t border-forest/10 pt-3.5' : ''
              }`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${on ? 'bg-gold' : 'bg-transparent'}`} />
              <span className={`flex min-w-0 flex-1 items-center gap-2 truncate text-[0.92rem] ${on ? 'text-ink' : 'text-ink-soft'}`}>
                {key === HERE && <Locate />}
                {name(key)}
              </span>
              {key !== HERE && <span className="font-display shrink-0 text-base text-gold italic">{r.from[key].time}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function RoutePanel({ route: { active, loc, select } }) {
  const { t, lang } = useLang()
  const r = t.route

  // Text und Link: fester Startpunkt oder eigener Standort (bis 3 km zu Fuß, darüber mit den Öffis)
  let head = null
  let text
  let href
  if (active !== HERE) {
    head = `${r.from[active].time} ${r.walk}`
    text = r.from[active].text
    href = site.routeLink(routeOrigins.find((o) => o.key === active).origin, lang)
  } else if (loc.state === 'done') {
    const m = loc.meters
    const dist = m < 1000 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toFixed(1).replace('.', lang === 'de' ? ',' : '.')} km`
    const far = m > 3000
    head = r.here
    text = far ? r.far(dist) : r.near(dist, Math.max(1, Math.round((m * 1.25) / 80)))
    href = site.routeLink(`${loc.here.lat},${loc.here.lng}`, lang, far ? 'transit' : 'walking')
  } else {
    head = r.here
    text = loc.state === 'error' ? r.error : r.locating
    href = site.mapsLink(lang)
  }

  return (
    <>
      <OriginSelect active={active} onSelect={select} />

      <div key={`${active}-${loc.state}`} className="mt-5 max-w-[30rem] animate-[menuIn_0.6s_ease-out] md:mt-7" aria-live="polite">
        <p className="font-display text-xl text-gold italic">{head}</p>
        <p className="mt-2 text-[0.95rem] leading-[1.7] text-ink-soft md:text-base">
          {text}
          {active === HERE && loc.state === 'busy' && <span aria-hidden="true" className="ml-2 inline-block h-1.5 w-1.5 animate-ping rounded-full bg-gold align-middle" />}
        </p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="btn mt-6 self-start border-forest bg-forest px-7 py-3.5 text-mist hover:border-gold hover:bg-gold md:mt-8 md:px-8 md:py-4"
      >
        {r.go}
        <span aria-hidden="true">→</span>
      </a>
    </>
  )
}
