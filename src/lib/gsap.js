import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
// Mobile Adressleiste ein-/ausblenden soll keine Neuberechnung auslösen (kein Ruckeln)
ScrollTrigger.config({ ignoreMobileResize: true })
// Luxus-Tempo: lange, weiche Ausklänge
gsap.defaults({ ease: 'power3.out', duration: 1.4 })

export const MOTION = '(prefers-reduced-motion: no-preference)'
export const REDUCE = '(prefers-reduced-motion: reduce)'
export const prefersReduced = () => window.matchMedia(REDUCE).matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
