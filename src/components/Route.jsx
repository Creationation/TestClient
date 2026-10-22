import { useEffect, useId, useRef, useState } from 'react'
import { routeOrigins, site } from '../content'
import map from '../data/carte-dom.json'
import { gsap, prefersReduced } from '../lib/gsap'
import { useLang } from '../lib/lang'

// Echte Karte: Gebäude, Dom und Fußwege aus OpenStreetMap (© OpenStreetMap-Mitwirkende, ODbL),
// in Metern, Salon-Eingang = 0 0, Norden oben. Erzeugt von scripts/build-map.mjs.
const LABELS = ['Graben', 'Kärntner Straße', 'Rotenturmstraße', 'Wollzeile', 'Singerstraße', 'Schulerstraße', 'Bäckerstraße', 'Stubenring', 'Domgasse']

// Gewählter Startpunkt, geteilt von Karte und Auswahl
export function useRoute() {
  const [active, select] = useState('dom')
  return { active, select }
}

// Bildausschnitt im Seitenverhältnis des Rahmens: Startpunkt mit Namen, Weg, Dom und Salon mit Schild sind immer
// ganz im Bild. Lieber etwas weiter herausgezoomt als ein abgeschnittener Start; nie über den Kartenrand hinaus.
const PAD = 36 // Rand in Bildschirmpixeln (Marker, Namen)
const TOP = 44 // oben: der Name steht über dem Startpunkt
const SIGN = 150 // Schild „Gelati am Dom“ rechts vom Salon
// Meter, damit `span` Meter plus `px` Bildschirmpixel Rand in `size` Pixel passen
const fit = (span, size, px) => span / Math.max(0.2, 1 - px / size)
const frame = ([x0, y0, x1, y1], cw, ch) => {
  const aspect = cw / ch
  const [cx, cy] = map.cathedral
  const minX = Math.min(x0, cx - 60, 0)
  const maxX = Math.max(x1, cx + 60, 0)
  const minY = Math.min(y0, cy - 40, 0)
  const maxY = Math.max(y1, cy + 40, 0)
  let w = Math.max(fit(maxX - minX, cw, 2 * PAD), fit(maxY - minY, ch, TOP + PAD) * aspect, fit(-minX, cw, PAD + SIGN), 260)
  w = Math.min(w, map.box.w, map.box.h * aspect)
  const h = w / aspect
  const s = w / cw
  // links muss der Start, rechts der Weg und das Schild Platz haben; sonst mittig
  const lo = Math.max(maxX + PAD * s, SIGN * s) - w
  const hi = minX - PAD * s
  const x = Math.min(Math.max((minX + maxX) / 2 - w / 2, lo), hi)
  const y = (minY - TOP * s + maxY + PAD * s) / 2 - h / 2
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
  return {
    x: clamp(x, map.box.x, map.box.x + map.box.w - w),
    y: clamp(y, map.box.y, map.box.y + map.box.h - h),
    w,
    h,
  }
}

// Grundkarte als Bild, einmal geladen für beide Karten der Seite
let baseImage
const loadBase = () =>
  (baseImage ??= new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = '/images/carte-dom.svg'
  }))

// Bildschirmpixel pro Meter im engsten Ausschnitt aller Wege: so scharf wird die Grundkarte gezeichnet
const sharpest = (cw, ch) => Math.max(...Object.values(map.routes).map((r) => cw / frame(r.bbox, cw, ch).w))

// Kameraflug zwischen zwei Ausschnitten: Mitte gleitet, der Zoom geht kurz heraus, damit Start und Ziel
// gemeinsam im Bild sind, und wieder hinein (logarithmisch, wirkt gleichmäßig)
const flight = (a, b, aspect) => {
  const [ax, ay] = [a.x + a.w / 2, a.y + a.h / 2]
  const [bx, by] = [b.x + b.w / 2, b.y + b.h / 2]
  const both = Math.max(Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x), (Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y)) * aspect)
  const mid = Math.sqrt(a.w * b.w)
  const bump = Math.max(0.06, (both * 0.85) / mid - 1)
  const maxW = Math.min(map.box.w, map.box.h * aspect)
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
  return (t) => {
    const w = Math.min(Math.exp(Math.log(a.w) + (Math.log(b.w) - Math.log(a.w)) * t) * (1 + bump * Math.sin(Math.PI * t)), maxW)
    const h = w / aspect
    return {
      x: clamp(ax + (bx - ax) * t - w / 2, map.box.x, map.box.x + map.box.w - w),
      y: clamp(ay + (by - ay) * t - h / 2, map.box.y, map.box.y + map.box.h - h),
      w,
      h,
    }
  }
}

function RouteMap({ route: { active }, drawKey }) {
  const { t } = useLang()
  const r = t.route
  // eindeutige IDs, die Karte steht zweimal auf der Seite
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const svg = useRef(null)
  const base = useRef(null)
  const cam = useRef(null)
  const tween = useRef(null)
  const route = map.routes[active]
  const focusKey = route.bbox.join(',')
  // Neuer Startpunkt: Weg und Startmarker erscheinen erst, wenn die Kamera fast angekommen ist
  const drawId = `${active}-${drawKey}`
  const drawn = useRef({ id: null, delay: '0.15s' })
  if (drawn.current.id !== drawId) {
    const switched = drawn.current.id && !drawn.current.id.startsWith(`${active}-`)
    drawn.current = { id: drawId, delay: switched ? '1s' : '0.15s' }
  }
  const delay = drawn.current.delay

  // Die Grundkarte wird einmal scharf in ein Canvas gezeichnet und danach nur noch verschoben und skaliert
  // (das macht die Grafikkarte, nichts wird neu gezeichnet: der Zoom bleibt flüssig, auch auf dem Handy)
  const place = () => {
    const el = svg.current
    const c = cam.current
    if (!c || !el.clientWidth) return
    el.setAttribute('viewBox', `${c.x} ${c.y} ${c.w} ${c.h}`)
    el.style.setProperty('--s', c.w / el.clientWidth)
    const d = el.clientWidth / c.w
    const k = d / sharpest(el.clientWidth, el.clientHeight)
    base.current.style.transform = `translate3d(${(map.box.x - c.x) * d}px, ${(map.box.y - c.y) * d}px, 0) scale(${k})`
  }

  useEffect(() => {
    const el = svg.current
    const canvas = base.current
    let size = ''
    let frameId = 0
    const paint = async () => {
      const cw = el.clientWidth
      const ch = el.clientHeight
      if (!cw || !ch || size === `${cw}x${ch}`) return
      size = `${cw}x${ch}`
      const q = sharpest(cw, ch)
      // Gerätepixel pro Meter, gedeckelt, damit das Canvas auf jedem Handy in den Grafikspeicher passt
      const px = Math.min(q * Math.min(window.devicePixelRatio || 1, 3), 3200 / map.box.w, 3200 / map.box.h)
      const img = await loadBase()
      canvas.width = Math.round(map.box.w * px)
      canvas.height = Math.round(map.box.h * px)
      canvas.style.width = `${map.box.w * q}px`
      canvas.style.height = `${map.box.h * q}px`
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      place()
    }
    paint()
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(paint)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frameId)
    }
  }, [])

  // Kamera fliegt zum Ziel. --s = Karteneinheiten pro Bildschirmpixel (Schrift, Tirets & Marker bleiben gleich groß)
  useEffect(() => {
    const el = svg.current
    const move = (animate) => {
      if (!el.clientWidth || !el.clientHeight) return
      const target = frame(focusKey.split(',').map(Number), el.clientWidth, el.clientHeight)
      tween.current?.kill()
      if (!cam.current || !animate || prefersReduced()) {
        cam.current = target
        return place()
      }
      const path = flight(cam.current, target, el.clientWidth / el.clientHeight)
      const p = { t: 0 }
      tween.current = gsap.to(p, {
        t: 1,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          cam.current = path(p.t)
          place()
        },
      })
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
  const halo = { fill: '#2f3b32', stroke: '#f3f6ef', strokeWidth: 4, paintOrder: 'stroke' }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#EEF2E9]">
      <canvas ref={base} aria-hidden="true" className="absolute top-0 left-0 origin-top-left will-change-transform" />
      <svg ref={svg} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" role="img" aria-label={r.imageAlt}>
        <defs>
          {map.labels.map((l, i) => (
            <path key={l.name} id={`${uid}-street-${i}`} d={l.d} />
          ))}
          {/* Der Weg wird vom Start zum Salon aufgedeckt, darin wandern die Tirets weiter */}
          <mask id={`${uid}-reveal`} maskUnits="userSpaceOnUse" x={map.box.x} y={map.box.y} width={map.box.w} height={map.box.h}>
            <path
              key={drawId}
              d={route.d}
              pathLength="1"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="route-draw"
              style={{ strokeWidth: px(16), animationDelay: delay }}
            />
          </mask>
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

        <text
          x={map.cathedral[0]}
          y={map.cathedral[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          {...halo}
          // weit herausgezoomt ist der Dom zu klein für seinen Namen → blendet aus
          style={{ font: `italic 500 ${px(15)} var(--font-display)`, strokeWidth: px(4), letterSpacing: px(0.4), opacity: 'calc(3.4 - var(--s, 1) * 1.2)' }}
        >
          {r.map.dom}
        </text>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round" mask={`url(#${uid}-reveal)`}>
          <path d={route.d} stroke="#f8faf5" strokeOpacity="0.85" style={{ strokeWidth: px(8) }} />
          <path d={route.d} stroke="#a98848" className="route-march" style={{ strokeWidth: px(3.2) }} />
        </g>

        {/* Startpunkt mit Namen, der zur Kartenmitte hin läuft */}
        <g key={drawId} className="route-pop" style={{ ...pin(...route.start), animationDelay: delay }}>
          <circle r="7" fill="#f8faf5" stroke="#a98848" strokeWidth="2" />
          <circle r="2.6" fill="#a98848" />
          <text
            x={route.start[0] < 0 ? -8 : 8}
            y="-15"
            textAnchor={route.start[0] < 0 ? 'start' : 'end'}
            {...halo}
            style={{ font: '400 12px var(--font-sans)' }}
          >
            {active === 'dom' ? r.map.gate : r.from[active].label}
          </text>
        </g>

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
    </div>
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

// Auswahl des Startpunkts: ein ruhiges Feld, das eine Liste öffnet (nach unten oder, wenn kein Platz ist, nach oben).
// Ganz unten: „Von meinem Standort“ öffnet Google Maps im neuen Tab. Ohne Startpunkt nimmt Google den
// aktuellen Standort selbst; die Website fragt ihn nie ab.
function OriginSelect({ active, onSelect }) {
  const { t, lang } = useLang()
  const r = t.route
  const id = useId()
  const root = useRef(null)
  const button = useRef(null)
  const list = useRef(null)
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(false)
  const options = routeOrigins.map((o) => o.key)

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
      setUp(window.innerHeight - box.bottom < (options.length + 1) * 54 + 32 && box.top > window.innerHeight - box.bottom)
    }
    setOpen((o) => !o)
  }

  const pick = (key) => {
    onSelect(key)
    setOpen(false)
    button.current.focus({ preventScroll: true })
  }

  const onListKey = (e) => {
    const items = [...list.current.querySelectorAll('[data-item]')]
    const i = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus({ preventScroll: true })
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false)
      if (e.key === 'Escape') button.current.focus({ preventScroll: true })
    } else if ((e.key === 'Enter' || e.key === ' ') && i >= 0 && i < options.length) {
      // auf dem Link löst Enter den Link selbst aus
      e.preventDefault()
      pick(options[i])
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
          <span className="font-display mt-1 block truncate text-[1.35rem] leading-tight text-ink">{r.from[active].label}</span>
        </span>
        <span className="text-ink-soft group-hover:text-ink">
          <Chevron open={open} />
        </span>
      </button>

      <div
        ref={list}
        onKeyDown={onListKey}
        className={`absolute inset-x-0 z-30 overflow-hidden rounded-[16px] border border-forest/10 bg-paper py-2 shadow-[0_28px_60px_-24px_rgba(36,45,38,0.5)] transition-[opacity,transform,visibility] duration-300 ease-out ${
          up ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
        } ${open ? 'visible translate-y-0 scale-100 opacity-100' : `invisible scale-[0.98] opacity-0 ${up ? 'translate-y-1' : '-translate-y-1'}`}`}
      >
        <ul id={`${id}-list`} role="listbox" aria-label={r.choose}>
          {options.map((key) => {
            const on = key === active
            return (
              <li
                key={key}
                data-item
                role="option"
                tabIndex={-1}
                aria-selected={on}
                onClick={() => pick(key)}
                className="flex cursor-pointer items-center gap-3 px-5 py-3 outline-none transition-colors duration-300 hover:bg-mint/70 focus-visible:bg-mint/70"
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${on ? 'bg-gold' : 'bg-transparent'}`} />
                <span className={`min-w-0 flex-1 truncate text-[0.92rem] ${on ? 'text-ink' : 'text-ink-soft'}`}>{r.from[key].label}</span>
                <span className="font-display shrink-0 text-base text-gold italic">{r.from[key].time}</span>
              </li>
            )
          })}
        </ul>
        <a
          data-item
          tabIndex={-1}
          href={site.mapsLink(lang)}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
          className="mt-1 flex items-center gap-3 border-t border-forest/10 px-5 pt-3.5 pb-3 text-ink outline-none transition-colors duration-300 hover:bg-mint/70 focus-visible:bg-mint/70"
        >
          <span className="text-gold">
            <Locate />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.92rem]">{r.mapsHere}</span>
            <span className="block truncate text-[0.72rem] text-ink-soft">{r.mapsHint}</span>
          </span>
          <span aria-hidden="true" className="shrink-0 text-gold">
            ↗
          </span>
        </a>
      </div>
    </div>
  )
}

export function RoutePanel({ route: { active, select } }) {
  const { t, lang } = useLang()
  const r = t.route
  const origin = routeOrigins.find((o) => o.key === active).origin

  return (
    <>
      <OriginSelect active={active} onSelect={select} />

      <div key={active} className="mt-5 max-w-[30rem] short:mt-3 animate-[menuIn_0.6s_ease-out] md:mt-7" aria-live="polite">
        <p className="font-display text-xl text-gold italic">
          {r.from[active].time} {r.walk}
        </p>
        <p className="mt-2 text-[0.95rem] leading-[1.7] short:mt-1 short:text-[0.9rem] short:leading-[1.6] text-ink-soft md:text-base">{r.from[active].text}</p>
      </div>

      <a
        href={site.routeLink(origin, lang)}
        target="_blank"
        rel="noreferrer"
        className="btn mt-6 short:mt-4 self-start border-forest bg-forest px-7 py-3.5 text-mist hover:border-gold hover:bg-gold md:mt-8 md:px-8 md:py-4"
      >
        {r.go}
        <span aria-hidden="true">→</span>
      </a>
    </>
  )
}
