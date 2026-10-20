import { gsap, prefersReduced } from './gsap'

// Fixe Hintergrundebene (#bg): weicher Farbwechsel, z. B. je Sorte.
let tween = null

export function setBg(color) {
  tween?.kill()
  tween = gsap.to(document.getElementById('bg'), { backgroundColor: color, duration: prefersReduced() ? 0 : 0.6, ease: 'power2.out' })
}

// Laufenden Farbwechsel abbrechen (beim Verlassen der Sektion übernimmt der Scroll-Übergang)
export function stopBg() {
  tween?.kill()
  tween = null
}
