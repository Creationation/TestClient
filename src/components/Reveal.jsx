import { useRef } from 'react'
import { unsplash } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'

// Bild, das sich beim Hineinscrollen von unten aufdeckt und dabei sanft herauszoomt.
export default function Reveal({ image, ratio = 0.8, sizes = '100vw', alt = '', className = '', imgClassName = '', fill = false }) {
  const ref = useRef(null)
  const { id, crop = '' } = image
  const src = (w) => unsplash(id, w, Math.round(w / ratio), crop)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const img = ref.current.querySelector('img')
        gsap.fromTo(
          ref.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power3.inOut', scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } },
        )
        gsap.fromTo(
          img,
          { scale: 1.18 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[20px] bg-espresso/10 md:rounded-[28px] ${className}`} style={fill ? undefined : { aspectRatio: ratio }}>
      <img
        src={src(900)}
        srcSet={`${src(500)} 500w, ${src(900)} 900w, ${src(1400)} 1400w`}
        sizes={sizes}
        width={900}
        height={Math.round(900 / ratio)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  )
}
