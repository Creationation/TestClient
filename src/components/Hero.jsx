import { useRef } from 'react'
import { site } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Split from './Split'

export default function Hero() {
  const { t } = useLang()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // Auftritt: Video deckt sich langsam auf, Texte folgen
        gsap
          .timeline()
          .fromTo('.hero-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power3.inOut' }, 0)
          .from('.hero-video', { scale: 1.05, duration: 2.6, ease: 'power3.out' }, 0)
          .from('.hero-fade', { autoAlpha: 0, y: 16, duration: 1.4, stagger: 0.15 }, 0.9)

        // Beim Scrollen: Video wandert minimal, Text tritt zurück
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
          .to('.hero-frame', { yPercent: 8 }, 0)
          .to('.hero-copy', { yPercent: -12, autoAlpha: 0.2 }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative h-svh min-h-[620px] overflow-hidden bg-espresso text-cream">
      {/* Desktop: unscharfes, abgedunkeltes Standbild füllt den Hintergrund */}
      <div aria-hidden="true" className="absolute inset-0 hidden md:block">
        <img src={site.video.blur} alt="" className="h-full w-full scale-110 object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/85 to-espresso/55" />
      </div>

      <div className="relative mx-auto h-full max-w-[1520px] md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-16 md:px-16 md:pt-20 lg:gap-24">
        {/* Video: immer komplett sichtbar (contain), nie beschnitten */}
        <div className="hero-frame absolute inset-0 md:relative md:inset-auto md:order-2 md:overflow-hidden md:rounded-[28px] md:aspect-[9/16] md:h-[min(85svh,calc(100svh-7.5rem))]">
          <video
            className="hero-video h-full w-full object-contain object-top md:object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={site.video.poster}
            aria-label={t.hero.videoLabel}
          >
            <source src={site.video.webm} type="video/webm" />
            <source src={site.video.mp4} type="video/mp4" />
          </video>
          {/* Mobil: dunkler Verlauf, damit der Titel lesbar bleibt */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-espresso from-30% via-espresso/75 via-55% to-transparent md:hidden" />
        </div>

        <div className="hero-copy absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-10 md:static md:order-1 md:p-0">
          <p className="hero-fade label text-gold">{t.hero.kicker}</p>
          <h1 className="font-display mt-5 text-[clamp(3.6rem,17vw,5.5rem)] leading-[0.92] md:mt-8 md:text-[clamp(4.5rem,7.6vw,9.5rem)]">
            <Split as="span" immediate delay={0.5} className="block">
              Gelati
            </Split>
            <Split as="span" immediate delay={0.65} className="block italic">
              am Dom
            </Split>
          </h1>
          <Split immediate delay={0.9} className="mt-6 max-w-[22rem] text-[0.95rem] leading-relaxed text-cream/75 md:mt-10 md:max-w-md md:text-base">
            {t.hero.tagline}
          </Split>
          <a href="#flavors" className="hero-fade btn mt-8 border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-espresso md:mt-12">
            {t.hero.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
