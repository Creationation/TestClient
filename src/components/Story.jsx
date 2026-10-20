import { useRef } from 'react'
import { images } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Reveal from './Reveal'
import Split from './Split'

// Das Bild bleibt (sticky) stehen, während die drei Absätze nacheinander erscheinen.
export default function Story() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.utils.toArray('.story-step').forEach((step) => {
          gsap.from(step.querySelectorAll('.story-fade'), {
            autoAlpha: 0,
            y: 20,
            duration: 1.6,
            stagger: 0.12,
            scrollTrigger: { trigger: step, start: 'top 72%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="story" className="relative bg-cream text-ink">
      <div className="md:grid md:grid-cols-2">
        <div className="sticky top-0 h-svh md:self-start">
          <Reveal image={images.story} ratio={0.75} fill sizes="(min-width: 768px) 50vw, 100vw" alt={t.story.imageAlt} className="h-full rounded-none!" />
          {/* Mobil liegt der Text auf dem Bild → abdunkeln */}
          <div aria-hidden="true" className="absolute inset-0 bg-espresso/65 md:hidden" />
        </div>

        <div className="relative z-10 -mt-[100svh] text-cream md:mt-0 md:text-ink">
          <div className="flex min-h-[80svh] flex-col justify-end px-6 pb-16 sm:px-10 md:min-h-svh md:justify-center md:px-16 md:pb-0 lg:px-24">
            <p className="label text-gold">{t.story.eyebrow}</p>
            <Split as="h2" className="font-display mt-6 max-w-[12ch] text-[clamp(2.8rem,10vw,6rem)] leading-[0.98]">
              {t.story.title}
            </Split>
          </div>

          {t.story.paragraphs.map((p, i) => (
            <article key={i} className="story-step flex min-h-[85svh] flex-col justify-center px-6 sm:px-10 md:min-h-[90svh] md:px-16 lg:px-24">
              <div className="story-fade flex items-center gap-5">
                <span className="font-display text-2xl text-gold italic">0{i + 1}</span>
                <span className="hairline max-w-24" />
              </div>
              <Split as="h3" className="font-display mt-6 text-[clamp(2rem,6vw,3.6rem)] leading-[1.05]" start="top 75%">
                {p.title}
              </Split>
              <Split className="mt-6 max-w-[30rem] text-base leading-[1.8] opacity-80 md:text-[1.05rem]" start="top 78%">
                {p.text}
              </Split>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
