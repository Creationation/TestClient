import { useRef, useState } from 'react'
import { images } from '../content'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import Reveal from './Reveal'
import { RoutePanel, RouteVisual, useRoute } from './Route'

// Drei ruhige Blöcke statt eines Karussells, damit sich niemand verliert:
// zuerst das Gelato, darunter der Salon in einem Text, danach gleich der Weg zu uns.
// Die Seite scrollt ganz normal, nichts bleibt stehen.
export default function Story() {
  const { t } = useLang()
  const s = t.story

  return (
    <>
      {/* Gelato: dunkler Grund, helle Schrift (Tailwind liest die Farben aus Variablen) */}
      <section
        id="story"
        data-bg="#2F3B32"
        style={{ '--color-ink': '#F3F6EF', '--color-ink-soft': '#C4D0BC' }}
        className="relative py-24 text-ink md:py-36"
      >
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
          <Reveal
            image={images.story}
            ratio={4 / 5}
            sizes="(min-width: 1024px) 540px, 100vw"
            alt={s.imageAlt}
            className="w-full max-lg:aspect-[4/3]! lg:mx-auto lg:max-w-[540px]"
          />
          <div>
            <p className="label text-gold">{s.eyebrow}</p>
            <Appear as="h2" className="font-logo mt-6 text-[clamp(2.4rem,8vw,5.2rem)] leading-[1] tracking-[-0.01em]">
              {s.title}
            </Appear>
            <Appear className="mt-6 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink-soft md:mt-10 md:text-base">{s.text}</Appear>
          </div>
        </div>
      </section>

      <Salon shop={s.shop} />
      <Way />
    </>
  )
}

// Der Salon in einem Text: Leitsatz, Absatz und drei kurze Eckdaten
function Salon({ shop }) {
  return (
    <section id="salon" data-bg="#F3F6EF" className="relative py-24 text-ink md:py-36">
      <div className="container-x">
        <p className="label text-gold">{shop.eyebrow}</p>
        <Appear as="h2" className="font-display mt-6 max-w-[24ch] text-[clamp(2rem,5.6vw,4rem)] leading-[1.08]">
          {shop.lead}
        </Appear>
        <div className="mt-12 grid gap-12 md:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Appear className="max-w-[36rem] text-[0.95rem] leading-[1.9] text-ink-soft md:text-base">{shop.text}</Appear>
          <dl className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0">
            {shop.facts.map((f) => (
              <div key={f.title} className="border-t border-forest/15 pt-5 lg:flex lg:items-baseline lg:gap-8 lg:py-6">
                <dt className="font-display text-xl italic text-gold lg:w-56 lg:shrink-0">{f.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft lg:mt-0">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// Der Weg zu uns: Karte und Startpunkt-Auswahl nebeneinander
function Way() {
  const { t } = useLang()
  const r = t.route
  const route = useRoute()
  const map = useRef(null)
  // erhöht sich, sobald die Karte ins Bild kommt → der Weg zeichnet sich vor den Augen des Besuchers
  const [drawKey, setDrawKey] = useState(0)

  useGSAP(() => {
    ScrollTrigger.create({ trigger: map.current, start: 'top 75%', once: true, onEnter: () => setDrawKey((k) => k + 1) })
  })

  return (
    <section id="route" data-bg="#C4D0BC" className="relative py-24 text-ink md:py-36">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
        <figure
          ref={map}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#EEF2E9] md:rounded-[28px] lg:aspect-auto lg:h-[70svh] lg:max-h-[680px] lg:min-h-[440px]"
        >
          <RouteVisual route={route} drawKey={drawKey} />
        </figure>
        <div className="min-w-0">
          <p className="label text-gold">{r.eyebrow}</p>
          <Appear as="h2" className="font-logo mt-6 mb-10 text-[clamp(2.2rem,7vw,4.4rem)] leading-[1.04] tracking-[-0.01em] md:mb-14">
            {r.title}
          </Appear>
          <RoutePanel route={route} />
        </div>
      </div>
    </section>
  )
}
