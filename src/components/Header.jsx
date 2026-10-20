import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/lang'

export default function Header() {
  const { t, lang, setLang } = useLang()
  const ref = useRef(null)
  const [solid, setSolid] = useState(false)

  useGSAP(() => {
    // Über dem Hero transparent, danach cremefarbene Leiste
    ScrollTrigger.create({
      trigger: '#top',
      start: 'bottom top+=80',
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    })
    // Beim Runterscrollen ausblenden, beim Hochscrollen wieder zeigen
    // Nur animieren, wenn sich der Zustand ändert – nicht bei jedem Scroll-Frame
    let hidden = false
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 400
        if (hide === hidden) return
        hidden = hide
        gsap.to(ref.current, { yPercent: hide ? -100 : 0, duration: 0.6, ease: 'power3.out', overwrite: true })
      },
    })
  })

  const links = [
    ['#story', t.nav.story],
    ['#flavors', t.nav.flavors],
    ['#visit', t.nav.visit],
  ]

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700 ${
        solid ? 'border-b border-ink/10 bg-cream/95 text-ink' : 'border-b border-transparent text-cream'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="font-display text-[1.6rem] leading-none italic md:text-[1.75rem]">
          Gelati am Dom
        </a>
        <div className="flex items-center gap-8 md:gap-12">
          <ul className="hidden items-center gap-10 md:flex">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="label opacity-80 transition-opacity duration-300 hover:opacity-100">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="label flex items-center gap-2" role="group" aria-label={t.nav.switchLabel}>
            {['de', 'en'].map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className="opacity-30">/</span>}
                <button
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`py-2 transition-opacity duration-300 ${lang === l ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
