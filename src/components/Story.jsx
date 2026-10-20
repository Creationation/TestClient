import { useRef } from 'react'
import { images, imageSrc } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'

const src = (w) => imageSrc(images.story, w, Math.round(w * 1.3))

// Sektion bleibt stehen: das Bild ist fix, die drei Absätze lösen einander ab.
export default function Story() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const paras = gsap.utils.toArray('.story-p')
        const fills = gsap.utils.toArray('.story-fill')
        gsap.set(paras.slice(1), { autoAlpha: 0, y: 24 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=240%', scrub: true, pin: true, anticipatePin: 1, refreshPriority: 2 },
        })
        tl.fromTo('.story-img', { scale: 1.15 }, { scale: 1, duration: 3 }, 0)
        fills.forEach((fill, i) => {
          tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, i)
          if (i < paras.length - 1) {
            // erst ausblenden, dann einblenden – Texte überlagern sich nie
            tl.to(paras[i], { autoAlpha: 0, y: -24, duration: 0.18, ease: 'power2.in' }, i + 0.78)
            tl.to(paras[i + 1], { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, i + 0.98)
          }
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="story" data-bg="#F3F6EF" className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[620px]">
      <div className="container-x grid h-full content-center items-center gap-6 pt-20 pb-8 motion-reduce:py-28 md:gap-10 md:pt-24 md:pb-12 lg:grid-cols-[1fr_1.05fr] lg:content-normal lg:gap-24">
        <figure className="relative h-[34svh] w-full overflow-hidden rounded-[22px] md:h-[42svh] md:rounded-[28px] lg:mx-auto lg:h-[74svh] lg:max-h-[780px] lg:max-w-[540px]">
          <img
            src={src(900)}
            sizes="(min-width: 768px) 540px, 100vw"
            width={900}
            height={1170}
            alt={t.story.imageAlt}
            decoding="async"
            className="story-img absolute inset-0 h-full w-full object-cover will-change-transform"
          />
        </figure>

        <div className="flex flex-col">
          <p className="label text-gold">{t.story.eyebrow}</p>
          <Appear as="h2" className="font-display mt-4 text-[clamp(2.3rem,8.5vw,5.2rem)] leading-[0.98] md:mt-6">
            {t.story.title}
          </Appear>

          <div className="mt-6 flex gap-2 md:mt-10" aria-hidden="true">
            {t.story.paragraphs.map((_, i) => (
              <span key={i} className="h-px w-16 bg-ink/15">
                <span className="story-fill block h-full origin-left bg-gold motion-reduce:scale-x-100" />
              </span>
            ))}
          </div>

          <div className="mt-6 grid motion-reduce:gap-10 md:mt-10">
            {t.story.paragraphs.map((p, i) => (
              <article key={i} className="story-p motion-safe:[grid-area:1/1]">
                <p className="font-display text-xl text-gold italic">0{i + 1}</p>
                <h3 className="font-display mt-2 text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1]">{p.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink-soft md:mt-5 md:text-base">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
