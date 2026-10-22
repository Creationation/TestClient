import { useRef, useState } from 'react'
import { images, imageSrc } from '../content'
import { gsap, ScrollTrigger, useGSAP, MOTION, scroller } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import { RoutePanel, RouteVisual, useRoute } from './Route'

const src = (w) => imageSrc(images.story, w, Math.round(w * 1.3))
// Schritt 02 hat ein eigenes Gesicht: Pistazienbild, samtgrüner Grund, helle Schrift, Playfair
const HOME = 1

// Sektion bleibt stehen: das Bild ist fix, die drei Absätze lösen einander ab.
// Schritt 02 bekommt ein eigenes Bild, einen dunklen Grund und eine andere Schrift.
// Danach wechselt alles (Bild, Titel, Text) zu „Der Weg zu uns“ vom Stephansdom.
// Jede Scrollbewegung führt genau einen Schritt weiter, auch bei schnellem Wischen.
export default function Story() {
  const { t } = useLang()
  const root = useRef(null)
  const route = useRoute()
  // erhöht sich, sobald die Karte erscheint → der Weg zeichnet sich neu
  const [drawKey, setDrawKey] = useState(0)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const panels = gsap.utils.toArray('.story-p')
        const fills = gsap.utils.toArray('.story-fill')
        const steps = panels.length - 1
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 })
        gsap.set('.route-swap', { autoAlpha: 0, y: 24 })
        gsap.set('.route-media', { autoAlpha: 0 })
        gsap.set('.story-home, .story-tint', { autoAlpha: 0 })
        gsap.set(fills[0], { scaleX: 1 })

        // Schritt-Steuerung: Sobald die Sektion ins Bild kommt (auch mit viel Schwung), gleitet die Seite ganz auf den
        // ersten Schritt (von unten: auf den letzten), das Bild wird nie angeschnitten. Der Schwung verpufft, danach führt
        // jede Geste genau einen Schritt weiter. Nach dem letzten Schritt gleitet die Seite ganz zur nächsten Sektion
        // (vor dem ersten: zurück zum Hero) und scrollt dort wieder ganz normal.
        let index = 0
        let locked = false
        let moving = false
        let quietUntil = 0
        let acc = 0
        let navUntil = 0
        const lenis = () => scroller.lenis
        const pos = (k) => tl.scrollTrigger.start + (k / steps) * (tl.scrollTrigger.end - tl.scrollTrigger.start)
        // Während der Sperre steht Lenis still, deshalb gleitet die Seite hier selbst (nativer Scroll, per GSAP)
        const glide = { y: 0 }
        const scrollTo = (y, immediate) => {
          gsap.killTweensOf(glide)
          if (immediate) {
            moving = false
            return window.scrollTo(0, y)
          }
          moving = true
          glide.y = window.scrollY
          gsap.to(glide, {
            y,
            duration: 0.9,
            ease: 'power2.inOut',
            onUpdate: () => window.scrollTo(0, glide.y),
            onComplete: () => (moving = false),
          })
        }
        // Rand der Zone: eine Bildschirmhöhe vor dem Anfang und nach dem Ende der Sektion
        const before = () => Math.max(0, tl.scrollTrigger.start - window.innerHeight)
        const after = () => tl.scrollTrigger.end + root.current.offsetHeight
        const lock = (k) => {
          // schon gesperrt (z. B. genau am Anfang: GSAP meldet beim ersten Pixel erneut „Eintritt“)
          if (locked || performance.now() < navUntil) return
          locked = true
          index = k
          acc = 0
          // der Schwung, der uns hierher gebracht hat, zählt nicht als Geste
          quietUntil = performance.now() + 500
          lenis()?.stop()
          intent.enable()
          scrollTo(pos(k))
        }
        const release = () => {
          locked = false
          intent.disable()
          lenis()?.start()
        }
        const step = (dir) => {
          const k = index + dir
          if (k < 0 || k > steps) {
            // raus aus der Sektion: ganz zur nächsten Sektion (bzw. zurück zum Hero), nichts bleibt angeschnitten
            release()
            const y = dir > 0 ? after() : before()
            const l = lenis()
            return l ? l.scrollTo(y, { duration: 1, lock: true }) : scrollTo(y)
          }
          index = k
          scrollTo(pos(k))
        }
        // Rad, Trackpad und Wischen: Ausschwingen eines Trackpads oder ein langer Wisch zählen als eine Geste
        const intent = ScrollTrigger.observe({
          target: window,
          type: 'wheel,touch',
          wheelSpeed: -1,
          preventDefault: true,
          allowClicks: true,
          onChangeY: (self) => {
            const now = performance.now()
            if (moving || now < quietUntil) {
              quietUntil = Math.max(quietUntil, now + 180)
              acc = 0
              return
            }
            acc += self.deltaY
            if (Math.abs(acc) < 24) return
            const dir = acc < 0 ? 1 : -1
            acc = 0
            quietUntil = now + 400
            step(dir)
          },
        })
        intent.disable()
        // Restschwung (z. B. iOS) hält die Seite nicht auf: zurück auf den aktuellen Schritt
        const hold = () => locked && !moving && Math.abs(window.scrollY - pos(index)) > 2 && scrollTo(pos(index), true)
        window.addEventListener('scroll', hold, { passive: true })
        // Tastatur: Pfeile, Bild auf/ab und Leertaste blättern ebenfalls Schritt für Schritt
        const onKey = (e) => {
          if (!locked || e.defaultPrevented || moving) return
          const field = e.target.closest?.('a, button, input, select, textarea, [role="listbox"]')
          const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': field ? 0 : e.shiftKey ? -1 : 1 }[e.key]
          if (!dir) return
          e.preventDefault()
          step(dir)
        }
        window.addEventListener('keydown', onKey)
        // Menü- und Ankerlinks springen ungebremst durch die Sektion
        const onAnchor = (e) => {
          if (!e.target.closest?.('a[href^="#"]')) return
          navUntil = performance.now() + 3000
          if (locked) release()
        }
        document.addEventListener('click', onAnchor, true)

        // Schritt k liegt genau bei Zeit k; die Wechsel passieren dazwischen
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: `+=${steps * 80}%`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 2,
          },
        })
        tl.fromTo('.story-img', { scale: 1.15 }, { scale: 1, duration: steps - 0.5 }, 0)
        for (let k = 0; k < steps; k++) {
          // erst ausblenden, dann einblenden – Texte überlagern sich nie
          tl.to(panels[k], { autoAlpha: 0, y: -24, duration: 0.15, ease: 'power2.in' }, k + 0.3)
          tl.to(panels[k + 1], { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, k + 0.5)
          tl.fromTo(fills[k + 1], { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, k + 0.3)
        }

        // Schritt 02: Bild, Grund und Schriftfarben blenden mit dem Text um (Tailwind liest die Farben aus Variablen)
        const dark = { '--color-ink': '#F3F6EF', '--color-ink-soft': '#C4D0BC' }
        const light = { '--color-ink': '#263028', '--color-ink-soft': '#5D695F' }
        tl.to('.story-home, .story-tint', { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, HOME - 0.7)
          .fromTo('.story-home img', { scale: 1.12 }, { scale: 1, duration: 1.3 }, HOME - 0.7)
          .fromTo(root.current, light, { ...dark, duration: 0.3, ease: 'power2.out' }, HOME - 0.7)
          .to('.story-home, .story-tint', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, HOME + 0.3)
          .to(root.current, { ...light, duration: 0.3, ease: 'power2.in' }, HOME + 0.3)

        // Szenenwechsel zum letzten Schritt: Bild, Kicker und Titel komplett tauschen
        const s = steps - 1
        tl.to('.story-swap', { autoAlpha: 0, y: -24, duration: 0.15, ease: 'power2.in' }, s + 0.3)
          .to('.route-swap', { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, s + 0.5)
          .to('.story-img', { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, s + 0.3)
          .fromTo('.route-media', { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, s + 0.4)
          .call(() => setDrawKey((k) => k + 1), null, s + 0.6)
          .set({}, {}, steps)

        // Die Zone beginnt, sobald die Sektion unten ins Bild kommt, und endet, wenn sie oben ganz verschwunden ist
        const zone = ScrollTrigger.create({
          start: () => before() + 2,
          end: () => after() - 2,
          refreshPriority: 1,
          onEnter: () => lock(0),
          onEnterBack: () => lock(steps),
        })

        return () => {
          if (locked) release()
          intent.kill()
          zone.kill()
          window.removeEventListener('scroll', hold)
          window.removeEventListener('keydown', onKey)
          document.removeEventListener('click', onAnchor, true)
        }
      })
    },
    { scope: root },
  )

  const r = t.route

  return (
    <section ref={root} id="story" data-bg="#F3F6EF" className="relative overflow-hidden text-ink motion-safe:h-svh motion-safe:min-h-[620px]">
      <div className="story-tint invisible pointer-events-none absolute inset-0 bg-forest motion-reduce:hidden" aria-hidden="true" />
      <div className="container-x relative grid h-full content-center items-center gap-6 pt-20 pb-8 short:gap-4 short:pt-[4.5rem] short:pb-5 motion-reduce:py-28 md:gap-10 md:pt-24 md:pb-12 lg:grid-cols-[1fr_1.05fr] lg:content-normal lg:gap-24">
        <figure className="relative h-[30svh] w-full short:h-[25svh] overflow-hidden rounded-[22px] bg-mint md:h-[40svh] md:rounded-[28px] lg:mx-auto lg:h-[74svh] lg:max-h-[780px] lg:max-w-[540px]">
          <img
            src={src(900)}
            sizes="(min-width: 768px) 540px, 100vw"
            width={900}
            height={1170}
            alt={t.story.imageAlt}
            decoding="async"
            className="story-img absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          <div className="story-home invisible absolute inset-0 overflow-hidden motion-reduce:hidden">
            <img
              src={imageSrc(images.storyHomemade, 900, 1125)}
              srcSet={[500, 900, 1400].map((w) => `${imageSrc(images.storyHomemade, w, w * 1.25)} ${w}w`).join(', ')}
              sizes="(min-width: 768px) 540px, 100vw"
              width={900}
              height={1125}
              alt={t.story.paragraphs[HOME].imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
          </div>
          <div className="route-media absolute inset-0 motion-reduce:hidden">
            <RouteVisual route={route} drawKey={drawKey} />
          </div>
        </figure>

        <div className="flex min-w-0 flex-col">
          <div className="grid">
            <p className="story-swap label text-gold [grid-area:1/1]">{t.story.eyebrow}</p>
            <p className="route-swap label text-gold [grid-area:1/1] motion-reduce:hidden" aria-hidden="true">
              {r.eyebrow}
            </p>
          </div>
          <div className="mt-4 grid md:mt-6">
            <Appear as="h2" className="font-display text-[clamp(2.1rem,8vw,5.2rem)] leading-[0.98] [grid-area:1/1]">
              <span className="story-swap block">{t.story.title}</span>
            </Appear>
            <h2 className="route-swap font-display text-[clamp(2.1rem,8vw,5.2rem)] leading-[0.98] [grid-area:1/1] motion-reduce:hidden">{r.title}</h2>
          </div>

          <div className="mt-6 flex gap-2 short:mt-4 md:mt-10" aria-hidden="true">
            {[...t.story.paragraphs, r].map((_, i) => (
              <span key={i} className="h-px w-12 bg-ink/15 md:w-16">
                <span className="story-fill block h-full origin-left bg-gold motion-reduce:scale-x-100" />
              </span>
            ))}
          </div>

          <div className="mt-5 grid min-w-0 short:mt-4 grid-cols-1 motion-reduce:gap-10 md:mt-10">
            {t.story.paragraphs.map((p, i) => (
              <article key={i} className="story-p motion-safe:[grid-area:1/1]">
                <p className={`text-xl text-gold ${i === HOME ? 'font-logo' : 'font-display italic'}`}>0{i + 1}</p>
                <h3 className={`${i === HOME ? 'font-logo tracking-[-0.01em]' : 'font-display'} mt-2 text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1]`}>{p.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink-soft md:mt-5 md:text-base">{p.text}</p>
              </article>
            ))}
            <article className="story-p motion-safe:[grid-area:1/1]">
              {/* ohne Animation steht der Weg einfach als vierter Abschnitt da */}
              <h3 className="font-display mb-6 hidden text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1] motion-reduce:block">{r.title}</h3>
              <RoutePanel route={route} />
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
