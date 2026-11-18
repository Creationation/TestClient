import { useRef, useState } from 'react'
import { site } from '../content'
import { gsap, ScrollTrigger, useGSAP, MOTION, scroller } from '../lib/gsap'
import { useLang } from '../lib/lang'
import { pageBg } from '../lib/pageBg'
import Appear from './Appear'
import Reveal from './Reveal'
import { RoutePanel, RouteVisual, useRoute } from './Route'

// Gelato: samtgrüner Grund, helle Schrift. Der Weg: Salbeigrund, dunkle Schrift.
const DARK = { '--color-ink': '#F3F6EF', '--color-ink-soft': '#C4D0BC' }
const LIGHT = { '--color-ink': '#263028', '--color-ink-soft': '#5D695F' }

// Sektion bleibt stehen, zwei Schritte: zuerst das Gelato (Pistazienbild), dann wechselt alles (Bild, Titel, Text)
// zu „Der Weg zu uns“ vom Stephansdom. Jede Scrollbewegung führt genau einen Schritt weiter, auch bei schnellem
// Wischen; danach scrollt die Seite wieder ganz normal (die Sektion wird nur angehalten, nicht geführt).
// Unter lg bekommt das Bild nur den Platz, der neben dem Text bleibt: nichts rutscht unter den Header.
// Die Sektion ist so hoch wie der Bildschirm mit eingeklappter Browserleiste (lvh), der Inhalt so hoch wie mit
// sichtbarer Leiste (svh): der Hintergrund reicht immer bis unten, und der Inhalt wird nie verdeckt.
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
        const titles = gsap.utils.toArray('.story-t')
        const steps = panels.length - 1
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 })
        gsap.set(titles.slice(1), { autoAlpha: 0, y: 24 })
        gsap.set('.route-swap', { autoAlpha: 0, y: 24 })
        gsap.set('.route-media, .route-tint', { autoAlpha: 0 })
        gsap.set('.story-tint', { autoAlpha: 1 })
        gsap.set(root.current, DARK)
        gsap.set(fills[0], { scaleX: 1 })

        // Schritt-Steuerung: Wer in die Sektion scrollt (auch mit viel Schwung), wird auf dem ersten Schritt
        // angehalten (von unten: auf dem letzten). Der Schwung verpufft, danach führt jede Geste genau einen Schritt
        // weiter. Nach dem letzten Schritt (bzw. vor dem ersten) scrollt die Seite wieder ganz normal.
        let index = 0
        let locked = false
        let moving = false
        let quietUntil = 0
        // Ein Laptop-Touchpad schwingt nach: es schickt noch lange kleine Rad-Ereignisse. Die Ruhezeit nach einem
        // Schritt verlängert sich damit nur bis zu einer festen Grenze, und eine neue Geste (das Rad wird plötzlich
        // wieder stärker statt schwächer) beendet sie sofort. Sonst blieb die Sektion am Touchpad einfach stehen.
        let quietMax = 0
        let quietMin = 0
        let lastMag = 0
        const quiet = (ms) => {
          const now = performance.now()
          quietUntil = now + ms
          quietMin = now + 250
          quietMax = now + 1100
        }
        let acc = 0
        let spent = false
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
        const lock = (k) => {
          // schon gesperrt (z. B. genau am Anfang: GSAP meldet beim ersten Pixel erneut „Eintritt“)
          if (locked || performance.now() < navUntil) return
          locked = true
          index = k
          acc = 0
          // der Schwung, der uns hierher gebracht hat, zählt nicht als Geste
          quiet(500)
          lenis()?.stop()
          intent.enable()
          scrollTo(pos(k), true)
        }
        const release = () => {
          locked = false
          intent.disable()
          lenis()?.start()
        }
        const step = (dir, speed = 0) => {
          const k = index + dir
          if (k < 0 || k > steps) {
            // raus aus der Sektion: die Seite läuft so weit, wie die Geste Schwung hat, wie beim normalen Scrollen
            release()
            const vh = window.innerHeight
            const dist = gsap.utils.clamp(80, vh * 1.5, speed ? speed * 0.3 : vh * 0.4)
            const y = window.scrollY + dir * dist
            const l = lenis()
            return l
              ? l.scrollTo(y, {
                  duration: 0.5 + (dist / vh) * 0.5,
                  easing: (t) => 1 - Math.pow(1 - t, 3),
                })
              : scrollTo(y)
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
          // ein Finger auf dem Bildschirm = höchstens ein Schritt, auch wenn er lange liegen bleibt
          onPress: () => (spent = false),
          onChangeY: (self) => {
            const now = performance.now()
            if (spent) return
            const mag = Math.abs(self.event?.deltaY ?? self.deltaY)
            const fresh = self.event?.type === 'wheel' && mag > lastMag * 1.6 + 2 && now > quietMin
            lastMag = mag
            if ((moving || now < quietUntil) && !fresh) {
              quietUntil = Math.min(Math.max(quietUntil, now + 180), quietMax)
              acc = 0
              return
            }
            acc += self.deltaY
            if (Math.abs(acc) < 24) return
            const dir = acc < 0 ? 1 : -1
            acc = 0
            quiet(400)
            spent = self.event?.type?.startsWith('touch')
            step(dir, Math.abs(self.velocityY))
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
          const dir = {
            ArrowDown: 1,
            PageDown: 1,
            ArrowUp: -1,
            PageUp: -1,
            ' ': field ? 0 : e.shiftKey ? -1 : 1,
          }[e.key]
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

        // Schritt k liegt genau bei Zeit k; der Wechsel passiert dazwischen
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
            onEnter: () => lock(0),
            onEnterBack: () => lock(steps),
            // Seitenfarbe (und damit die Kopfleiste) wechselt mit dem Grund: Samtgrün beim Gelato, Salbei beim Weg
            onUpdate: (self) => {
              const p = gsap.utils.clamp(0, 1, (self.progress * steps - 0.3) / 0.3)
              root.current.dataset.bgNow = gsap.utils.interpolate('#2F3B32', '#C4D0BC', p)
              pageBg.render()
            },
          },
        })
        tl.fromTo('.story-img', { scale: 1.15 }, { scale: 1, duration: 0.5 }, 0)
          // erst ausblenden, dann einblenden: Texte überlagern sich nie
          .to(panels[0], { autoAlpha: 0, y: -24, duration: 0.15, ease: 'power2.in' }, 0.3)
          .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.5)
          .fromTo(fills[1], { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0.3)
          .to(titles[0], { autoAlpha: 0, y: -24, duration: 0.15, ease: 'power2.in' }, 0.3)
          .to(titles[1], { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.5)
          // Szenenwechsel: Bild, Kicker, Grund und Schriftfarben komplett tauschen
          .to('.story-swap', { autoAlpha: 0, y: -24, duration: 0.15, ease: 'power2.in' }, 0.3)
          .to('.route-swap', { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.5)
          .to('.story-img', { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 0.3)
          .to('.story-tint', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.3)
          .to('.route-tint', { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.3)
          .to(root.current, { ...LIGHT, duration: 0.3, ease: 'power2.inOut' }, 0.3)
          .fromTo('.route-media', { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, 0.4)
          .call(() => setDrawKey((k) => k + 1), null, 0.6)
          .set({}, {}, steps)

        return () => {
          if (locked) release()
          intent.kill()
          window.removeEventListener('scroll', hold)
          window.removeEventListener('keydown', onKey)
          document.removeEventListener('click', onAnchor, true)
        }
      })
    },
    { scope: root },
  )

  const s = t.story
  const r = t.route

  return (
    <section ref={root} id="story" data-bg="#2F3B32" data-bg-end="#C4D0BC" className="relative overflow-hidden text-ink motion-safe:h-lvh motion-safe:min-h-[620px]">
      <div className="story-tint invisible pointer-events-none absolute inset-0 bg-forest motion-reduce:hidden" aria-hidden="true" />
      <div className="route-tint invisible pointer-events-none absolute inset-0 bg-sage motion-reduce:hidden" aria-hidden="true" />
      <div className="container-x relative flex h-full flex-col gap-6 motion-safe:h-svh motion-safe:min-h-[620px] pt-20 pb-8 short:gap-4 short:pb-5 motion-reduce:py-28 md:gap-10 md:pt-24 md:pb-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-24">
        <figure className="relative h-[30svh] w-full short:h-[25svh] overflow-hidden rounded-[22px] bg-mint md:h-[40svh] md:rounded-[28px] lg:mx-auto lg:h-[74svh] lg:max-h-[780px] lg:max-w-[540px] max-lg:motion-safe:h-auto! max-lg:motion-safe:min-h-[140px] max-lg:motion-safe:flex-1">
          {/* echtes Video aus dem Salon: das Gelato kommt frisch aus der Eismaschine */}
          <video
            className="story-img absolute inset-0 h-full w-full object-cover will-change-transform"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/making-of.jpg"
            aria-label={s.imageAlt}
          >
            <source src="/videos/making-of.webm" type="video/webm" />
            <source src="/videos/making-of.mp4" type="video/mp4" />
          </video>
          <div className="route-media absolute inset-0 motion-reduce:hidden">
            <RouteVisual route={route} drawKey={drawKey} />
          </div>
        </figure>

        <div className="flex min-w-0 shrink-0 flex-col">
          <div className="grid">
            <p className="story-swap label text-gold [grid-area:1/1]">{s.eyebrow}</p>
            <p className="route-swap label text-gold [grid-area:1/1] motion-reduce:hidden" aria-hidden="true">
              {r.eyebrow}
            </p>
          </div>
          <div className="mt-4 grid md:mt-6">
            <Appear as="h2" className="font-logo text-[clamp(2.1rem,8vw,5.2rem)] leading-[0.98] tracking-[-0.01em] [grid-area:1/1]">
              <span className="story-t block">{s.title}</span>
            </Appear>
            <h2 className="story-t font-logo text-[clamp(1.9rem,7vw,4.4rem)] leading-[1.04] tracking-[-0.01em] [grid-area:1/1] motion-reduce:hidden">{r.title}</h2>
          </div>

          <div className="mt-6 flex gap-2 short:mt-4 md:mt-10" aria-hidden="true">
            {[0, 1].map((i) => (
              <span key={i} className="h-px w-12 bg-ink/15 md:w-16">
                <span className="story-fill block h-full origin-left bg-gold motion-reduce:scale-x-100" />
              </span>
            ))}
          </div>

          <div className="mt-5 grid min-w-0 short:mt-4 grid-cols-1 motion-reduce:gap-10 md:mt-10">
            <article className="story-p motion-safe:[grid-area:1/1]">
              <p className="font-logo text-xl text-gold">01</p>
              <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink-soft md:mt-5 md:text-base">{s.text}</p>
            </article>
            <article className="story-p motion-safe:[grid-area:1/1]">
              {/* ohne Animation steht der Weg einfach als zweiter Abschnitt da */}
              <h3 className="font-display mb-6 hidden text-[clamp(1.7rem,5vw,2.6rem)] leading-[1.1] motion-reduce:block">{r.title}</h3>
              <RoutePanel route={route} />
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

// Der Salon in einem Text: Leitsatz und Absatz. Direkt danach folgt „Mehr als Gelato“.
export function Salon() {
  const { t } = useLang()
  const shop = t.story.shop
  return (
    <section id="salon" data-bg="#F3F6EF" className="relative pt-24 text-ink md:pt-36">
      {/* Text links wie gehabt, daneben ein echtes Bild des Salons im Rundbogen (wie ein Fenster), mit Messing-Details */}
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
        <div>
          <p className="label text-gold">{shop.eyebrow}</p>
          <Appear as="h2" className="font-display mt-6 max-w-[24ch] text-[clamp(2rem,5.6vw,4rem)] leading-[1.08]">
            {shop.lead}
          </Appear>
          <span className="mt-10 block h-px w-24 bg-gradient-to-r from-gold to-transparent md:mt-12" aria-hidden="true" />
          <Appear className="mt-8 max-w-[44rem] text-[0.95rem] leading-[1.9] text-ink-soft md:mt-10 md:text-base">{shop.text}</Appear>
        </div>
        <figure className="relative mx-auto w-full max-w-[420px]">
          {/* goldener Bogen, leicht versetzt hinter dem Bild */}
          <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-[28px] border border-gold/50" />
          <Reveal
            image={{ src: '/images/salon-wall.jpg' }}
            ratio={3 / 4}
            sizes="(min-width: 1024px) 420px, 90vw"
            alt={shop.imageAlt}
            className="rounded-t-[999px]! rounded-b-[28px]!"
          />
          <figcaption className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[0.7rem] tracking-[0.16em] whitespace-nowrap text-gold-light uppercase shadow-[0_12px_30px_-14px_rgba(36,45,38,0.8)]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-light" aria-hidden="true" />
            {site.street} · {site.city}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
