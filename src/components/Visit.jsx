import { site } from '../content'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import Sconce from './Sconce'

// Lage des Salons auf public/images/osm-visit.jpg (Ausgabe von scripts/osm-map.py)
const PIN = { left: '67.85%', top: '50.68%' }
const DOM = { left: '24%', top: '55%' }

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
            {t.visit.hoursNote && <p className="mt-4 text-xs text-ink-soft">{t.visit.hoursNote}</p>}

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

        {/* Echte OpenStreetMap-Karte (lokal gespeichertes Bild, keine Anfrage an Dritte).
            Ein Tipp darauf öffnet Google Maps mit der Route vom eigenen Standort zum Salon. */}
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <a
            href={site.mapsLink(lang)}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.route.mapsHint}: ${site.street}, ${site.city}`}
            className="group relative block aspect-[5/4] w-full overflow-hidden rounded-[20px] bg-mint shadow-[0_18px_50px_-30px_rgba(38,48,40,0.6)] md:rounded-[26px]"
          >
            <img
              src="/images/osm-visit.jpg"
              alt=""
              width={1280}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ transformOrigin: `${PIN.left} ${PIN.top}` }}
            />
            {/* Stephansdom: einzige Beschriftung neben dem Salon */}
            <span
              aria-hidden="true"
              className="font-display absolute -translate-x-1/2 -translate-y-1/2 text-[clamp(1rem,2.6vw,1.35rem)] whitespace-nowrap text-ink italic [text-shadow:0_0_4px_#fff,0_0_8px_#fff]"
              style={DOM}
            >
              ✝ {t.route.map.dom}
            </span>
            {/* Salon */}
            <span className="absolute" style={PIN} aria-hidden="true">
              <span className="route-pulse absolute -top-[18px] -left-[18px] h-9 w-9 rounded-full bg-gold" />
              <span className="absolute -top-[9px] -left-[9px] h-[18px] w-[18px] rounded-full border-[3px] border-gold-light bg-forest shadow-md" />
              <span className="absolute bottom-[16px] left-1/2 flex -translate-x-1/2 flex-col items-center rounded-[14px] bg-forest px-4 py-2 text-center whitespace-nowrap shadow-lg">
                <span className="font-logo text-[15px] leading-tight text-gold-light italic">Gelati am Dom</span>
                <span className="mt-0.5 text-[11px] leading-tight text-mist/85">{site.street}</span>
              </span>
            </span>
            {/* Hinweis: Route öffnen */}
            <span className="label absolute inset-x-3 bottom-3 flex items-center justify-center gap-3 rounded-full bg-forest/90 px-5 py-3.5 text-mist backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold md:inset-x-auto md:right-4 md:bottom-4">
              {t.route.mapsHint}
              <span aria-hidden="true">↗</span>
            </span>
          </a>
          {/* Pflichtnachweis der Kartendaten (ODbL) */}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[0.65rem] text-ink-soft/80 transition-colors hover:text-ink"
          >
            © OpenStreetMap {lang === 'de' ? 'Mitwirkende' : 'contributors'}
          </a>
        </div>
      </div>
    </section>
  )
}
