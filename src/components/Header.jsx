import { useId, useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/lang'
import Logo from './Logo'

// Runde Flaggen statt „DE / EN“, als eigenes SVG (keine Emojis: Windows zeigt Flaggen-Emojis nur als Buchstaben,
// keine Bilder von Dritten). Deutsch = Österreich, der Salon ist in Wien; Englisch = Vereinigtes Königreich.
function Flag({ code }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  if (code === 'de')
    return (
      <svg viewBox="0 0 30 30" className="h-full w-full" aria-hidden="true">
        <rect width="30" height="30" fill="#C8102E" />
        <rect y="10" width="30" height="10" fill="#fff" />
      </svg>
    )
  return (
    <svg viewBox="15 0 30 30" className="h-full w-full" aria-hidden="true">
      <clipPath id={`${id}t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}t)`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

// Feste Kopfleiste: über dem Hero transparent, danach in der Farbe der Seite darunter (index.css .site-header),
// damit sie beim Scrollen mit jeder Sektion mitwechselt. Auf dunklem Grund wird die Schrift hell; das Logo bleibt Gold.
export default function Header() {
  const { t, lang, setLang } = useLang()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

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
    ['#menu', t.nav.menu],
    ['#visit', t.nav.visit],
  ]
  const filled = solid || open

  return (
    <header data-solid={filled || undefined} className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent text-mist">
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label="Gelati am Dom" className="text-[1.45rem] md:text-[1.7rem]">
          {/* Gold wie die Schrift im Salon: helles Gold auf dunklem Grund, tieferes auf hellem */}
          {filled ? (
            <>
              <Logo city={false} tone="gold" className="logo-on-light" />
              <Logo city={false} tone="gold-light" className="logo-on-dark" />
            </>
          ) : (
            <Logo city={false} tone="gold-light" />
          )}
        </a>
        <div className="flex items-center gap-6 md:gap-12">
          <ul className="hidden items-center gap-10 lg:flex">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="label opacity-80 transition-opacity duration-300 hover:opacity-100">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2.5" role="group" aria-label={t.nav.switchLabel}>
            {[
              ['de', 'Deutsch'],
              ['en', 'English'],
            ].map(([l, name]) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={name}
                title={name}
                className={`h-7 w-7 overflow-hidden rounded-full ring-offset-2 ring-offset-transparent transition-[opacity,box-shadow,transform] duration-300 md:h-[30px] md:w-[30px] ${
                  lang === l ? 'opacity-100 ring-2 ring-gold-light' : 'opacity-55 grayscale-[35%] hover:scale-105 hover:opacity-90'
                }`}
              >
                <Flag code={l} />
              </button>
            ))}
          </div>
          {/* Mobil: Menü-Schalter */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.nav.menu}
            className="-mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <span className={`h-px w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>
      {open && (
        <ul id="mobile-nav" className="container-x flex flex-col pb-6 lg:hidden">
          {links.map(([href, label]) => (
            <li key={href} className="border-t border-current/10">
              <a href={href} onClick={() => setOpen(false)} className="font-display block py-4 text-2xl">
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
