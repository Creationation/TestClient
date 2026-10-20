import { useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Logo from './Logo'

// Ruhige, feste Kopfleiste: über dem Hero transparent, danach helle Leiste.
export default function Header() {
  const { t, lang, setLang } = useLang()
  const [solid, setSolid] = useState(false)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: '#top',
      start: 'bottom top+=80',
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    })
  })

  const links = [
    ['#story', t.nav.story],
    ['#flavors', t.nav.flavors],
    ['#visit', t.nav.visit],
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700 ${
        solid ? 'border-b border-forest/10 bg-mist/95 text-ink' : 'border-b border-transparent text-mist'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label="Gelati am Dom" className="text-[1.45rem] md:text-[1.7rem]">
          <Logo city={false} />
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
