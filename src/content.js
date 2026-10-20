// ─────────────────────────────────────────────────────────────
//  Gelati am Dom – alle Texte, Bilder & Daten an einem Ort.
//  Texte bearbeiten: einfach den Wert in "de" bzw. "en" ändern.
// ─────────────────────────────────────────────────────────────

// Unsplash-Platzhalter. `crop` = optionaler Bildausschnitt (Fokuspunkt).
export const unsplash = (id, w, h, crop = '') =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75${crop}`

export const site = {
  name: 'Gelati am Dom',
  street: 'Schulerstraße 1–3',
  city: '1010 Wien',
  instagram: 'https://www.instagram.com/', // Platzhalter
  mapsEmbed: 'https://www.google.com/maps?q=Schulerstra%C3%9Fe+1-3,+1010+Wien&z=17&output=embed',
  mapsLink: 'https://www.google.com/maps/dir/?api=1&destination=Schulerstra%C3%9Fe+1-3%2C+1010+Wien',
  video: { webm: '/hero.webm', mp4: '/hero.mp4', poster: '/hero-poster.jpg', blur: '/hero-blur.jpg' },
}

// Sorten – `tone` = dunkle Hintergrundnuance, während die Sorte sichtbar ist
export const flavors = [
  {
    key: 'pistazie',
    tone: '#1D1E16',
    image: { id: '1603736029103-dafad0eb0906' },
    de: { name: 'Pistazie', origin: 'Bronte, Sizilien', text: 'Geröstete Pistazien aus Bronte, fein gemahlen. Nussig, salzig-süß, unverwechselbar.' },
    en: { name: 'Pistachio', origin: 'Bronte, Sicily', text: 'Roasted Bronte pistachios, finely ground. Nutty, sweet and a touch salty.' },
  },
  {
    key: 'stracciatella',
    tone: '#221B15',
    image: { id: '1628815870980-f416105d89b3' },
    de: { name: 'Stracciatella', origin: 'Bergamo, Lombardei', text: 'Cremiger Fior di Latte mit hauchdünn geraspelter Zartbitterschokolade.' },
    en: { name: 'Stracciatella', origin: 'Bergamo, Lombardy', text: 'Creamy fior di latte with wafer-thin shards of dark chocolate.' },
  },
  {
    key: 'erdbeere',
    tone: '#251716',
    image: { id: '1650553448920-9432f8086905' },
    de: { name: 'Erdbeere', origin: 'Wachau, Niederösterreich', text: 'Reife Erdbeeren, frisch püriert. Fruchtig, leuchtend, ohne Schnickschnack.' },
    en: { name: 'Strawberry', origin: 'Wachau, Lower Austria', text: 'Ripe strawberries, freshly puréed. Bright, fruity, nothing else needed.' },
  },
  {
    key: 'haselnuss',
    tone: '#241A12',
    image: { id: '1673551493011-2b5f771013d4' },
    de: { name: 'Haselnuss', origin: 'Langhe, Piemont', text: 'Tonda-Gentile-Haselnüsse aus dem Piemont, langsam geröstet.' },
    en: { name: 'Hazelnut', origin: 'Langhe, Piedmont', text: 'Tonda Gentile hazelnuts from Piedmont, slowly roasted.' },
  },
  {
    key: 'mango',
    tone: '#251D10',
    image: { id: '1773694725698-89c5a0b2ae1b', crop: '&crop=focalpoint&fp-x=0.55&fp-y=0.3&fp-z=1.6' },
    de: { name: 'Mango', origin: 'Alphonso-Mango', text: 'Sorbetto aus sonnengereiften Alphonso-Mangos. Vegan und herrlich frisch.' },
    en: { name: 'Mango', origin: 'Alphonso mango', text: 'Sorbetto made from sun-ripened Alphonso mangoes. Vegan and wonderfully fresh.' },
  },
  {
    key: 'schokolade',
    tone: '#1A1310',
    image: { id: '1620197544618-af5f5366abb3' },
    de: { name: 'Schokolade', origin: 'Modica, Sizilien', text: 'Dunkle Schokolade aus Modica, intensiv und samtig. Für echte Kenner.' },
    en: { name: 'Chocolate', origin: 'Modica, Sicily', text: 'Dark chocolate from Modica, intense and velvety. For true connoisseurs.' },
  },
]

// Kugel-Szene: Farben der Eiskugel & Hintergrund-Tönung je Sorte
export const scoopFlavors = [
  { key: 'pistazie', bg: '#E6E8D6', light: '#EEF1DC', mid: '#C3CC9C', dark: '#93A06A', lip: '#B5C08C', bit: '#76844A' },
  { key: 'erdbeere', bg: '#F1DEDA', light: '#FBE4E4', mid: '#ECB0B5', dark: '#CF7D87', lip: '#E29CA4', bit: '#B94A5B' },
  { key: 'schokolade', bg: '#E8DACB', light: '#B78E76', mid: '#7D5443', dark: '#523226', lip: '#6C4737', bit: '#3A2219' },
]

export const images = {
  offer: [
    { id: '1689076758310-92b693fe6b8b' },
    { id: '1534778101976-62847782c213' },
    { id: '1611292984550-6dd8def2e668' },
  ],
  story: { id: '1516550893923-42d28e5677af', crop: '&crop=focalpoint&fp-x=0.3&fp-y=0.45&fp-z=1.3' },
  // Redaktionelles Raster: span = Spalten von 12 (Desktop), ratio = Breite/Höhe
  gallery: [
    { id: '1764337008605-44abfb0f3816', span: 7, ratio: 3 / 2 },
    { id: '1657502096852-340a75dc56f7', span: 5, ratio: 4 / 5 },
    { id: '1780340123533-954cef8c7eaa', span: 4, ratio: 4 / 5 },
    { id: '1780444122216-dad92e90090f', span: 4, ratio: 4 / 5 },
    { id: '1674595605055-fa617cb4f8d7', span: 4, ratio: 4 / 5 },
    { id: '1534706936160-d5ee67737249', span: 5, ratio: 4 / 5 },
    { id: '1760308798378-d1a2e29ce54f', span: 7, ratio: 3 / 2 },
  ],
}

export const content = {
  de: {
    nav: { story: 'Geschichte', flavors: 'Sorten', visit: 'Besuch', switchLabel: 'Sprache wählen' },
    hero: {
      kicker: 'Gelateria artigianale · Wien',
      tagline: 'Italienisches Gelato, jeden Morgen frisch gerührt – eine Minute vom Stephansdom.',
      cta: 'Sorten entdecken',
      videoLabel: 'Ein Blick in unsere Gelateria in der Schulerstraße',
    },
    intro: {
      eyebrow: 'Il gelato',
      statement: 'Gelato, wie es in Italien sein soll – cremig, ehrlich, jeden Tag frisch.',
      flavors: ['Pistazie', 'Erdbeere', 'Schokolade'],
    },
    process: {
      eyebrow: 'Handwerk',
      title: 'So entsteht unser Gelato.',
      steps: [
        { title: 'Auswählen', text: 'Pistazien aus Bronte, Haselnüsse aus dem Piemont, Milch von Bauern aus dem Wienerwald.' },
        { title: 'Rühren', text: 'Jeden Morgen in kleinen Chargen, langsam und mit wenig Luft – dafür bleibt es so dicht.' },
        { title: 'Reifen', text: 'Die Basis ruht über Nacht, damit sich die Aromen voll entfalten können.' },
        { title: 'Servieren', text: 'Mit der Spatel, nie mit der Kugelzange – so wie in jeder echten Gelateria.' },
      ],
    },
    offer: {
      eyebrow: 'Mehr als Gelato',
      title: 'Ein Salon für den süßen Moment.',
      items: [
        { title: 'Gelato', text: 'Vierundzwanzig Sorten, täglich frisch – von Klassikern bis zu saisonalen Ideen.' },
        { title: 'Caffè', text: 'Espresso, Cappuccino und Affogato, zubereitet wie in einer römischen Bar.' },
        { title: 'Dolci', text: 'Cannoli, Brioche und kleine Pasticceria – perfekt zum Gelato oder Kaffee.' },
      ],
    },
    story: {
      eyebrow: 'Unsere Geschichte',
      title: 'Von Sizilien an den Stephansplatz.',
      imageAlt: 'Blick über die Dächer Wiens auf den Stephansdom',
      paragraphs: [
        {
          title: 'Ein Rezept aus Nonnas Küche',
          text: 'Alles begann in einer kleinen Küche in Catania, wo unsere Großmutter jeden Sommer Gelato für die ganze Nachbarschaft rührte – mit Geduld, Sahne und reifen Früchten vom Markt.',
        },
        {
          title: 'Ein Platz mit Aussicht',
          text: 'Heute führen wir ihr Handwerk in der Schulerstraße weiter, nur wenige Schritte vom Stephansdom entfernt – in einem Salon aus Salbeigrün, Messing und warmem Licht.',
        },
        {
          title: 'Jeden Morgen frisch',
          text: 'Wir produzieren täglich in kleinen Mengen, ohne Fertigmischungen, ohne künstliche Farbstoffe. Was abends übrig bleibt, gibt es am nächsten Tag nicht mehr.',
        },
      ],
    },
    flavors: {
      eyebrow: 'Unsere Sorten',
      title: 'Sechs Lieblinge.',
      subtitle: 'Und achtzehn weitere, die mit den Jahreszeiten wechseln.',
      hint: 'Weiter scrollen',
    },
    stats: {
      eyebrow: 'Hausgemacht',
      title: 'Kleine Mengen, große Sorgfalt.',
      items: [
        { value: 24, suffix: '', label: 'Sorten', note: 'Saisonal wechselnd' },
        { value: 100, suffix: '%', label: 'täglich frisch', note: 'Jeden Morgen gerührt' },
        { value: 1, suffix: '', label: 'Minute zum Stephansdom', note: 'Zu Fuß, versprochen' },
      ],
    },
    gallery: {
      eyebrow: 'Galerie',
      title: 'Ein Löffel Dolce Vita.',
      alt: 'Gelato – Impression',
    },
    visit: {
      eyebrow: 'Besuch uns',
      title: 'Gleich ums Eck vom Dom.',
      hoursTitle: 'Öffnungszeiten',
      hours: [
        { days: 'Montag – Freitag', time: '11:00 – 22:00' },
        { days: 'Samstag', time: '10:00 – 23:00' },
        { days: 'Sonn- & Feiertage', time: '11:00 – 22:00' },
      ],
      hoursNote: 'Platzhalter – Öffnungszeiten folgen',
      addressTitle: 'Adresse',
      directions: 'Route planen',
      instagram: 'Instagram',
      mapTitle: 'Karte: Gelati am Dom, Schulerstraße 1–3, 1010 Wien',
    },
    footer: {
      claim: 'Handgemacht in Wien. Mit Liebe aus Italien.',
      demo: 'Demo-Website · Bilder: Unsplash',
      top: 'Nach oben',
    },
  },

  en: {
    nav: { story: 'Story', flavors: 'Flavours', visit: 'Visit', switchLabel: 'Choose language' },
    hero: {
      kicker: 'Gelateria artigianale · Vienna',
      tagline: 'Italian gelato, freshly churned every morning – one minute from St. Stephen’s Cathedral.',
      cta: 'Discover flavours',
      videoLabel: 'A look inside our gelateria in Schulerstraße',
    },
    intro: {
      eyebrow: 'Il gelato',
      statement: 'Gelato the way it should be in Italy – creamy, honest, fresh every day.',
      flavors: ['Pistachio', 'Strawberry', 'Chocolate'],
    },
    process: {
      eyebrow: 'Craft',
      title: 'How our gelato is made.',
      steps: [
        { title: 'Select', text: 'Pistachios from Bronte, hazelnuts from Piedmont, milk from farmers in the Vienna Woods.' },
        { title: 'Churn', text: 'Every morning in small batches, slowly and with little air – that keeps it so dense.' },
        { title: 'Rest', text: 'The base rests overnight so the flavours can fully develop.' },
        { title: 'Serve', text: 'With a spatula, never a scoop – just like in every true gelateria.' },
      ],
    },
    offer: {
      eyebrow: 'More than gelato',
      title: 'A salon for the sweet moment.',
      items: [
        { title: 'Gelato', text: 'Twenty-four flavours, fresh every day – from classics to seasonal ideas.' },
        { title: 'Caffè', text: 'Espresso, cappuccino and affogato, made like in a Roman bar.' },
        { title: 'Dolci', text: 'Cannoli, brioche and small pasticceria – perfect with gelato or coffee.' },
      ],
    },
    story: {
      eyebrow: 'Our story',
      title: 'From Sicily to Stephansplatz.',
      imageAlt: 'View over the rooftops of Vienna towards St. Stephen’s Cathedral',
      paragraphs: [
        {
          title: 'A recipe from Nonna’s kitchen',
          text: 'It all began in a small kitchen in Catania, where our grandmother churned gelato for the whole neighbourhood every summer – with patience, cream and ripe fruit from the market.',
        },
        {
          title: 'A place with a view',
          text: 'Today we carry on her craft in Schulerstraße, just a few steps from St. Stephen’s – in a salon of sage green, brass and warm light.',
        },
        {
          title: 'Fresh every morning',
          text: 'We make small batches every day – no ready-made mixes, no artificial colours. Whatever is left in the evening won’t be served tomorrow.',
        },
      ],
    },
    flavors: {
      eyebrow: 'Our flavours',
      title: 'Six favourites.',
      subtitle: 'And eighteen more that change with the seasons.',
      hint: 'Keep scrolling',
    },
    stats: {
      eyebrow: 'Homemade',
      title: 'Small batches, great care.',
      items: [
        { value: 24, suffix: '', label: 'flavours', note: 'Changing with the seasons' },
        { value: 100, suffix: '%', label: 'fresh every day', note: 'Churned every morning' },
        { value: 1, suffix: '', label: 'minute to St. Stephen’s', note: 'On foot, promise' },
      ],
    },
    gallery: {
      eyebrow: 'Gallery',
      title: 'A spoonful of dolce vita.',
      alt: 'Gelato – impression',
    },
    visit: {
      eyebrow: 'Visit us',
      title: 'Just around the corner from the cathedral.',
      hoursTitle: 'Opening hours',
      hours: [
        { days: 'Monday – Friday', time: '11 am – 10 pm' },
        { days: 'Saturday', time: '10 am – 11 pm' },
        { days: 'Sundays & holidays', time: '11 am – 10 pm' },
      ],
      hoursNote: 'Placeholder – opening hours to follow',
      addressTitle: 'Address',
      directions: 'Get directions',
      instagram: 'Instagram',
      mapTitle: 'Map: Gelati am Dom, Schulerstraße 1–3, 1010 Vienna',
    },
    footer: {
      claim: 'Handmade in Vienna. With love from Italy.',
      demo: 'Demo website · Photos: Unsplash',
      top: 'Back to top',
    },
  },
}
