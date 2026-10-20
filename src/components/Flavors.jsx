import { useRef } from 'react'
import { flavors, unsplash } from '../content'
import { gsap, ScrollTrigger, useGSAP, MOTION, REDUCE } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'

const cardSrc = (img, w) => unsplash(img.id, w, Math.round(w * 1.25), img.crop)

export default function Flavors() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const track = useRef(null)
  const counter = useRef(null)

  useGSAP(
    () => {
      let active = 0
      const activate = (i) => {
        active = i
        if (counter.current) counter.current.textContent = String(i + 1).padStart(2, '0')
      }
      const mm = gsap.matchMedia()

      mm.add(MOTION, () => {
        const distance = () => Math.max(0, track.current.scrollWidth - document.documentElement.clientWidth)

        // Horizontaler Scroll, gesteuert vom vertikalen Scroll
        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onEnter: () => activate(active),
            onEnterBack: () => activate(active),
          },
        })

        gsap.to('.flavors-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })

        gsap.utils.toArray('.flavor-card').forEach((card, i) => {
          // Hintergrund nimmt die Nuance der sichtbaren Sorte an
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: scroll,
            start: 'left 55%',
            end: 'right 55%',
            onToggle: (self) => self.isActive && activate(i),
          })
          // Bild zoomt sanft heraus, während die Karte durchs Bild wandert
          gsap.fromTo(
            card.querySelector('img'),
            { scale: 1.2 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left right', end: 'right 40%', scrub: true } },
          )
        })
      })

      mm.add(REDUCE, () => {
        ScrollTrigger.create({ trigger: root.current, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && activate(0) })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="flavors" data-bg="#C4D0BC" className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[680px]">
      <div className="flex h-full flex-col justify-center gap-8 pt-24 pb-8 motion-reduce:py-28 md:gap-12 md:pt-28">
        <div className="container-x flex items-end justify-between gap-6">
          <div>
            <p className="label text-gold">{t.flavors.eyebrow}</p>
            <Appear as="h2" className="font-display mt-4 text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.95] md:mt-6">
              {t.flavors.title}
            </Appear>
            <p className="mt-3 max-w-md text-sm text-ink-soft md:mt-4">{t.flavors.subtitle}</p>
          </div>
          <p className="font-display shrink-0 text-2xl lining-nums tabular-nums md:text-3xl" aria-hidden="true">
            <span ref={counter}>01</span>
            <span className="text-ink/30"> / {String(flavors.length).padStart(2, '0')}</span>
          </p>
        </div>

        <div className="scroll-px-6 motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto sm:scroll-px-10 lg:scroll-px-16">
          <ul ref={track} className="flex w-max gap-5 px-6 will-change-transform sm:gap-8 sm:px-10 lg:gap-12 lg:px-16">
            {flavors.map((f, i) => {
              const c = f[lang]
              return (
                <li key={f.key} className="flavor-card flex w-[74vw] shrink-0 snap-start flex-col sm:w-[44vw] lg:w-[clamp(300px,24vw,380px)]">
                  <div className="relative aspect-[4/5] max-h-[46svh] w-full overflow-hidden rounded-[20px] bg-mint md:max-h-[50svh] md:rounded-[26px]">
                    <img
                      src={cardSrc(f.image, 760)}
                      srcSet={`${cardSrc(f.image, 480)} 480w, ${cardSrc(f.image, 760)} 760w, ${cardSrc(f.image, 1100)} 1100w`}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 44vw, 74vw"
                      width={760}
                      height={950}
                      alt={c.name}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-forest/15 pb-4 md:mt-7">
                    <h3 className="font-display text-[clamp(2rem,7vw,2.6rem)] leading-none italic">{c.name}</h3>
                    <span className="label text-[0.6rem] text-gold">N° {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="label mt-4 text-[0.6rem] text-ink-soft">{c.origin}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.text}</p>
                </li>
              )
            })}
            <li className="w-px shrink-0" aria-hidden="true" />
          </ul>
        </div>

        <div className="container-x motion-reduce:hidden" aria-hidden="true">
          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-forest/15">
              <span className="flavors-progress block h-full origin-left scale-x-0 bg-gold" />
            </span>
            <span className="label text-[0.6rem] text-ink-soft">{t.flavors.hint}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
