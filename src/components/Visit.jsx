import { site } from '../content'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import { RouteVisual } from './Route'
import Sconce from './Sconce'

const FROM_DOM = { active: 'dom', loc: { state: 'idle' } }

export default function Visit() {
  const { t, lang } = useLang()

  return (
    <section id="visit" data-bg="#C4D0BC" className="relative overflow-x-clip py-28 text-ink md:py-44">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <div className="flex items-start justify-between gap-6">
            <p className="label text-gold">{t.visit.eyebrow}</p>
            <Sconce className="h-20 w-16 md:h-24 md:w-20 lg:hidden" />
          </div>
          <Appear as="h2" className="font-display mt-6 max-w-[13ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
            {t.visit.title}
          </Appear>

          <div className="molding mt-14 bg-paper/40 px-7 py-9 md:mt-20 md:px-10 md:py-12">
            <h3 className="label text-ink-soft">{t.visit.hoursTitle}</h3>
            <dl className="mt-6 border-t border-forest/15">
              {t.visit.hours.map((h) => (
                <div key={h.days} className="flex items-baseline justify-between gap-6 border-b border-forest/15 py-4">
                  <dt className="text-sm text-ink">{h.days}</dt>
                  <dd className="font-display text-xl lining-nums tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-ink-soft">{t.visit.hoursNote}</p>

            <h3 className="label mt-12 text-ink-soft">{t.visit.addressTitle}</h3>
            <address className="font-display mt-4 text-3xl leading-snug not-italic md:text-4xl">
              {site.street}
              <br />
              {site.city}
            </address>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <a href={site.mapsLink(lang)} target="_blank" rel="noreferrer" className="btn border-forest bg-forest text-mist hover:border-gold hover:bg-gold">
              {t.visit.directions}
              <span aria-hidden="true">→</span>
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="label border-b border-forest/30 pb-1 transition-colors duration-300 hover:border-forest">
              {t.visit.instagram} ↗
            </a>
          </div>
        </div>

        {/* Eigene Karte (lokal, ohne Google): Weg vom Haupttor des Doms zum Salon */}
        <div className="relative h-[350px] overflow-hidden rounded-[20px] bg-mint md:rounded-[26px] md:h-[450px] lg:sticky lg:top-28 lg:self-start">
          <RouteVisual route={FROM_DOM} drawKey={0} />
        </div>
      </div>
    </section>
  )
}
