import { useRef } from 'react'
import { gsap, useGSAP, MOTION, REDUCE } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import Sconce from './Sconce'

export default function Stats() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      const nums = gsap.utils.toArray('.stat-num')
      const mm = gsap.matchMedia()

      mm.add(MOTION, () => {
        nums.forEach((el) => {
          const end = Number(el.dataset.value)
          const obj = { v: 0 }
          let shown = 0
          el.textContent = '0'
          // zählt einmal hoch, sobald die Zahl ins Bild kommt – läuft beim Zurückscrollen nicht rückwärts
          gsap.to(obj, {
            v: end,
            duration: end > 10 ? 1.6 : 0.8,
            ease: 'power2.out',
            // nur schreiben, wenn sich die Zahl wirklich ändert (spart Layout-Arbeit)
            onUpdate: () => {
              const v = Math.round(obj.v)
              if (v !== shown) el.textContent = shown = v
            },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
        gsap.from('.stat-item', {
          autoAlpha: 0,
          y: 30,
          stagger: 0.15,
          scrollTrigger: { trigger: '.stat-grid', start: 'top 95%', end: 'top 60%', scrub: true },
        })
      })
      mm.add(REDUCE, () => nums.forEach((el) => (el.textContent = el.dataset.value)))
    },
    { scope: root },
  )

  return (
    <section ref={root} id="stats" data-bg="#F3F6EF" className="relative overflow-x-clip py-28 text-ink md:py-44">
      <div className="container-x relative">
        <Sconce className="absolute top-0 right-6 h-24 w-20 sm:right-10 md:h-32 md:w-28 lg:right-16" />
        <p className="label text-pistachio">{t.stats.eyebrow}</p>
        <Appear as="h2" className="font-display mt-6 max-w-[14ch] text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98]">
          {t.stats.title}
        </Appear>

        <div className="stat-grid relative mt-16 grid gap-4 md:mt-24 md:grid-cols-3 md:gap-6">
          {t.stats.items.map((s, i) => (
            <div key={i} className="stat-item molding flex flex-col bg-paper/40 px-8 py-10 md:px-10 md:py-14">
              <p className="font-display flex items-start text-[clamp(6rem,28vw,8rem)] leading-[0.85] [contain:layout_style] md:text-[clamp(6rem,10vw,10rem)]">
                <span className="stat-num lining-nums tabular-nums" data-value={s.value} />
                {s.suffix && <span className="mt-[0.1em] ml-1 text-[0.35em] text-gold italic">{s.suffix}</span>}
              </p>
              <p className="label mt-8">{s.label}</p>
              <p className="mt-2 text-sm text-ink-soft">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
