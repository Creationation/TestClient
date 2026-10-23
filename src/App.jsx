import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP, prefersReduced, scroller } from './lib/gsap'
import { site } from './content'
import { LangProvider, useLang } from './lib/lang'
import Header from './components/Header'
import Hero from './components/Hero'
import Story from './components/Story'
import Flavors from './components/Flavors'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Process from './components/Process'
import Offer from './components/Offer'
import Menu from './components/Menu'
import Reels from './components/Reels'
import Gallery from './components/Gallery'
import Visit from './components/Visit'
import Footer from './components/Footer'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Lenis glättet den nativen Fenster-Scroll (html/body) – kein eigener Scroll-Container.
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ wrapper: window, content: document.documentElement, anchors: true, lerp: 0.15 })
    scroller.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])
}

function Page() {
  const { lang } = useLang()
  useSmoothScroll()

  // Hintergrund: Farbe gleitet beim Scrollen von Sektion zu Sektion (läuft nach den Pins der Kinder).
  // Eine einzige Rechnung aus allen Übergängen statt eines Tweens pro Sektion: die Tweens überschrieben sich
  // gegenseitig, beim Hochscrollen blieb die Farbe stehen und sprang dann. So ist es in beide Richtungen gleich weich.
  useGSAP(
    () => {
      const sections = gsap.utils.toArray('[data-bg]')
      const setBg = gsap.quickSetter('#bg', 'backgroundColor')
      let steps = []
      const render = () => {
        // die letzte Sektion, deren Übergang begonnen hat, bestimmt die Farbe
        let color = sections[0].dataset.bg
        for (const [i, st] of steps.entries()) {
          if (st.progress <= 0) break
          const prev = sections[i]
          color = gsap.utils.interpolate(prev.dataset.bgEnd || prev.dataset.bg, sections[i + 1].dataset.bg, st.progress)
        }
        setBg(color)
      }
      steps = sections
        .slice(1)
        .map((sec) => ScrollTrigger.create({ trigger: sec, start: 'top 85%', end: 'top 30%', onUpdate: render }))
      render()
      ScrollTrigger.addEventListener('refresh', render)
      return () => ScrollTrigger.removeEventListener('refresh', render)
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
      <div id="bg" aria-hidden="true" className="fixed inset-0 -z-10 bg-mint" />
      <Header />
      <main>
        <Hero />
        <Story />
        <Flavors />
        <Marquee />
        <Stats />
        {site.madeInHouse && <Process />}
        <Offer />
        <Menu />
        <Reels />
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
