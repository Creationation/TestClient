import { useRef } from 'react'
import { scoopFlavors } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Scoop from './Scoop'

const vars = (f) => ({ '--s-light': f.light, '--s-mid': f.mid, '--s-dark': f.dark, '--s-lip': f.lip, '--s-bit': f.bit })
const first = scoopFlavors[0]
const last = scoopFlavors.at(-1)

// Eiskugel-Szene: Die Kugel dreht sich, wächst und wechselt die Sorte,
// während das Statement Wort für Wort aufleuchtet und der Hintergrund sich tönt.
export default function Intro() {
  const { t } = useLang()
  const root = useRef(null)
  const words = t.intro.statement.split(' ')

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=180%', scrub: 0.8, pin: true, anticipatePin: 1, refreshPriority: 3 },
        })
        tl.fromTo('.intro-scoop', { scale: 0.7, rotate: -10, yPercent: 10 }, { scale: 1.12, rotate: 8, yPercent: 0, duration: 3 }, 0)
          .to('.scoop-texture', { rotate: 420, svgOrigin: '200 215', duration: 3 }, 0)
          .fromTo('.intro-word', { opacity: 0.14 }, { opacity: 1, stagger: 1.6 / words.length, duration: 0.4 }, 0.1)

        // Sorte & Hintergrund wechseln: Pistazie → Erdbeere → Schokolade
        const bg = document.getElementById('bg') // liegt außerhalb des Scopes
        scoopFlavors.slice(1).forEach((f, i) => {
          const at = 0.9 + i * 1
          tl.to('.intro-scoop svg', { ...vars(f), duration: 0.6 }, at)
            .to(bg, { backgroundColor: f.bg, duration: 0.6 }, at)
            .to(`.intro-name-${i}`, { autoAlpha: 0, yPercent: -60, duration: 0.3 }, at)
            .fromTo(`.intro-name-${i + 1}`, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, at + 0.25)
        })
      })
    },
    { scope: root, dependencies: [t.intro.statement], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="intro" data-bg={first.bg} data-bg-end={last.bg} className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[600px]">
      <div className="container-x flex h-full flex-col items-center justify-center gap-6 py-24 text-center md:gap-10">
        <p className="label text-gold">{t.intro.eyebrow}</p>
        <p className="font-display max-w-[18ch] text-[clamp(2rem,7.5vw,4.6rem)] leading-[1.08]">
          {words.map((w, i) => (
            <span key={i} className="intro-word">
              {w}{' '}
            </span>
          ))}
        </p>
        <div className="intro-scoop w-[min(60vw,36svh)] will-change-transform md:w-[min(20vw,38svh)]">
          <Scoop className="h-auto w-full" style={vars(first)} />
        </div>
        <div className="label relative h-5 w-full overflow-hidden text-ink-soft" aria-hidden="true">
          {t.intro.flavors.map((name, i) => (
            <span key={name} className={`intro-name-${i} absolute inset-x-0 ${i > 0 ? 'invisible' : ''}`}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
