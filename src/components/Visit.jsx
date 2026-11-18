import { useEffect, useRef, useState } from 'react'
import { legal, site } from '../content'
import vm from '../data/visit-map.json'
import { useLang } from '../lib/lang'
import Appear from './Appear'

// Lage in Prozent des Bezirksbilds (Ausgabe von scripts/osm-district.py)
const at = ([x, y]) => ({ left: `${x * 100}%`, top: `${y * 100}%` })
// Start: Salon, Dom und die Gassen rundherum, rund 350 m breit (Bildpixel bei Zoom 17)
const HOME_SPAN = 440
// so nah heran, wie das scharfe Detailbild rund um den Salon trägt
const MAX_ZOOM = 4

// Erkunden: am Handy mit zwei Fingern verschieben und zoomen (ein Finger scrollt weiter die Seite),
// am Computer mit der Maus ziehen, per Trackpad-Geste oder Strg + Mausrad zoomen, oder mit + / −.
// Die Ebene wird nur verschoben und skaliert (Grafikkarte); Schilder bleiben gleich groß.
function DistrictMap() {
  const { t } = useLang()
  const m = t.route.map
  const box = useRef(null)
  const layer = useRef(null)
  const cam = useRef(null)
  const api = useRef({})
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    const el = box.current
    const L = layer.current
    const pointers = new Map()
    let last = null
    let raf = 0
    const size = () => [el.clientWidth, el.clientHeight]
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
    const fit = ({ k, x, y }) => {
      const [cw, ch] = size()
      const kk = clamp(k, Math.max(cw / vm.width, ch / vm.height), MAX_ZOOM)
      return { k: kk, x: clamp(x, cw - vm.width * kk, 0), y: clamp(y, ch - vm.height * kk, 0) }
    }
    const apply = () => {
      const { k, x, y } = cam.current
      L.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${k})`
      L.style.setProperty('--k', k)
    }
    const home = () => {
      const [cw, ch] = size()
      const k = cw / HOME_SPAN
      const cx = (vm.detail[0] + vm.detail[2] / 2) * vm.width
      const cy = (vm.detail[1] + vm.detail[3] / 2) * vm.height
      cam.current = fit({ k, x: cw / 2 - cx * k, y: ch / 2 - cy * k })
      apply()
      setMoved(false)
    }
    // um dx/dy Bildschirmpixel verschieben und um f zoomen, rund um den Punkt px/py
    const nudge = (dx, dy, f = 1, px = el.clientWidth / 2, py = el.clientHeight / 2) => {
      const c = cam.current
      const k = clamp(c.k * f, 0, MAX_ZOOM)
      const r = k / c.k
      cam.current = fit({ k, x: px - (px - c.x) * r + dx, y: py - (py - c.y) * r + dy })
      setMoved(true)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }
    api.current = { home, zoom: (f) => nudge(0, 0, f) }
    home()

    const local = (e) => {
      const r = el.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const gesture = () => {
      const pts = [...pointers.values()]
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
      const dist = pts.length > 1 ? Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]) : 0
      return { cx, cy, dist }
    }
    // am Handy zählt erst der zweite Finger, mit der Maus jeder Zug
    const active = (e) => (e.pointerType === 'touch' ? pointers.size >= 2 : pointers.size >= 1)
    const down = (e) => {
      if (e.target.closest('a, button')) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      pointers.set(e.pointerId, local(e))
      el.setPointerCapture?.(e.pointerId)
      last = active(e) ? gesture() : null
    }
    const move = (e) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, local(e))
      if (!active(e)) return
      const g = gesture()
      if (last) nudge(g.cx - last.cx, g.cy - last.cy, last.dist && g.dist ? g.dist / last.dist : 1, g.cx, g.cy)
      last = g
    }
    const up = (e) => {
      pointers.delete(e.pointerId)
      last = active(e) ? gesture() : null
    }
    // Trackpad-Zoom kommt als Mausrad mit Strg; das normale Mausrad scrollt weiter die Seite
    const wheel = (e) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const [px, py] = local(e)
      nudge(0, 0, Math.exp(-e.deltaY * 0.01), px, py)
    }
    // neue Größe (Drehen, Fenster): Ausschnitt in den Rahmen zurückholen
    const ro = new ResizeObserver(() => {
      cam.current = fit(cam.current)
      apply()
    })
    ro.observe(el)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [])

  // Schilder behalten ihre Größe, egal wie weit gezoomt ist
  const pin = 'absolute [transform:scale(calc(1/var(--k,1)))] origin-top-left'

  return (
    // touch-action pan-y: ein Finger scrollt die Seite, zwei Finger gehören der Karte
    <div ref={box} className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing">
      <div ref={layer} className="absolute top-0 left-0 origin-top-left will-change-transform" style={{ width: vm.width, height: vm.height }}>
        <img src="/images/osm-district.webp" alt="" width={vm.width} height={vm.height} loading="lazy" draggable="false" className="absolute inset-0 h-full w-full saturate-[0.8]" />
        <img
          src="/images/osm-district-detail.webp"
          alt=""
          loading="lazy"
          draggable="false"
          className="absolute saturate-[0.8]"
          style={{ left: `${vm.detail[0] * 100}%`, top: `${vm.detail[1] * 100}%`, width: `${vm.detail[2] * 100}%`, height: `${vm.detail[3] * 100}%` }}
        />
        {vm.places.map(([name, x, y]) => (
          <span key={name} aria-hidden="true" className={pin} style={at([x, y])}>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 text-[11px] tracking-[0.14em] whitespace-nowrap text-ink-soft uppercase [text-shadow:0_0_3px_#fff,0_0_6px_#fff]">
              {name}
            </span>
          </span>
        ))}
        {/* Stephansdom */}
        <span aria-hidden="true" className={pin} style={at(vm.dom)}>
          <span className="font-display absolute -translate-x-1/2 -translate-y-1/2 text-[1.2rem] whitespace-nowrap text-ink italic [text-shadow:0_0_4px_#fff,0_0_8px_#fff]">
            ✝ {m.dom}
          </span>
        </span>
        {/* Salon */}
        <span aria-hidden="true" className={pin} style={at(vm.shop)}>
          <span className="route-pulse absolute -top-[18px] -left-[18px] h-9 w-9 rounded-full bg-gold" />
          <span className="absolute -top-[9px] -left-[9px] h-[18px] w-[18px] rounded-full border-[3px] border-gold-light bg-forest shadow-md" />
          <span className="absolute bottom-[16px] left-0 flex -translate-x-1/2 flex-col items-center rounded-[14px] bg-forest px-4 py-2 text-center whitespace-nowrap shadow-lg">
            <span className="font-logo text-[15px] leading-tight text-gold-light italic">Gelati am Dom</span>
            <span className="mt-0.5 text-[11px] leading-tight text-mist/85">{site.street}</span>
          </span>
        </span>
      </div>

      {/* Zoom; „zurück zum Salon“, sobald man sich bewegt hat, sonst der Hinweis auf die Gesten */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 md:top-4 md:right-4">
        {[
          [1.6, '+', m.zoomIn],
          [1 / 1.6, '−', m.zoomOut],
        ].map(([f, sign, label]) => (
          <button
            key={sign}
            type="button"
            onClick={() => api.current.zoom?.(f)}
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-full bg-paper/95 text-xl leading-none text-forest shadow-[0_4px_14px_-6px_rgba(47,59,50,0.5)] transition-colors hover:bg-forest hover:text-mist"
          >
            {sign}
          </button>
        ))}
      </div>
      {moved ? (
        <button
          type="button"
          onClick={() => api.current.home?.()}
          className="absolute top-3 left-3 rounded-full bg-forest px-4 py-2.5 text-[0.68rem] tracking-[0.14em] text-mist uppercase shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)] md:top-4 md:left-4"
        >
          {m.reset}
        </button>
      ) : (
        <p className="pointer-events-none absolute top-3 left-3 rounded-full bg-paper/90 px-3.5 py-2 text-[0.68rem] text-ink-soft md:top-4 md:left-4">
          <span className="md:hidden">{m.hintTouch}</span>
          <span className="hidden md:inline">{m.hintMouse}</span>
        </p>
      )}
    </div>
  )
}

// Stunde in Wien, egal wo der Besucher gerade ist
const viennaHour = () => {
  const p = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date())
  const get = (type) => Number(p.find((x) => x.type === type)?.value ?? 0)
  return get('hour') + get('minute') / 60
}

// Öffnungszeiten, Adresse und die drei Wege zu uns (Route, Anruf, Instagram) in einer samtgrünen Karte mit Messing,
// oben ein lebendiger Hinweis, ob der Salon gerade geöffnet hat. Nur Farben der Seite.
function VisitCard() {
  const { t, lang } = useLang()
  const v = t.visit
  const [hour, setHour] = useState(viennaHour)
  useEffect(() => {
    const id = window.setInterval(() => setHour(viennaHour()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const { from, to } = site.open
  const open = hour >= from && hour < to
  const fmt = (h) => (lang === 'en' ? `${((h + 11) % 12) + 1} ${h < 12 ? 'am' : 'pm'}` : String(h))

  return (
    <div className="relative mt-12 overflow-hidden rounded-[28px] bg-forest p-7 text-mist shadow-[0_30px_70px_-40px_rgba(36,45,38,0.9)] md:mt-16 md:rounded-[34px] md:p-10">
      {/* warmer Messing-Schimmer in der Ecke */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gold-light/20 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[10px] rounded-[20px] border border-gold-light/20 md:rounded-[26px]" />

      <div className="relative">
        <p className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.72rem] tracking-[0.12em] uppercase ${open ? 'bg-pistachio/25 text-mist' : 'bg-mist/10 text-mist/80'}`}>
          <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
            {open && <span className="absolute h-full w-full animate-ping rounded-full bg-sage opacity-70" />}
            <span className={`relative h-2.5 w-2.5 rounded-full ${open ? 'bg-sage' : 'bg-gold-light'}`} />
          </span>
          {open ? v.openNow : v.closedNow}
          <span className="text-mist/60 normal-case tracking-normal">· {open ? v.until(fmt(to)) : v.opensAt(fmt(from))}</span>
        </p>

        <h3 className="label mt-9 text-gold-light/80">{v.hoursTitle}</h3>
        <p className="font-logo mt-3 flex items-baseline gap-3 text-[clamp(2.8rem,10vw,4.4rem)] leading-none text-gold-light lining-nums">
          {fmt(from)}
          <span className="text-[0.55em] text-gold-light/60">–</span>
          {fmt(to)}
          {lang !== 'en' && <span className="font-sans text-base tracking-[0.2em] text-mist/70 uppercase">{v.clock}</span>}
        </p>
        <p className="mt-2 text-sm text-mist/70">{v.daily}</p>

        <span className="mt-8 block h-px bg-gradient-to-r from-gold-light/50 via-gold-light/20 to-transparent" aria-hidden="true" />

        <h3 className="label mt-8 text-gold-light/80">{v.addressTitle}</h3>
        <address className="font-display mt-3 flex items-start gap-3 text-[1.9rem] leading-tight not-italic md:text-4xl">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-1.5 h-6 w-6 shrink-0 text-gold-light" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.3" />
          </svg>
          <span>
            {site.street}
            <br />
            <span className="text-mist/75">{site.city}</span>
          </span>
        </address>

        {/* die drei Wege zu uns */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={site.mapsLink(lang)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold-light px-5 py-3 text-[0.72rem] tracking-[0.16em] text-forest uppercase transition-colors hover:bg-mist"
          >
            {v.directions} <span aria-hidden="true">↗</span>
          </a>
          {legal.phone && (
            <a
              href={`tel:${legal.phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 rounded-full border border-mist/30 px-5 py-3 text-[0.72rem] tracking-[0.16em] uppercase transition-colors hover:border-gold-light hover:text-gold-light"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              {v.call}
            </a>
          )}
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label={`${v.instagram}: @gelatiamdom`}
            title="Instagram"
            className="grid h-[2.85rem] w-[2.85rem] place-items-center rounded-full border border-mist/30 transition-colors hover:border-gold-light hover:text-gold-light"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5.5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Visit() {
  const { t, lang } = useLang()

  return (
    <section id="visit" data-bg="#C4D0BC" className="relative overflow-x-clip py-28 text-ink md:py-44">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <p className="label text-gold">{t.visit.eyebrow}</p>
          <Appear as="h2" className="font-display mt-6 max-w-[13ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
            {t.visit.title}
          </Appear>

          <VisitCard />
        </div>

        {/* Echte OpenStreetMap-Karte des ganzen ersten Bezirks (lokal gespeicherte Bilder, keine Anfrage an Dritte),
            zum Erkunden. Der Knopf unten öffnet Google Maps mit der Route vom eigenen Standort zum Salon. */}
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] rounded-[20px] bg-mint shadow-[0_18px_50px_-30px_rgba(38,48,40,0.6)] md:rounded-[26px]">
            <DistrictMap />
            <a
              href={site.mapsLink(lang)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.route.mapsHint}: ${site.street}, ${site.city}`}
              className="label absolute inset-x-3 bottom-3 flex items-center justify-center gap-3 rounded-full bg-forest/90 px-5 py-3.5 text-mist backdrop-blur-sm transition-colors duration-300 hover:bg-gold md:inset-x-auto md:right-4 md:bottom-4"
            >
              {t.route.mapsHint}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          {/* Pflichtnachweis der Kartendaten (ODbL) */}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[0.65rem] text-ink-soft/80 transition-colors hover:text-ink"
          >
            © OpenStreetMap {lang === 'de' ? 'Mitwirkende' : 'contributors'}
          </a>
        </div>
      </div>
    </section>
  )
}
