import { useEffect, useRef } from 'react'
import { prefersReduced } from '../lib/gsap'

// Kurzes Hochformat-Video aus dem Salon (/public/videos/<name>.mp4|webm|jpg).
// Lädt erst, wenn es ins Bild kommt, und läuft nur, solange es sichtbar ist – spart Akku und Daten.
export default function VideoTile({ name, label, className = '', ratio = '9 / 16' }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video || prefersReduced()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <figure className={`relative overflow-hidden rounded-[20px] bg-sage md:rounded-[28px] ${className}`} style={{ aspectRatio: ratio }}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={`/videos/${name}.jpg`}
        aria-label={label}
      >
        <source src={`/videos/${name}.webm`} type="video/webm" />
        <source src={`/videos/${name}.mp4`} type="video/mp4" />
      </video>
      {label && (
        <figcaption className="label absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/70 to-transparent px-5 pt-12 pb-5 text-mist">{label}</figcaption>
      )}
    </figure>
  )
}
