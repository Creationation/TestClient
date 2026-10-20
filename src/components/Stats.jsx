import { useRef } from 'react'
import { gsap, useGSAP, MOTION, REDUCE } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Split from './Split'

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
          gsap.to(obj, {
            v: end,
            duration: end > 10 ? 2.8 : 1.6,
            ease: 'power2.out',
            // nur schreiben, wenn sich die Zahl wirklich ändert (spart Layout-Arbeit)
            onUpdate: () => {
              const v = Math.round(obj.v)
              if (v !== shown) el.textContent = shown = v
            },
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })
        gsap.from('.stat-item', {
          autoAlpha: 0,
          y: 30,
          duration: 1.6,
          stagger: 0.15,
          scrollTrigger: { trigger: '.stat-grid', start: 'top 90%', once: true },
        })
        gsap.from('.stat-line', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.8,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.stat-grid', start: 'top 90%', once: true },
        })
      })
      mm.add(REDUCE, () => nums.forEach((el) => (el.textContent = el.dataset.value)))
    },
    { scope: root },
  )

  return (
    <section ref={root} id="stats" data-bg="#F4EFE6" className="relative py-28 text-ink md:py-44">
      <div className="container-x">
        <p className="label text-pistachio">{t.stats.eyebrow}</p>
        <Split as="h2" className="font-display mt-6 max-w-[14ch] text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98]">
          {t.stats.title}
        </Split>

        <div className="stat-grid relative mt-16 grid md:mt-28 md:grid-cols-3">
          <span className="stat-line hairline absolute inset-x-0 top-0" aria-hidden="true" />
          {t.stats.items.map((s, i) => (
            <div key={i} className="stat-item flex flex-col border-b border-ink/15 py-10 md:border-b-0 md:py-14 md:pr-10 md:not-first:border-l md:not-first:pl-10">
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
