import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MOTION } from '../lib/gsap'

// Text, der Zeile für Zeile hinter einer Maske hervorgleitet.
// `immediate` = sofort beim Laden (Hero), sonst beim Hineinscrollen.
export default function Split({ as: Tag = 'p', children, className = '', delay = 0, immediate = false, start = 'top 88%' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        SplitText.create(ref.current, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.5,
              ease: 'power4.out',
              stagger: 0.11,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: ref.current, start, once: true },
            }),
        })
      })
    },
    { scope: ref, dependencies: [children] },
  )

  // key = Text → bei Sprachwechsel neues Element, damit React & SplitText sich nicht in die Quere kommen
  return (
    <Tag ref={ref} key={String(children)} className={className}>
      {children}
    </Tag>
  )
}
