import { gsap, prefersReduced } from './gsap'

// Weicher Farbwechsel eines Sektions-Hintergrunds (Sorten: dunkle Nuance je Sorte).
export function setBg(el, color) {
  if (!el || el.dataset.bg === color) return
  el.dataset.bg = color
  gsap.to(el, { backgroundColor: color, duration: prefersReduced() ? 0 : 1.2, ease: 'power2.out', overwrite: true })
}
