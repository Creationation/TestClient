import { useRef } from 'react'
import { site } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Logo from './Logo'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('.footer-logo', {
          yPercent: 30,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.footer-giant', start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-mist/10 bg-forest-deep text-mist">
      {/* Leitsatz groß und mittig, in der kräftigeren Playfair (wie die Überschriften), gut lesbar */}
      <div className="container-x pt-20 text-center md:pt-28">
        <span className="mx-auto block h-px w-16 bg-gold-light/60" aria-hidden="true" />
        <p className="font-logo mx-auto mt-8 max-w-[17ch] text-[clamp(2.3rem,7vw,4.8rem)] leading-[1.08] tracking-[-0.01em] text-mist">{t.footer.claim}</p>
      </div>
      <div className="container-x grid gap-12 pt-16 pb-14 md:grid-cols-2 md:pt-20">
        <div className="text-sm leading-relaxed text-mist/65">
          <p className="label text-gold">{t.visit.addressTitle}</p>
          <p className="mt-4">
            {site.street}
            <br />
            {site.city}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-mist/65">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-mist">
            Instagram ↗
          </a>
          <a href="#top" className="transition-colors hover:text-mist">
            {t.footer.top} ↑
          </a>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-mist/55">
            <a href="/impressum.html" className="transition-colors hover:text-mist">
              {t.footer.imprint}
            </a>
            <a href="/datenschutz.html" className="transition-colors hover:text-mist">
              {t.footer.privacy}
            </a>
          </p>
          <p className="text-xs text-mist/40">
            © {YEAR} Gelati am Dom{site.stockPhotos && ` · ${t.footer.photos}`}
          </p>
        </div>
      </div>
      <div className="container-x">
        <span className="hairline block" aria-hidden="true" />
      </div>
      {/* großer Schriftzug in Messing-Gold, wie an der Wand */}
      <div className="footer-giant flex justify-center overflow-hidden px-6 pt-[4vw] pb-[3vw] text-[12.5vw] md:text-[10.5vw]">
        <Logo className="footer-logo" tone="gold-light" />
      </div>
    </footer>
  )
}
