import { useRef } from 'react'
import { scoopFlavors } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import GelatoTower from './GelatoTower'
import Ingredients from './Ingredients'
import WallPanel from './WallPanel'

// Eiskugel-Szene: Beim Scrollen entsteht Kugel für Kugel ein Gelato
// (Pistazie → Erdbeere → Schokolade). Zutaten schweben herein,
// das Statement leuchtet Wort für Wort auf. Alles hängt direkt am Scroll (scrub: true).
export default function Intro() {
  const { t } = useLang()
  const root = useRef(null)
  const words = t.intro.statement.split(' ')

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const balls = gsap.utils.toArray('.tower-ball')
        const ings = gsap.utils.toArray('.ing')

        gsap.set(balls, { y: -520, autoAlpha: 0 })
        gsap.set('.ing-item', { autoAlpha: 0, scale: 0.3, y: 70 })
        gsap.set('.tower-wafer', { y: -140, autoAlpha: 0 })
        gsap.set('.tower-drip', { scaleY: 0, transformOrigin: '50% 0%' })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=300%', scrub: true, pin: true, anticipatePin: 1, refreshPriority: 3 },
        })

        // „Kamera“ zoomt langsam heraus, während der Turm wächst
        tl.fromTo('.tower-cam', { scale: 1.5, yPercent: 20 }, { scale: 1, yPercent: 0, duration: 3.6, ease: 'power1.inOut' }, 0)
          .fromTo('.intro-wall', { yPercent: 6 }, { yPercent: -4, duration: 4 }, 0)
          .to('.ball-tex', { rotate: 300, svgOrigin: '200 215', duration: 4 }, 0)
          .fromTo('.intro-word', { opacity: 0.14 }, { opacity: 1, stagger: 2.4 / words.length, duration: 0.3 }, 0)

        scoopFlavors.forEach((_, i) => {
          const at = 0.1 + i * 1.05
          const items = ings[i].querySelectorAll('.ing-item')
          // Kugel fällt auf die Waffel bzw. die Kugel darunter und federt kurz ein
          tl.to(balls[i], { y: 0, duration: 0.55, ease: 'power2.in' }, at)
            .to(balls[i], { autoAlpha: 1, duration: 0.12 }, at)
            .to(balls[i], { scaleY: 0.9, scaleX: 1.05, transformOrigin: '50% 100%', duration: 0.1, ease: 'power1.out' }, at + 0.55)
            .to(balls[i], { scaleY: 1, scaleX: 1, duration: 0.2, ease: 'power1.out' }, at + 0.65)
            // Zutaten schweben herein und treiben weiter
            .to(items, { autoAlpha: 1, scale: 1, y: 0, stagger: 0.05, duration: 0.45, ease: 'power2.out' }, at + 0.2)
            .to(items, { y: -60, rotate: '+=70', duration: 1.2, stagger: 0.03 }, at + 0.65)

          if (i > 0) {
            const prev = ings[i - 1].querySelectorAll('.ing-item')
            tl.to(prev, { autoAlpha: 0, scale: 0.6, y: -120, stagger: 0.03, duration: 0.35 }, at + 0.1)
              .to(`.intro-name-${i - 1}`, { opacity: 0.3, duration: 0.2 }, at + 0.3)
              .to(`.intro-name-${i}`, { opacity: 1, duration: 0.2 }, at + 0.3)
              .fromTo(`.intro-bar-${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, at)
          }
        })

        // Waffelröllchen steckt sich oben hinein, dann läuft ein Tropfen die Waffel hinunter
        tl.to('.tower-wafer', { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 2.85)
          .to('.tower-drip', { scaleY: 1, duration: 0.8, ease: 'power1.in' }, 3.1)
          .to({}, { duration: 0.2 }) // kurzer Halt am Ende
      })
    },
    { scope: root, dependencies: [t.intro.statement], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="intro" data-bg="#DFE7D8" className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[620px]">
      <div className="container-x flex h-full flex-col gap-4 pt-20 pb-6 md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 md:pt-24 md:pb-10">
        <div className="relative z-10">
          <p className="label text-gold">{t.intro.eyebrow}</p>
          <p className="font-display mt-4 max-w-[19ch] text-[clamp(1.7rem,6.6vw,4.2rem)] leading-[1.1] md:mt-6">
            {words.map((w, i) => (
              <span key={i} className="intro-word">
                {w}{' '}
              </span>
            ))}
          </p>
          <ol className="mt-5 flex gap-5 md:mt-12 md:flex-col md:gap-4">
            {t.intro.flavors.map((name, i) => (
              <li key={name} className={`intro-name-${i} flex items-center gap-3 md:gap-4 ${i > 0 ? 'motion-safe:opacity-30' : ''}`}>
                <span className="label text-gold">0{i + 1}</span>
                <span className="font-display text-lg italic md:text-2xl">{name}</span>
                <span className="hidden h-px w-16 bg-ink/15 md:block">
                  <span className={`intro-bar-${i} block h-full origin-left bg-gold ${i === 0 ? '' : 'motion-safe:scale-x-0'}`} />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden md:h-[80svh] md:flex-none">
          {/* geschwungene, hinterleuchtete Wand mit Efeu – wie im Salon */}
          <div aria-hidden="true" className="intro-wall absolute inset-0 flex justify-center">
            <WallPanel className="h-full w-auto" />
          </div>
          <Ingredients />
          <div className="tower-cam absolute inset-0 flex items-end justify-center will-change-transform">
            <GelatoTower className="h-full w-auto max-w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
