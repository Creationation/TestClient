import { useRef } from 'react'
import { site } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import Logo from './Logo'

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
    <section ref={root} id="top" className="relative h-svh min-h-[620px] overflow-hidden bg-forest text-mist">
      {/* Desktop: unscharfes, abgedunkeltes Standbild füllt den Hintergrund */}
      <div aria-hidden="true" className="absolute inset-0 hidden sm:block">
        <img src={site.video.blur} alt="" className="h-full w-full scale-110 object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/80 to-forest lg:bg-gradient-to-r lg:from-forest lg:via-forest/85 lg:to-forest/55" />
      </div>

      <div className="relative mx-auto h-full max-w-[1520px] sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-10 sm:px-10 sm:pt-20 sm:pb-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-24 lg:px-16 lg:pt-20 lg:pb-0">
        {/* Video: immer komplett sichtbar (contain), nie beschnitten */}
        <div className="hero-frame absolute inset-0 sm:relative sm:inset-auto sm:order-1 sm:aspect-[9/16] sm:h-[clamp(14rem,54svh,40rem)] sm:shrink-0 sm:overflow-hidden sm:rounded-[28px] lg:order-2 lg:h-[min(85svh,calc(100svh-7.5rem))]">
          <video
            className="hero-video h-full w-full object-contain object-top sm:object-center"
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
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-forest from-30% via-forest/75 via-55% to-transparent sm:hidden" />
        </div>

        <div className="hero-copy absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:static sm:order-2 sm:flex sm:flex-col sm:items-center sm:p-0 sm:text-center lg:order-1 lg:items-start lg:text-left">
          <div className="hero-fade flex flex-wrap items-center gap-x-4 gap-y-3 sm:justify-center lg:justify-start">
            <p className="label text-gold-light">{t.hero.kicker}</p>
          </div>
          {/* Schriftzug wie an der Wand des Salons */}
          <h1 aria-label="Gelati am Dom Wien" className="mt-6 text-[clamp(3rem,14vw,4.6rem)] sm:mt-5 sm:text-[clamp(3.4rem,8vw,4.8rem)] lg:mt-10 lg:text-[clamp(4rem,6.6vw,8rem)]">
            <Appear as="span" immediate delay={0.5} className="block drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
              <Logo />
            </Appear>
          </h1>
          <Appear immediate delay={0.9} className="mt-6 max-w-[22rem] text-[0.95rem] leading-relaxed text-mist/75 sm:mt-4 sm:max-w-md sm:text-base lg:mt-10">
            {t.hero.tagline}
          </Appear>
          <a href="#flavors" className="hero-fade btn mt-8 border-mist/40 text-mist hover:border-mist hover:bg-mist hover:text-forest sm:mt-7 lg:mt-12">
            {t.hero.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
