import { useEffect, useRef, useState } from 'react'
import { menu } from '../content'
import { ScrollTrigger } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'

const tr = (v, lang) => (v && typeof v === 'object' ? v[lang] : v)

// Ornament wie auf der gedruckten Karte: Linie, Raute, Linie
const Ornament = ({ className = '' }) => (
  <svg viewBox="0 0 220 16" className={`h-4 w-44 text-gold ${className}`} aria-hidden="true">
    <path d="M0 8 H92 M128 8 H220" stroke="currentColor" strokeWidth="1" />
    <path d="M110 1 L117 8 L110 15 L103 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M110 5 L113 8 L110 11 L107 8 Z" fill="currentColor" />
  </svg>
)

// „Fruchtig ♥ Cremig ♥ …“ mit goldenen Herzen
const Tagline = ({ text, className = '' }) => (
  <p className={`label flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-ink-soft ${className}`}>
    {text.split('♥').map((part, i) => (
      <span key={i} className="flex items-center gap-3">
        {i > 0 && <span className="text-gold">♥</span>}
        {part.trim()}
      </span>
    ))}
  </p>
)

function Item({ item, lang }) {
  const name = tr(item.name, lang)
  const desc = tr(item.desc, lang)
  return (
    <li className="py-4">
      <div className="flex items-baseline gap-3">
        <h4 className="font-display text-xl leading-snug md:text-[1.35rem]">
          {name}
          {item.allergens && <span className="ml-2 align-middle font-sans text-[0.6rem] tracking-[0.15em] text-gold">({item.allergens})</span>}
        </h4>
        <span className="min-w-6 flex-1 translate-y-[-5px] border-b border-dotted border-forest/30" aria-hidden="true" />
        {item.price && <span className="font-display shrink-0 text-xl lining-nums tabular-nums">{item.price} €</span>}
      </div>
      {item.prices && (
        <div className="mt-1 flex justify-end gap-5 text-sm text-ink-soft">
          {item.prices.map(([size, price]) => (
            <span key={size} className="lining-nums tabular-nums">
              {size} <span className="font-display ml-1 text-lg text-ink">{price} €</span>
            </span>
          ))}
        </div>
      )}
      {desc && <p className="mt-1 max-w-[34rem] text-sm leading-relaxed text-ink-soft">{desc}</p>}
    </li>
  )
}

// Speisekarte mit Registern, gestaltet wie die gedruckte Karte im Salon
export default function Menu() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(menu.categories[0].key)
  const cat = menu.categories.find((c) => c.key === active)
  const first = useRef(true)

  // Höhe ändert sich je Register → Scroll-Trigger darunter neu vermessen
  useEffect(() => {
    if (first.current) return void (first.current = false)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [active])

  return (
    <section id="menu" data-bg="#F3F6EF" className="relative py-28 text-ink md:py-40">
      <div className="container-x">
        <p className="label text-pistachio">{t.menu.eyebrow}</p>
        <Appear as="h2" className="font-display mt-6 text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
          {t.menu.title}
        </Appear>

        {/* Register */}
        <div role="tablist" aria-label={t.menu.eyebrow} className="mt-10 flex flex-wrap gap-2 md:mt-14 md:gap-3">
          {menu.categories.map((c) => (
            <button
              key={c.key}
              role="tab"
              type="button"
              aria-selected={active === c.key}
              aria-controls="menu-panel"
              onClick={() => setActive(c.key)}
              className={`rounded-full border px-4 py-2.5 font-sans text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-300 md:px-6 ${
                active === c.key ? 'border-forest bg-forest text-mist' : 'border-forest/20 text-ink hover:border-forest/50'
              }`}
            >
              {tr(c.title, lang)}
            </button>
          ))}
        </div>

        {/* Karte im Stil der gedruckten Speisekarte: Marmorpapier, goldener Doppelrahmen */}
        <div
          id="menu-panel"
          role="tabpanel"
          className="relative mt-8 rounded-[20px] border border-gold/40 bg-paper bg-[radial-gradient(ellipse_at_20%_10%,rgba(216,189,131,0.12),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(196,208,188,0.25),transparent_55%)] p-3 shadow-[0_30px_60px_-40px_rgba(47,59,50,0.45)] md:mt-10 md:rounded-[28px] md:p-4"
        >
          <div className="rounded-[14px] border border-gold/30 px-5 py-10 md:rounded-[20px] md:px-14 md:py-16">
            <div key={active} className="animate-[menuIn_0.5s_ease-out]">
              <div className="flex flex-col items-center text-center">
                <Ornament />
                <h3 className="font-display mt-5 text-[clamp(2.2rem,6vw,4rem)] leading-none tracking-[0.04em] uppercase">{tr(cat.title, lang)}</h3>
                <Tagline text={tr(cat.tagline, lang)} className="mt-4" />
              </div>

              <div className={`mt-10 grid gap-x-14 gap-y-10 md:mt-14 ${cat.groups.length > 1 ? 'lg:grid-cols-2' : ''}`}>
                {cat.groups.map((g, gi) => (
                  <div key={gi}>
                    {g.title && <h4 className="font-display text-3xl text-gold italic md:text-4xl">{tr(g.title, lang)}</h4>}
                    <ul className={`divide-y divide-forest/10 ${g.title ? 'mt-3' : ''} ${!g.title && cat.groups.length === 1 ? 'md:columns-2 md:gap-x-14 [&>li]:break-inside-avoid' : ''}`}>
                      {g.items.map((item, i) => (
                        <Item key={i} item={item} lang={lang} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {cat.note && <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-soft italic">{tr(cat.note, lang)}</p>}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 border-t border-gold/25 pt-8 text-center">
              <Tagline text={tr(menu.tagline, lang)} />
              <p className="max-w-3xl text-xs leading-relaxed text-ink-soft">
                {tr(menu.prices, lang)} {menu.allergens[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
