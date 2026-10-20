import { useRef } from 'react'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Split from './Split'

// Feine Linien-Icons je Arbeitsschritt
const ICONS = [
  // Auswählen: Pistazie / Blatt
  <path key="0" d="M12 21c0-6 3-11 8-14-1 7-4 12-8 14Zm0 0C11 15 8 11 4 9c0 6 3 10 8 12Z" />,
  // Rühren: Kreis mit Pfeil
  <g key="1">
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v5h-5" />
  </g>,
  // Reifen: Uhr
  <g key="2">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </g>,
  // Servieren: Spatel
  <g key="3">
    <path d="M6 18 15.5 8.5" />
    <path d="M14 4.5c2-1.2 4.4-.8 5.6 1s.6 4-1.4 5.4l-3.7 1.6-3.1-3.1Z" />
  </g>,
]

export default function Process() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('.process-line', {
          scaleX: 0,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: { trigger: '.process-grid', start: 'top 92%', end: 'top 45%', scrub: true },
        })
        gsap.from('.process-step', {
          autoAlpha: 0,
          y: 30,
          stagger: 0.14,
          scrollTrigger: { trigger: '.process-grid', start: 'top 92%', end: 'top 50%', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="process" data-bg="#EAE2D4" className="relative py-28 text-ink md:py-40">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="label text-pistachio">{t.process.eyebrow}</p>
            <Split as="h2" className="font-display mt-6 max-w-[13ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
              {t.process.title}
            </Split>
          </div>
        </div>

        <div className="process-grid relative mt-16 grid gap-y-12 sm:grid-cols-2 sm:gap-x-10 md:mt-24 lg:grid-cols-4">
          <span className="process-line absolute inset-x-0 top-0 h-px bg-ink/15" aria-hidden="true" />
          {t.process.steps.map((s, i) => (
            <div key={i} className="process-step pt-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-gold italic">0{i + 1}</span>
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[i]}
                </svg>
              </div>
              <h3 className="font-display mt-8 text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-[22rem] text-sm leading-[1.8] text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
