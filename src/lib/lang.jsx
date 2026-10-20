import { createContext, useContext, useEffect, useState } from 'react'
import { content } from '../content'

const LangContext = createContext(null)
const KEY = 'gad-lang'

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'de' || saved === 'en') return saved
    } catch {
      /* Speicher evtl. blockiert */
    }
    return 'de'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* ignorieren */
    }
  }, [lang])

  const toggle = () => setLang((l) => (l === 'de' ? 'en' : 'de'))
  return <LangContext.Provider value={{ lang, t: content[lang], toggle, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
