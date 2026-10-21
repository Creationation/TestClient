import { useRef, useState } from 'react'
import { images, imageSrc } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import { RoutePanel, RouteVisual } from './Route'

const src = (w) => imageSrc(images.story, w, Math.round(w * 1.3))

// Sektion bleibt stehen: das Bild ist fix, die drei Absätze lösen einander ab.
// Danach wechselt alles (Bild, Titel, Text) zu „Der Weg zu uns“ vom Stephansdom.
export default function Story() {
  const { t } = useLang()
  const root = useRef(null)
  const [route, setRoute] = useState('dom')
  // erhöht sich, sobald die Karte erscheint → der Weg zeichnet sich neu
  const [drawKey, setDrawKey] = useState(0)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const panels = gsap.utils.toArray('.story-p')
        const fills = gsap.utils.toArray('.story-fill')
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 })
        gsap.set('.route-swap', { autoAlpha: 0, y: 24 })
        gsap.set('.route-media', { autoAlpha: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=330%', scrub: true, pin: true, anticipatePin: 1, refreshPriority: 2 },
        })
        tl.fromTo('.story-img', { scale: 1.15 }, { scale: 1, duration: 3 }, 0)
        fills.forEach((fill, i) => {
          tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, i)
          if (i < panels.length - 1) {
            // erst ausblenden, dann einblenden – Texte überlagern sich nie
            tl.to(panels[i], { autoAlpha: 0, y: -24, duration: 0.18, ease: 'power2.in' }, i + 0.78)
            tl.to(panels[i + 1], { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, i + 0.98)
          }
        })

        // Szenenwechsel: Bild, Kicker und Titel komplett tauschen
        tl.to('.story-swap', { autoAlpha: 0, y: -24, duration: 0.18, ease: 'power2.in' }, 2.78)
          .to('.route-swap', { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 2.98)
          .to('.story-img', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 2.75)
          .fromTo('.route-media', { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 2.9)
          .call(() => setDrawKey((k) => k + 1), null, 3)
      })
    },
    { scope: root },
  )

  const r = t.route

  return (
    <section ref={root} id="story" data-bg="#F3F6EF" className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[620px]">
      <div className="container-x grid h-full content-center items-center gap-6 pt-20 pb-8 motion-reduce:py-28 md:gap-10 md:pt-24 md:pb-12 lg:grid-cols-[1fr_1.05fr] lg:content-normal lg:gap-24">
        <figure className="relative h-[30svh] w-full overflow-hidden rounded-[22px] bg-mint md:h-[40svh] md:rounded-[28px] lg:mx-auto lg:h-[74svh] lg:max-h-[780px] lg:max-w-[540px]">
          <img
            src={src(900)}
            sizes="(min-width: 768px) 540px, 100vw"
            width={900}
            height={1170}
            alt={t.story.imageAlt}
            decoding="async"
            className="story-img absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          <div className="route-media absolute inset-0 motion-reduce:hidden">
            <RouteVisual active={route} drawKey={drawKey} />
          </div>
        </figure>

        <div className="flex min-w-0 flex-col">
          <div className="grid">
            <p className="story-swap label text-gold [grid-area:1/1]">{t.story.eyebrow}</p>
            <p className="route-swap label text-gold [grid-area:1/1] motion-reduce:hidden" aria-hidden="true">
              {r.eyebrow}
            </p>
          </div>
          <div className="mt-4 grid md:mt-6">
            <Appear as="h2" className="font-display text-[clamp(2.1rem,8vw,5.2rem)] leading-[0.98] [grid-area:1/1]">
              <span className="story-swap block">{t.story.title}</span>
            </Appear>
            <h2 className="route-swap font-display text-[clamp(2.1rem,8vw,5.2rem)] leading-[0.98] [grid-area:1/1] motion-reduce:hidden">{r.title}</h2>
          </div>

          <div className="mt-6 flex gap-2 md:mt-10" aria-hidden="true">
            {[...t.story.paragraphs, r].map((_, i) => (
              <span key={i} className="h-px w-12 bg-ink/15 md:w-16">
                <span className="story-fill block h-full origin-left bg-gold motion-reduce:scale-x-100" />
              </span>
            ))}
          </div>

          <div className="mt-5 grid min-w-0 grid-cols-1 motion-reduce:gap-10 md:mt-10">
            {t.story.paragraphs.map((p, i) => (
              <article key={i} className="story-p motion-safe:[grid-area:1/1]">
                <p className="font-display text-xl text-gold italic">0{i + 1}</p>
                <h3 className="font-display mt-2 text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1]">{p.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink-soft md:mt-5 md:text-base">{p.text}</p>
              </article>
            ))}
            <article className="story-p motion-safe:[grid-area:1/1]">
              {/* ohne Animation steht der Weg einfach als vierter Abschnitt da */}
              <h3 className="font-display mb-6 hidden text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1] motion-reduce:block">{r.title}</h3>
              <RoutePanel active={route} onChange={setRoute} />
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
