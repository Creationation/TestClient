import { useRef } from 'react'
import { gsap, useGSAP, MOTION } from '../lib/gsap'

// Text, der ruhig einblendet und ein Stück nach oben gleitet.
// Beim Scrollen direkt an die Position gekoppelt und schon im unteren Bildschirmfünftel fertig –
// so flackert nichts und nichts hinkt hinterher. `immediate` = einmalig beim Laden (Hero).
export default function Appear({ as: Tag = 'p', children, className = '', delay = 0, immediate = false }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        if (immediate) {
          gsap.from(ref.current, { autoAlpha: 0, y: 24, duration: 1.4, ease: 'power3.out', delay })
          return
        }
        gsap.from(ref.current, {
          autoAlpha: 0,
          y: 28,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 98%', end: 'top 80%', scrub: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
