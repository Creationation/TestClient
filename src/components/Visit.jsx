import { site } from '../content'
import { useLang } from '../lib/lang'
import Split from './Split'

export default function Visit() {
  const { t } = useLang()

  return (
    <section id="visit" className="relative bg-espresso py-28 text-cream md:py-44">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <p className="label text-gold">{t.visit.eyebrow}</p>
          <Split as="h2" className="font-display mt-6 max-w-[13ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
            {t.visit.title}
          </Split>

          <div className="mt-14 md:mt-20">
            <h3 className="label text-cream/55">{t.visit.hoursTitle}</h3>
            <dl className="mt-6 border-t border-cream/15">
              {t.visit.hours.map((h) => (
                <div key={h.days} className="flex items-baseline justify-between gap-6 border-b border-cream/15 py-4">
                  <dt className="text-sm text-cream/80">{h.days}</dt>
                  <dd className="font-display text-xl lining-nums tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-cream/45">{t.visit.hoursNote}</p>

            <h3 className="label mt-12 text-cream/55">{t.visit.addressTitle}</h3>
            <address className="font-display mt-4 text-3xl leading-snug not-italic md:text-4xl">
              {site.street}
              <br />
              {site.city}
            </address>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <a href={site.mapsLink} target="_blank" rel="noreferrer" className="btn border-gold bg-gold text-espresso hover:border-cream hover:bg-cream">
              {t.visit.directions}
              <span aria-hidden="true">→</span>
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="label border-b border-cream/30 pb-1 transition-colors duration-300 hover:border-cream">
              {t.visit.instagram} ↗
            </a>
          </div>
        </div>

        {/* Karte: rechteckig, vollständig sichtbar, warm entsättigt */}
        <div className="relative h-[350px] overflow-hidden rounded-[4px] bg-cream/5 md:h-[450px] lg:sticky lg:top-28 lg:self-start">
          <iframe
            title={t.visit.mapTitle}
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.28)_contrast(0.95)_brightness(0.97)]"
          />
        </div>
      </div>
    </section>
  )
}
