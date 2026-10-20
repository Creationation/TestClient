import { useRef, useState } from 'react'
import { flavors, unsplash } from '../content'
import { useLang } from '../lib/lang'
import Appear from './Appear'

const cardSrc = (img, w) => unsplash(img.id, w, Math.round(w * 1.25), img.crop)

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d={dir < 0 ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Sorten zum Wischen: eigenes horizontales Scrollen, unabhängig vom Seitenscroll
export default function Flavors() {
  const { t, lang } = useLang()
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const step = () => {
    const card = track.current?.querySelector('li')
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track.current).columnGap || 0) : 300
  }
  const onScroll = () => {
    const el = track.current
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setIndex(Math.min(flavors.length - 1, Math.round(el.scrollLeft / step())))
  }
  const go = (dir) => track.current?.scrollBy({ left: dir * step(), behavior: 'smooth' })

  return (
    <section id="flavors" data-bg="#C4D0BC" className="relative overflow-hidden py-24 text-ink md:py-32">
      <div className="container-x flex items-end justify-between gap-6">
        <div>
          <p className="label text-gold">{t.flavors.eyebrow}</p>
          <Appear as="h2" className="font-display mt-4 text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.95] md:mt-6">
            {t.flavors.title}
          </Appear>
          <p className="mt-3 max-w-md text-sm text-ink-soft md:mt-4">{t.flavors.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <p className="font-display text-2xl lining-nums tabular-nums md:text-3xl" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
            <span className="text-ink/30"> / {String(flavors.length).padStart(2, '0')}</span>
          </p>
          <div className="hidden gap-2 md:flex">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={d < 0 ? t.flavors.prev : t.flavors.next}
                className="grid h-12 w-12 place-items-center rounded-full border border-forest/25 transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-mist"
              >
                <Arrow dir={d} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* data-lenis-prevent: der Smooth-Scroll greift hier nicht ein, Wischen bleibt nativ */}
      <ul
        ref={track}
        onScroll={onScroll}
        data-lenis-prevent
        className="mt-10 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto overscroll-x-contain px-6 pb-2 [scrollbar-width:none] sm:scroll-px-10 sm:gap-8 sm:px-10 md:mt-14 lg:scroll-px-16 lg:gap-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {flavors.map((f, i) => {
          const c = f[lang]
          return (
            <li key={f.key} className="flex w-[74vw] shrink-0 snap-start flex-col sm:w-[44vw] lg:w-[clamp(280px,24vw,380px)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-mint md:rounded-[26px]">
                <img
                  src={cardSrc(f.image, 760)}
                  srcSet={`${cardSrc(f.image, 480)} 480w, ${cardSrc(f.image, 760)} 760w, ${cardSrc(f.image, 1100)} 1100w`}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 44vw, 74vw"
                  width={760}
                  height={950}
                  alt={c.name}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable="false"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-forest/15 pb-4 md:mt-7">
                <h3 className="font-display text-[clamp(2rem,7vw,2.6rem)] leading-none italic">{c.name}</h3>
                <span className="label text-[0.6rem] text-gold">N° {String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="label mt-4 text-[0.6rem] text-ink-soft">{c.note}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.text}</p>
            </li>
          )
        })}
        <li className="w-px shrink-0" aria-hidden="true" />
      </ul>

      <div className="container-x mt-8" aria-hidden="true">
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-forest/15">
            <span className="block h-full origin-left bg-gold transition-transform duration-200" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
          </span>
          <span className="label text-[0.6rem] text-ink-soft">{t.flavors.hint}</span>
        </div>
      </div>
    </section>
  )
}
