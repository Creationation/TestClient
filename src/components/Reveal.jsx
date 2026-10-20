import { useRef, useState } from 'react'
import { imageSrc } from '../content'
import { gsap, useGSAP, MOTION } from '../lib/gsap'

// Bild mit abgerundeten Ecken: blendet nach dem Laden sanft ein (kein Aufblitzen)
// und zoomt beim Scrollen leicht heraus.
export default function Reveal({ image, ratio = 0.8, sizes = '100vw', alt = '', className = '', fill = false }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const src = (w) => imageSrc(image, w, Math.round(w / ratio))

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          ref.current.querySelector('img'),
          { scale: 1.1 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[20px] bg-sage md:rounded-[28px] ${className}`} style={fill ? undefined : { aspectRatio: ratio }}>
      <img
        src={src(900)}
        srcSet={image.src ? undefined : `${src(500)} 500w, ${src(900)} 900w, ${src(1400)} 1400w`}
        sizes={sizes}
        width={900}
        height={Math.round(900 / ratio)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-transform ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
