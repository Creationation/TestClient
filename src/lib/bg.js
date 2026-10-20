import { gsap, prefersReduced } from './gsap'

// Fixe Hintergrundebene (#bg): weicher Farbwechsel, z. B. je Sorte.
export function setBg(color) {
  gsap.to(document.getElementById('bg'), { backgroundColor: color, duration: prefersReduced() ? 0 : 1.2, ease: 'power2.out', overwrite: 'auto' })
}
