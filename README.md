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
Eigene Domain: in Vercel die Umgebungsvariable `SITE_URL` (z. B. `https://www.gelatiamdom.at`) setzen,
sie landet in Vorschaubild, Canonical und Google-Eintrag.

## Rechtliches (Österreich, DSGVO)

- Keine Anfragen an Dritte beim Besuch: Schriften (`src/fonts.js`), Symbolfotos (`public/images/stock`,
  neu laden mit `node scripts/stock-images.mjs`) und Karte (`scripts/build-map.mjs`) liegen lokal.
  Google Maps und Instagram nur als Links. Keine Cookies, kein Tracking → kein Cookie-Banner nötig.
- Impressum `/impressum`, Datenschutz `/datenschutz` (`src/Legal.jsx`). Angaben in `src/content.js` → `legal`.
- Schalter in `src/content.js` → `site`: `madeInHouse` (Gelato hausgemacht, Patisserie nicht),
  `registeredMark` (® nur bei eingetragener Marke), `stockPhotos` (Hinweis „Teilweise Symbolfotos“).

### Vor dem Livegang

- [ ] `legal.owner`, `legal.legalForm`, `legal.email` ausfüllen (Pflicht), `phone`, `vat`, `register` falls vorhanden
- [ ] Auftragsverarbeitungsvertrag (AVV) mit dem Kunden, da die Website über unser Vercel-Konto läuft
