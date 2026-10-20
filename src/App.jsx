import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from './lib/gsap'
import { LangProvider, useLang } from './lib/lang'
import Header from './components/Header'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Story from './components/Story'
import Flavors from './components/Flavors'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Process from './components/Process'
import Offer from './components/Offer'
import Gallery from './components/Gallery'
import Visit from './components/Visit'
import Footer from './components/Footer'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Lenis glättet den nativen Fenster-Scroll (html/body) – kein eigener Scroll-Container.
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ wrapper: window, content: document.documentElement, anchors: true, lerp: 0.15 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}

function Page() {
  const { lang } = useLang()
  useSmoothScroll()

  // Hintergrund: Farbe gleitet beim Scrollen von Sektion zu Sektion (läuft nach den Pins der Kinder)
  useGSAP(
    () => {
      const sections = gsap.utils.toArray('[data-bg]')
      gsap.set('#bg', { backgroundColor: sections[0].dataset.bg })
      sections.slice(1).forEach((sec, i) => {
        const prev = sections[i]
        gsap.fromTo(
          '#bg',
          { backgroundColor: prev.dataset.bgEnd || prev.dataset.bg },
          {
            backgroundColor: sec.dataset.bg,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 30%', scrub: true },
          },
        )
      })
      // Lesefortschritt
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    },
    { dependencies: [lang], revertOnUpdate: true },
  )

  useEffect(() => {
    // Nach dem Laden von Schriften & Bildern Positionen neu berechnen
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Texte haben je Sprache andere Längen → Trigger neu vermessen
  const first = useRef(true)
  useEffect(() => {
    if (first.current) return void (first.current = false)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [lang])

  return (
    <>
      <div id="bg" aria-hidden="true" className="fixed inset-0 -z-10 bg-cream" />
      <div aria-hidden="true" className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gold" />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Story />
        <Flavors />
        <Marquee />
        <Stats />
        <Process />
        <Offer />
        <Gallery />
        <Visit />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  )
}
