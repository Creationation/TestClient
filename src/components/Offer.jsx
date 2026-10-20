import { images } from '../content'
import { useLang } from '../lib/lang'
import Reveal from './Reveal'
import Split from './Split'

// „Mehr als Gelato“: Gelato, Caffè, Dolci
export default function Offer() {
  const { t } = useLang()

  return (
    <section id="offer" data-bg="#F4EFE6" className="relative py-28 text-ink md:py-40">
      <div className="container-x">
        <p className="label text-pistachio">{t.offer.eyebrow}</p>
        <Split as="h2" className="font-display mt-6 max-w-[14ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
          {t.offer.title}
        </Split>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8 lg:gap-12">
          {t.offer.items.map((item, i) => (
            <article key={item.title} className={i === 1 ? 'md:mt-20' : ''}>
              <Reveal image={images.offer[i]} ratio={4 / 5} sizes="(min-width: 768px) 30vw, 100vw" alt={item.title} />
              <div className="mt-6 flex items-baseline gap-4 border-b border-ink/15 pb-4">
                <span className="label text-gold">0{i + 1}</span>
                <h3 className="font-display text-3xl italic md:text-4xl">{item.title}</h3>
              </div>
              <p className="mt-4 max-w-[24rem] text-sm leading-[1.8] text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
