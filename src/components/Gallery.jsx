import { images } from '../content'
import { useLang } from '../lib/lang'
import Reveal from './Reveal'
import Split from './Split'

// Strenges 12-Spalten-Raster (Desktop), 2 Spalten auf dem Handy
const SPAN = { 4: 'md:col-span-4', 5: 'md:col-span-5', 7: 'md:col-span-7' }

export default function Gallery() {
  const { t } = useLang()

  return (
    <section id="gallery" className="relative bg-cream pb-28 text-ink md:pb-44">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 border-t border-ink/15 pt-16 md:flex-row md:items-end md:pt-24">
          <div>
            <p className="label text-pistachio">{t.gallery.eyebrow}</p>
            <Split as="h2" className="font-display mt-6 max-w-[12ch] text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98]">
              {t.gallery.title}
            </Split>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 items-end gap-3 sm:gap-5 md:mt-20 md:grid-cols-12 md:gap-8">
          {images.gallery.map((img, i) => (
            <Reveal
              key={img.id}
              image={img}
              ratio={img.ratio}
              sizes={img.span === 7 ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 40vw, 50vw'}
              alt={t.gallery.alt}
              className={`${img.span === 7 || i === 5 ? 'col-span-2' : 'col-span-1'} ${SPAN[img.span]} ${i === 1 || i === 5 ? 'md:mb-24' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
