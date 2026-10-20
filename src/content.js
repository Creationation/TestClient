// ─────────────────────────────────────────────────────────────
//  Gelati am Dom – alle Texte, Bilder & Daten an einem Ort.
//  Texte bearbeiten: einfach den Wert in "de" bzw. "en" ändern.
// ─────────────────────────────────────────────────────────────

// Unsplash-Platzhalter. `crop` = optionaler Bildausschnitt (Fokuspunkt).
export const unsplash = (id, w, h, crop = '') =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75${crop}`

// Bildquelle: eigene Fotos aus /public ({ src }) oder Unsplash ({ id })
export const imageSrc = (img, w, h) => (img.src ? img.src : unsplash(img.id, w, h, img.crop))

export const site = {
  name: 'Gelati am Dom',
  street: 'Schulerstraße 1–3',
  city: '1010 Wien',
  instagram: 'https://www.instagram.com/gelatiamdom/',
  // hl = Sprache der Karte (sonst übernimmt Google die Browsersprache)
  mapsEmbed: (lang) => `https://www.google.com/maps?q=Schulerstra%C3%9Fe+1-3,+1010+Wien&z=17&hl=${lang}&output=embed`,
  mapsLink: (lang) => `https://www.google.com/maps/dir/?api=1&destination=Schulerstra%C3%9Fe+1-3%2C+1010+Wien&hl=${lang}`,
  video: { webm: '/hero.webm', mp4: '/hero.mp4', poster: '/hero-poster.jpg', blur: '/hero-blur.jpg' },
}

// Sorten – Name, Herkunft & Text je Sprache
export const flavors = [
  {
    key: 'pistazie',
    image: { id: '1603736029103-dafad0eb0906' },
    de: { name: 'Pistazie', origin: 'Bronte, Sizilien', text: 'Geröstete Pistazien aus Bronte, fein gemahlen. Nussig, salzig und süß zugleich, unverwechselbar.' },
    en: { name: 'Pistachio', origin: 'Bronte, Sicily', text: 'Roasted Bronte pistachios, finely ground. Nutty, sweet and a touch salty.' },
  },
  {
    key: 'stracciatella',
    image: { id: '1628815870980-f416105d89b3' },
    de: { name: 'Stracciatella', origin: 'Bergamo, Lombardei', text: 'Cremiger Fior di Latte mit hauchdünn geraspelter Zartbitterschokolade.' },
    en: { name: 'Stracciatella', origin: 'Bergamo, Lombardy', text: 'Creamy fior di latte with wafer thin shards of dark chocolate.' },
  },
  {
    key: 'erdbeere',
    image: { id: '1650553448920-9432f8086905' },
    de: { name: 'Erdbeere', origin: 'Wachau, Niederösterreich', text: 'Reife Erdbeeren, frisch püriert. Fruchtig, leuchtend, ohne Schnickschnack.' },
    en: { name: 'Strawberry', origin: 'Wachau, Lower Austria', text: 'Ripe strawberries, freshly puréed. Bright, fruity, nothing else needed.' },
  },
  {
    key: 'haselnuss',
    image: { id: '1673551493011-2b5f771013d4' },
    de: { name: 'Haselnuss', origin: 'Langhe, Piemont', text: 'Tonda Gentile Haselnüsse aus dem Piemont, langsam geröstet.' },
    en: { name: 'Hazelnut', origin: 'Langhe, Piedmont', text: 'Tonda Gentile hazelnuts from Piedmont, slowly roasted.' },
  },
  {
    key: 'mango',
    image: { id: '1773694725698-89c5a0b2ae1b', crop: '&crop=focalpoint&fp-x=0.55&fp-y=0.3&fp-z=1.6' },
    de: { name: 'Mango', origin: 'Alphonso Mango', text: 'Sorbetto aus sonnengereiften Alphonso Mangos. Vegan und herrlich frisch.' },
    en: { name: 'Mango', origin: 'Alphonso mango', text: 'Sorbetto made from sun ripened Alphonso mangoes. Vegan and wonderfully fresh.' },
  },
  {
    key: 'schokolade',
    image: { id: '1620197544618-af5f5366abb3' },
    de: { name: 'Schokolade', origin: 'Modica, Sizilien', text: 'Dunkle Schokolade aus Modica, intensiv und samtig. Für echte Kenner.' },
    en: { name: 'Chocolate', origin: 'Modica, Sicily', text: 'Dark chocolate from Modica, intense and velvety. For true connoisseurs.' },
  },
]

// Kugel-Szene: drei Kugeln wie die Skulptur im Salon – unten Erdbeere, Mitte Vanille, oben Pistazie
export const scoopFlavors = [
  { key: 'erdbeere', light: '#FCE6E9', mid: '#F2C1C9', dark: '#D9909F', crease: '#C77A8B', bit: '#CF5069', seed: '#F6D98B' },
  { key: 'vanille', light: '#FFFDF7', mid: '#F5EDDA', dark: '#DCCBA6', crease: '#C9B48A', bit: '#3A2A20', seed: '#3A2A20', chunks: false },
  { key: 'pistazie', light: '#F2F8EC', mid: '#D3E4C9', dark: '#A7C19C', crease: '#8FAA85', bit: '#7D9A5F', seed: '#5E7A45' },
]

export const images = {
  // „Mehr als Gelato“: Videos aus dem Salon (vom Kunden), Kaffee als Foto
  offer: [
    { video: 'gelato-vitrine' },
    { id: '1534778101976-62847782c213' },
    { video: 'patisserie' },
  ],
  // „Einblicke“: kurze Videos aus dem Salon
  reels: ['gelato-sorten', 'patisserie-2', 'torten', 'salon'],
  // Fotos aus dem Salon (vom Kunden)
  story: { src: '/images/salon-wall.jpg' },
  // Redaktionelles Raster: span = Spalten von 12 (Desktop), ratio = Breite/Höhe
  gallery: [
    { id: '1764337008605-44abfb0f3816', span: 7, ratio: 3 / 2 },
    { src: '/images/salon-tables.jpg', span: 5, ratio: 4 / 5 },
    { id: '1780340123533-954cef8c7eaa', span: 4, ratio: 4 / 5 },
    { id: '1780444122216-dad92e90090f', span: 4, ratio: 4 / 5 },
    { id: '1674595605055-fa617cb4f8d7', span: 4, ratio: 4 / 5 },
    { src: '/images/vitrine.jpg', span: 5, ratio: 4 / 5 },
    { id: '1760308798378-d1a2e29ce54f', span: 7, ratio: 3 / 2 },
  ],
}

export const content = {
  de: {
    nav: { story: 'Geschichte', flavors: 'Sorten', menu: 'Speisekarte', visit: 'Besuch', switchLabel: 'Sprache wählen' },
    menu: { eyebrow: 'Speisekarte', title: 'Unsere Karte.', allergensTitle: 'Allergene' },
    reels: { eyebrow: 'Einblicke', title: 'Frisch aus der Vitrine.', labels: ['Unsere Sorten', 'Patisserie', 'Torten & Cheesecakes', 'Der Salon'] },
    hero: {
      kicker: 'Artisan Gelato · Caffè & Desserts',
      tagline: 'Hausgemachtes Gelato, feiner Kaffee und Desserts, eine Minute vom Stephansdom.',
      status: 'Bald geöffnet',
      cta: 'Sorten entdecken',
      videoLabel: 'Ein Blick in unsere Gelateria in der Schulerstraße',
    },
    intro: {
      eyebrow: 'Il gelato',
      statement: 'Gelato, wie es in Italien sein soll: cremig, ehrlich, jeden Tag frisch.',
      flavors: ['Erdbeere', 'Vanille', 'Pistazie'],
    },
    process: {
      eyebrow: 'Handwerk',
      title: 'So entsteht unser Gelato.',
      steps: [
        { title: 'Auswählen', text: 'Pistazien aus Bronte, Haselnüsse aus dem Piemont, Milch von Bauern aus dem Wienerwald.' },
        { title: 'Rühren', text: 'Jeden Morgen in kleinen Chargen, langsam und mit wenig Luft. So bleibt es schön dicht.' },
        { title: 'Reifen', text: 'Die Basis ruht über Nacht, damit sich die Aromen voll entfalten können.' },
        { title: 'Servieren', text: 'Mit der Spatel, nie mit der Kugelzange, so wie in jeder echten Gelateria.' },
      ],
    },
    offer: {
      eyebrow: 'Mehr als Gelato',
      title: 'Ein Salon für den süßen Moment.',
      items: [
        { title: 'Gelato', text: 'Täglich frisch aus unserer Vitrine, dazu Eisbecher, Milchshakes und Wiener Eiskaffee.' },
        { title: 'Kaffee & Matcha', text: 'Espresso, Wiener Melange und Cappuccino, dazu Iced Matcha und Iced Coffee Latte mit Milch nach Wahl.' },
        { title: 'Süßes', text: 'Feine Patisserie aus der Vitrine, Waffeln, Palatschinken und Açaí Bowls.' },
      ],
      cta: 'Zur Speisekarte',
    },
    story: {
      eyebrow: 'Unsere Geschichte',
      title: 'Von Sizilien an den Stephansplatz.',
      imageAlt: 'Der Salon von Gelati am Dom mit der großen Gelato Skulptur',
      paragraphs: [
        {
          title: 'Ein Rezept aus Nonnas Küche',
          text: 'Alles begann in einer kleinen Küche in Catania, wo unsere Großmutter jeden Sommer Gelato für die ganze Nachbarschaft rührte, mit Geduld, Sahne und reifen Früchten vom Markt.',
        },
        {
          title: 'Ein Platz mit Aussicht',
          text: 'Heute führen wir ihr Handwerk in der Schulerstraße weiter, nur wenige Schritte vom Stephansdom entfernt, in einem Salon aus Salbeigrün, Messing und warmem Licht.',
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
      alt: 'Impressionen aus dem Salon',
    },
    visit: {
      eyebrow: 'Besuch uns',
      title: 'Gleich ums Eck vom Dom.',
      hoursTitle: 'Öffnungszeiten',
      hours: [
        { days: 'Montag bis Freitag', time: '11 bis 22 Uhr' },
        { days: 'Samstag', time: '10 bis 23 Uhr' },
        { days: 'Sonntag und Feiertag', time: '11 bis 22 Uhr' },
      ],
      hoursNote: 'Platzhalter, die genauen Öffnungszeiten folgen',
      addressTitle: 'Adresse',
      directions: 'Route planen',
      instagram: 'Instagram',
      mapTitle: 'Karte: Gelati am Dom, Schulerstraße 1–3, 1010 Wien',
    },
    footer: {
      claim: 'Gelato, Kaffee und Genuss, handgemacht in Wien.',
      demo: 'Demowebsite · Teilweise Bilder von Unsplash',
      top: 'Nach oben',
    },
  },

  en: {
    nav: { story: 'Story', flavors: 'Flavours', menu: 'Menu', visit: 'Visit', switchLabel: 'Choose language' },
    menu: { eyebrow: 'Menu', title: 'Our menu.', allergensTitle: 'Allergens' },
    reels: { eyebrow: 'Inside', title: 'Fresh from the display.', labels: ['Our flavours', 'Patisserie', 'Cakes & cheesecakes', 'The salon'] },
    hero: {
      kicker: 'Artisan Gelato · Caffè & Desserts',
      tagline: 'Handmade gelato, fine coffee and desserts, one minute from St. Stephen’s Cathedral.',
      status: 'Opening soon',
      cta: 'Discover flavours',
      videoLabel: 'A look inside our gelateria in Schulerstraße',
    },
    intro: {
      eyebrow: 'Il gelato',
      statement: 'Gelato the way it should be in Italy: creamy, honest, fresh every day.',
      flavors: ['Strawberry', 'Vanilla', 'Pistachio'],
    },
    process: {
      eyebrow: 'Craft',
      title: 'How our gelato is made.',
      steps: [
        { title: 'Select', text: 'Pistachios from Bronte, hazelnuts from Piedmont, milk from farmers in the Vienna Woods.' },
        { title: 'Churn', text: 'Every morning in small batches, slowly and with little air. That keeps it so dense.' },
        { title: 'Rest', text: 'The base rests overnight so the flavours can fully develop.' },
        { title: 'Serve', text: 'With a spatula, never a scoop, just like in every true gelateria.' },
      ],
    },
    offer: {
      eyebrow: 'More than gelato',
      title: 'A salon for the sweet moment.',
      items: [
        { title: 'Gelato', text: 'Fresh every day from our display, plus sundaes, milkshakes and Viennese iced coffee.' },
        { title: 'Coffee & Matcha', text: 'Espresso, Wiener Melange and cappuccino, plus iced matcha and iced coffee latte with milk of your choice.' },
        { title: 'Sweets', text: 'Fine patisserie from the display, waffles, Palatschinken and açaí bowls.' },
      ],
      cta: 'See the menu',
    },
    story: {
      eyebrow: 'Our story',
      title: 'From Sicily to Stephansplatz.',
      imageAlt: 'The Gelati am Dom salon with its large gelato sculpture',
      paragraphs: [
        {
          title: 'A recipe from Nonna’s kitchen',
          text: 'It all began in a small kitchen in Catania, where our grandmother churned gelato for the whole neighbourhood every summer, with patience, cream and ripe fruit from the market.',
        },
        {
          title: 'A place with a view',
          text: 'Today we carry on her craft in Schulerstraße, just a few steps from St. Stephen’s, in a salon of sage green, brass and warm light.',
        },
        {
          title: 'Fresh every morning',
          text: 'We make small batches every day. No ready made mixes, no artificial colours. Whatever is left in the evening won’t be served tomorrow.',
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
      alt: 'Impressions from the salon',
    },
    visit: {
      eyebrow: 'Visit us',
      title: 'Just around the corner from the cathedral.',
      hoursTitle: 'Opening hours',
      hours: [
        { days: 'Monday to Friday', time: '11 am to 10 pm' },
        { days: 'Saturday', time: '10 am to 11 pm' },
        { days: 'Sundays and holidays', time: '11 am to 10 pm' },
      ],
      hoursNote: 'Placeholder, exact opening hours to follow',
      addressTitle: 'Address',
      directions: 'Get directions',
      instagram: 'Instagram',
      mapTitle: 'Map: Gelati am Dom, Schulerstraße 1–3, 1010 Vienna',
    },
    footer: {
      claim: 'Gelato, coffee and indulgence, handmade in Vienna.',
      demo: 'Demo website · Some photos from Unsplash',
      top: 'Back to top',
    },
  },
}

// ─────────────────────────────────────────────────────────────
//  Speisekarte, übernommen von der gedruckten Karte im Salon.
//  name/desc: Text oder { de, en }. price: "12,50" oder prices: [[Größe, Preis], …]
//  allergens: Codes laut österreichischer Allergenverordnung (Legende unten)
// ─────────────────────────────────────────────────────────────
const t2 = (de, en) => ({ de, en })
const lemonade = (de, en, descDe, descEn) => ({
  name: t2(de, en),
  desc: t2(descDe, descEn),
  prices: [
    ['0,25 l', '4,50'],
    ['0,5 l', '7,50'],
  ],
})

export const menu = {
  tagline: t2('Gelato ♥ Kaffee ♥ Genuss', 'Gelato ♥ Coffee ♥ Indulgence'),
  categories: [
    {
      key: 'eis',
      title: t2('Eisbecher', 'Sundaes'),
      tagline: t2('Fruchtig ♥ Cremig ♥ Verführerisch', 'Fruity ♥ Creamy ♥ Irresistible'),
      groups: [
        {
          items: [
            { name: t2('Erdbeerbecher', 'Strawberry sundae'), allergens: 'GHE', price: '12,50', desc: t2('2 Kugeln Eis · frische Erdbeeren · Schlagobers · Erdbeersauce', '2 scoops · fresh strawberries · whipped cream · strawberry sauce') },
            { name: 'Bananen Split', allergens: 'HEG', price: '12,50', desc: t2('2 Kugeln Bananeneis · eine ganze Banane · Schlagobers · Schokosauce', '2 scoops banana gelato · a whole banana · whipped cream · chocolate sauce') },
            { name: t2('Schwarzwälder Becher', 'Black Forest sundae'), allergens: 'HEG', price: '13,00', desc: t2('2 Kugeln Vanilleeis · Sauerkirschen · Likör · Schlagobers · Schokostreusel', '2 scoops vanilla · sour cherries · liqueur · whipped cream · chocolate sprinkles') },
            { name: 'Maronita', allergens: 'GHE', price: '13,00', desc: t2('2 Kugeln Maronieis · Maronipüree · Schlagobers · Nussnougatcreme', '2 scoops chestnut gelato · chestnut purée · whipped cream · nut nougat cream') },
            { name: t2('Amarena Becher', 'Amarena sundae'), allergens: 'GHE', price: '12,50', desc: t2('2 Kugeln Amarenaeis · Amarenakirschen · Schlagobers', '2 scoops amarena gelato · amarena cherries · whipped cream') },
            { name: t2('Pistazien Becher', 'Pistachio sundae'), allergens: 'GHE', price: '13,00', desc: t2('2 Kugeln Pistazieneis · Schlagobers · Pistaziencreme', '2 scoops pistachio gelato · whipped cream · pistachio cream') },
            { name: t2('Pralinen Becher', 'Praline sundae'), allergens: 'EGH', price: '13,50', desc: t2('2 Kugeln Haselnusseis · Pralinen · Schlagobers · Nussnougatcreme', '2 scoops hazelnut gelato · pralines · whipped cream · nut nougat cream') },
            { name: t2('Lotus Becher', 'Lotus sundae'), allergens: 'GHE', price: '13,50', desc: t2('2 Kugeln Lotuseis · Lotuskekse · Schlagobers · Karamellcreme', '2 scoops Lotus gelato · Lotus biscuits · whipped cream · caramel cream') },
            { name: 'Heiße Liebe', allergens: 'HEG', price: '12,50', desc: t2('2 Kugeln Vanilleeis · heiße Himbeeren · Schlagobers · Erdbeersauce', '2 scoops vanilla · hot raspberries · whipped cream · strawberry sauce') },
            { name: t2('Früchte Becher', 'Fruit sundae'), allergens: 'GHE', price: '15,50', desc: t2('3 Kugeln Eis · frische Früchte · Schlagobers · Fruchtcreme', '3 scoops · fresh fruit · whipped cream · fruit cream') },
            { name: t2('Maroniportion mit Schlagobers', 'Chestnut portion with whipped cream'), allergens: 'GHE', price: '7,50' },
          ],
        },
        {
          title: t2('Eisspezialitäten', 'Ice cream specialities'),
          items: [
            { name: t2('Wiener Eiskaffee', 'Viennese iced coffee'), price: '9,50', desc: t2('2 Kugeln Vanilleeis · Kaffee · Schlagobers · Kaffeepulver', '2 scoops vanilla · coffee · whipped cream · coffee powder') },
            { name: t2('Milchschokolade', 'Iced milk chocolate'), allergens: 'G', price: '9,50', desc: t2('2 Kugeln Schokoladeneis · Milch · Schlagobers · Schokosauce', '2 scoops chocolate gelato · milk · whipped cream · chocolate sauce') },
            { name: 'Milchshake', allergens: 'G', price: '8,50', desc: t2('Erdbeere · Banane · Schokolade · Vanille', 'Strawberry · banana · chocolate · vanilla') },
          ],
        },
      ],
      note: t2('Gemischtes Eis: ab 2 Kugeln, mit oder ohne Schlagobers, mit Sauce nach Wahl.', 'Mixed gelato: from 2 scoops, with or without whipped cream, sauce of your choice.'),
    },
    {
      key: 'kaffee',
      title: t2('Kaffee & Tee', 'Coffee & Tea'),
      tagline: t2('Aromatisch ♥ Genussvoll ♥ Entspannend', 'Aromatic ♥ Indulgent ♥ Relaxing'),
      groups: [
        {
          title: t2('Kaffee', 'Coffee'),
          items: [
            { name: 'Espresso', price: '3,50' },
            { name: t2('Doppelter Espresso', 'Double espresso'), price: '6,00' },
            { name: t2('Verlängerter', 'Verlängerter (long espresso)'), allergens: 'G', price: '4,50' },
            { name: 'Wiener Melange', allergens: 'G', price: '4,50' },
            { name: 'Affogato', allergens: 'G', price: '5,50' },
            { name: t2('Cappuccino mit Schaum', 'Cappuccino with foam'), allergens: 'G', price: '5,50' },
            { name: t2('Cappuccino mit Schlagobers', 'Cappuccino with whipped cream'), allergens: 'G', price: '5,90' },
            { name: t2('Heiße Schokolade in der Kanne mit Schlagobers', 'Hot chocolate in a pot with whipped cream'), allergens: 'G', price: '7,50' },
            { name: 'Latte Macchiato', allergens: 'G', price: '6,50' },
          ],
        },
        {
          title: t2('Tee in der Kanne', 'Tea by the pot'),
          items: [
            { name: t2('Kamillentee', 'Chamomile'), price: '6,50' },
            { name: t2('Minztee', 'Mint'), price: '6,50' },
            { name: t2('Früchtetee', 'Fruit tea'), price: '6,50' },
            { name: t2('Grüner Tee', 'Green tea'), price: '6,50' },
            { name: t2('Schwarzer Tee', 'Black tea'), price: '6,50' },
          ],
        },
      ],
    },
    {
      key: 'matcha',
      title: t2('Matcha & Iced Latte', 'Matcha & Iced Latte'),
      tagline: t2('Fruchtig ♥ Cremig ♥ Erfrischend', 'Fruity ♥ Creamy ♥ Refreshing'),
      groups: [
        {
          title: 'Iced Matcha',
          items: [
            { name: 'Iced Matcha Mango', price: '8,50', desc: t2('Mango · Matcha · Milch nach Wahl', 'Mango · matcha · milk of your choice') },
            { name: 'Iced Matcha Maracuja', price: '8,50', desc: t2('Maracuja · Matcha · Milch nach Wahl', 'Passion fruit · matcha · milk of your choice') },
            { name: t2('Iced Matcha Erdbeer', 'Iced Matcha Strawberry'), price: '8,50', desc: t2('Erdbeere · Matcha · Milch nach Wahl', 'Strawberry · matcha · milk of your choice') },
            { name: t2('Iced Matcha Blaubeer', 'Iced Matcha Blueberry'), price: '8,50', desc: t2('Blaubeere · Matcha · Milch nach Wahl', 'Blueberry · matcha · milk of your choice') },
          ],
        },
        {
          title: 'Iced Coffee Latte',
          items: [
            { name: 'Iced Coffee Latte Classic', price: '8,50', desc: t2('Espresso · Milch nach Wahl', 'Espresso · milk of your choice') },
            { name: 'Iced Coffee Latte Caramel', price: '8,50', desc: t2('Espresso · Milch nach Wahl · Karamell', 'Espresso · milk of your choice · caramel') },
            { name: t2('Iced Coffee Latte Haselnuss', 'Iced Coffee Latte Hazelnut'), price: '8,50', desc: t2('Espresso · Milch nach Wahl · Haselnuss', 'Espresso · milk of your choice · hazelnut') },
            { name: t2('Iced Coffee Latte Vanille', 'Iced Coffee Latte Vanilla'), price: '8,50', desc: t2('Espresso · Milch nach Wahl · Vanille', 'Espresso · milk of your choice · vanilla') },
          ],
        },
      ],
      note: t2('Milch nach Wahl: Vollmilch, Hafermilch, Kokosmilch oder Mandelmilch. To go oder zum Hiertrinken zum gleichen Preis.', 'Milk of your choice: whole, oat, coconut or almond milk. To go or to stay at the same price.'),
    },
    {
      key: 'waffeln',
      title: t2('Waffeln & Palatschinken', 'Waffles & Palatschinken'),
      tagline: t2('Frisch ♥ Knusprig ♥ Ein Klassiker', 'Fresh ♥ Crispy ♥ A classic'),
      groups: [
        {
          title: t2('Waffeln', 'Waffles'),
          items: [
            { name: t2('Waffel mit Puderzucker und Zimt', 'Waffle with icing sugar and cinnamon'), allergens: 'ACG', price: '6,50' },
            { name: t2('Waffel mit Eis und Banane', 'Waffle with gelato and banana'), allergens: 'ACG', price: '9,50', desc: t2('1 Kugel Eis · Bananen · Nussnougatcreme', '1 scoop gelato · banana · nut nougat cream') },
            { name: t2('Waffel mit Vanilleeis und Früchten', 'Waffle with vanilla and fruit'), allergens: 'ACG', price: '10,50', desc: t2('1 Kugel Vanilleeis · Erdbeeren · Kiwi · Nussnougatcreme', '1 scoop vanilla · strawberries · kiwi · nut nougat cream') },
          ],
        },
        {
          title: t2('Palatschinken', 'Palatschinken (Austrian crêpes)'),
          items: [
            { name: t2('Palatschinken mit Vanilleeis und Banane', 'Palatschinken with vanilla and banana'), allergens: 'ACG', price: '10,50', desc: t2('2 Stück · 1 Kugel Vanilleeis · Nussnougatcreme · Bananen', '2 pieces · 1 scoop vanilla · nut nougat cream · banana') },
            { name: 'Palatschinken Lotus', allergens: 'ACG', price: '11,50', desc: t2('2 Stück · Lotuscreme · Erdbeeren · 1 Kugel Vanilleeis', '2 pieces · Lotus cream · strawberries · 1 scoop vanilla') },
            { name: t2('Palatschinken mit Puderzucker und Zimt', 'Palatschinken with icing sugar and cinnamon'), allergens: 'ACG', price: '8,50', desc: t2('2 Stück', '2 pieces') },
          ],
        },
      ],
    },
    {
      key: 'acai',
      title: t2('Açaí Bowls', 'Açaí Bowls'),
      tagline: t2('Fruchtig ♥ Gesund ♥ Lecker', 'Fruity ♥ Healthy ♥ Delicious'),
      groups: [
        {
          items: [
            { name: 'Açaí Bowl Nutella', price: '13,50', desc: t2('Açaí · Granola · Chiasamen · frische Früchte · Nutella', 'Açaí · granola · chia seeds · fresh fruit · Nutella') },
            { name: t2('Açaí Bowl Karamell', 'Açaí Bowl Caramel'), price: '13,50', desc: t2('Açaí · Granola · Chiasamen · frische Früchte · Karamell', 'Açaí · granola · chia seeds · fresh fruit · caramel') },
            { name: 'Açaí Bowl Lotus', price: '13,50', desc: t2('Açaí · Granola · Chiasamen · frische Früchte · Lotus', 'Açaí · granola · chia seeds · fresh fruit · Lotus') },
            { name: t2('Açaí Bowl Früchte', 'Açaí Bowl Fruit'), price: '13,50', desc: t2('Açaí · Granola · Chiasamen · frische Früchte', 'Açaí · granola · chia seeds · fresh fruit') },
          ],
        },
      ],
      note: t2('Auch to go im Becher erhältlich. Toppings nach Wahl: frische Früchte, Nutella, Karamell, Lotus.', 'Also available to go in a cup. Toppings of your choice: fresh fruit, Nutella, caramel, Lotus.'),
    },
    {
      key: 'getraenke',
      title: t2('Getränke', 'Drinks'),
      tagline: t2('Erfrischend ♥ Fruchtig ♥ Hausgemacht', 'Refreshing ♥ Fruity ♥ Homemade'),
      groups: [
        {
          title: t2('Hausgemachte Limonaden', 'Homemade lemonades'),
          items: [
            lemonade('Himbeere', 'Raspberry', 'Frische Himbeeren · Eiswürfel · still oder prickelnd', 'Fresh raspberries · ice · still or sparkling'),
            lemonade('Mango', 'Mango', 'Frische Mango · Eiswürfel · still oder prickelnd', 'Fresh mango · ice · still or sparkling'),
            lemonade('Maracuja', 'Passion fruit', 'Frische Maracuja · Eiswürfel · still oder prickelnd', 'Fresh passion fruit · ice · still or sparkling'),
            lemonade('Wassermelone', 'Watermelon', 'Frische Wassermelone · Eiswürfel · still oder prickelnd', 'Fresh watermelon · ice · still or sparkling'),
            lemonade('Holunder', 'Elderflower', 'Eiswürfel · Limette · still oder prickelnd', 'Ice · lime · still or sparkling'),
            lemonade('Erdbeere', 'Strawberry', 'Frische Erdbeeren · Eiswürfel · still oder prickelnd', 'Fresh strawberries · ice · still or sparkling'),
            lemonade('Apfelsaft', 'Apple juice', 'Still oder prickelnd', 'Still or sparkling'),
            lemonade('Johannisbeere', 'Blackcurrant', 'Still oder prickelnd', 'Still or sparkling'),
            {
              name: t2('Soda oder Wasser mit Zitrone', 'Soda or water with lemon'),
              desc: t2('Frische Zitronen · Eiswürfel', 'Fresh lemons · ice'),
              prices: [
                ['0,25 l', '4,50'],
                ['0,5 l', '6,50'],
              ],
            },
          ],
        },
        {
          title: t2('In der Glasflasche', 'Bottled'),
          items: [
            { name: 'Cola 0,33 l', price: '4,50' },
            { name: 'Fanta 0,33 l', price: '4,50' },
            { name: t2('Eistee 0,33 l', 'Iced tea 0.33 l'), price: '4,50' },
            { name: 'Acqua Panna 0,25 l', price: '3,90' },
            { name: 'San Pellegrino 0,25 l', price: '3,90' },
            { name: 'Red Bull 0,25 l', price: '5,50' },
            { name: t2('Orangensaft 0,25 l', 'Orange juice 0.25 l'), price: '4,50' },
          ],
        },
        {
          title: t2('Bier', 'Beer'),
          items: [
            { name: t2('Hirter vom Fass 0,3 l', 'Hirter on draught 0.3 l'), allergens: 'A', price: '5,00' },
            { name: t2('Hirter vom Fass 0,5 l', 'Hirter on draught 0.5 l'), allergens: 'A', price: '6,50' },
            { name: t2('Schneider Weizen 0,3 l', 'Schneider wheat beer 0.3 l'), allergens: 'A', price: '5,30' },
            { name: t2('Schneider Weizen alkoholfrei 0,5 l', 'Schneider wheat beer alcohol free 0.5 l'), allergens: 'O', price: '6,50' },
            { name: 'Radler 0,3 l', allergens: 'A', price: '4,70' },
            { name: t2('Alkoholfrei (0,0 %) 0,3 l', 'Alcohol free (0.0 %) 0.3 l'), price: '4,00' },
          ],
        },
        {
          title: t2('Wein & Spritzer', 'Wine & spritzer'),
          items: [
            { name: t2('Hugo alkoholfrei', 'Alcohol free Hugo'), price: '7,50' },
            { name: 'Spritzer', price: '5,90' },
            { name: 'Grüner Veltliner ⅛', price: '4,90' },
            { name: 'Grüner Veltliner ¼', price: '7,90' },
            { name: 'Zweigelt ⅛', allergens: 'O', price: '4,90' },
            { name: 'Zweigelt ¼', allergens: 'O', price: '7,90' },
          ],
        },
      ],
    },
  ],
  allergens: {
    de: 'Allergene: A Gluten · C Ei · E Erdnüsse · G Milch · H Schalenfrüchte · O Sulfite. Trotz sorgfältiger Herstellung können Spuren anderer Stoffe enthalten sein, die in unserer Küche verwendet werden.',
    en: 'Allergens: A gluten · C egg · E peanuts · G milk · H tree nuts · O sulphites. Despite careful preparation, traces of other ingredients used in our kitchen may be present.',
  },
}
