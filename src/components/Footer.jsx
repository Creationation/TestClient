import { useRef } from 'react'
import { site } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'

export default function Footer() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('.footer-word', {
          yPercent: 100,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: '.footer-giant', start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-cream/10 bg-espresso-deep text-cream">
      <div className="container-x grid gap-12 pt-20 pb-14 md:grid-cols-[1.5fr_1fr_1fr] md:pt-28">
        <p className="font-display max-w-[18ch] text-3xl leading-tight italic md:text-4xl">{t.footer.claim}</p>
        <div className="text-sm leading-relaxed text-cream/65">
          <p className="label text-gold">{t.visit.addressTitle}</p>
          <p className="mt-4">
            {site.street}
            <br />
            {site.city}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-cream/65">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
            Instagram ↗
          </a>
          <a href="#top" className="transition-colors hover:text-cream">
            {t.footer.top} ↑
          </a>
          <p className="mt-6 text-xs text-cream/40">© 2026 Gelati am Dom · {t.footer.demo}</p>
        </div>
      </div>
      <div className="container-x">
        <span className="hairline block" aria-hidden="true" />
      </div>
      <p
        aria-label="Gelati am Dom"
        className="footer-giant font-display flex justify-center gap-[0.22em] overflow-hidden pt-[2vw] pb-[1vw] text-[15vw] leading-[0.95] whitespace-nowrap text-cream/90"
      >
        {['Gelati', 'am', 'Dom'].map((w) => (
          <span key={w} aria-hidden="true" className={`footer-word inline-block ${w === 'am' ? 'text-gold italic' : ''}`}>
            {w}
          </span>
        ))}
      </p>
    </footer>
  )
}
