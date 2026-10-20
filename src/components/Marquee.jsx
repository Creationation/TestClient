import { useRef } from 'react'
import { flavors } from '../content'
import { gsap, ScrollTrigger, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'

const Row = ({ items }) => (
  <div className="flex shrink-0 items-center">
    {items.map((name, i) => (
      <span key={i} className="flex items-center">
        <span className="font-display px-8 text-[clamp(2.6rem,8vw,6.5rem)] leading-none italic md:px-14">{name}</span>
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
      </span>
    ))}
  </div>
)

// Langsames Laufband mit allen Sorten – läuft nur, solange es sichtbar ist.
export default function Marquee() {
  const { lang } = useLang()
  const root = useRef(null)
  const items = flavors.map((f) => f[lang].name)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const loop = gsap.to('.marquee-track', { xPercent: -50, duration: 45, ease: 'none', repeat: -1, paused: true })
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} data-bg="#C4D0BC" className="overflow-hidden border-y border-forest/10 py-10 text-forest/80 md:py-16" aria-hidden="true">
      <div className="marquee-track flex w-max will-change-transform">
        <Row items={items} />
        <Row items={items} />
      </div>
    </div>
  )
}
