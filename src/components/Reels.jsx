import { images } from '../content'
import { useLang } from '../lib/lang'
import Appear from './Appear'
import VideoTile from './VideoTile'

// „Einblicke“: vier kurze Videos aus dem Salon im Hochformat
export default function Reels() {
  const { t } = useLang()

  return (
    <section id="reels" data-bg="#DFE7D8" className="relative py-28 text-ink md:py-40">
      <div className="container-x">
        <p className="label text-pistachio">{t.reels.eyebrow}</p>
        <Appear as="h2" className="font-display mt-6 max-w-[14ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.98]">
          {t.reels.title}
        </Appear>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {images.reels.map((name, i) => (
            <VideoTile key={name} name={name} label={t.reels.labels[i]} className={i % 2 ? 'lg:mt-16' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}
