# Gelati am Dom – Demo-Website

Premium-Onepager für die Gelateria **Gelati am Dom**, Schulerstraße 1–3, 1010 Wien.
Vite + React + Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis

```bash
npm install      # einmalig
npm run dev      # Entwicklung → http://localhost:5173
npm run build    # Produktion → dist/
npm run preview  # Produktions-Build lokal ansehen
```

## Wo ändere ich was?

| Was | Datei |
| --- | --- |
| Alle Texte (DE/EN), Öffnungszeiten, Adresse, Bilder, Sorten | `src/content.js` |
| Hero-Video (9:16) | `public/hero.mp4`, `public/hero.webm`, Poster `public/hero-poster.jpg` |
| Farben & Schriften | `src/index.css` (`@theme`) |

## Deployment

`main` auf GitHub (`Creationation/TestClient`) → Vercel-Projekt `testclient`.
