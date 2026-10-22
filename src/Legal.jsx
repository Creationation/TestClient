import { legal, site } from './content'
import Logo from './components/Logo'

const YEAR = new Date().getFullYear()

// Pflichtangaben, die noch fehlen, sind deutlich markiert und stehen in der Konsole
const need = (value, label) => {
  if (value) return value
  console.warn(`Impressum/Datenschutz: „${label}“ fehlt noch (src/content.js → legal)`)
  return <span className="rounded bg-gold-light/40 px-1.5 text-ink">Angabe folgt</span>
}

const H2 = ({ children }) => <h2 className="font-display mt-12 text-[1.7rem] leading-tight text-ink md:text-3xl">{children}</h2>
const P = ({ children }) => <p className="mt-4 leading-[1.8] text-ink-soft">{children}</p>
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="border-b border-gold/50 text-ink transition-colors hover:border-ink">
    {children}
  </a>
)

function Address() {
  return (
    <>
      {need(legal.owner, 'Firma / Inhaber')}
      {legal.legalForm && `, ${legal.legalForm}`}
      <br />
      {site.street}, {site.city}, Österreich
    </>
  )
}

function Contact() {
  return (
    <>
      E-Mail:{' '}
      {legal.email ? <a href={`mailto:${legal.email}`} className="border-b border-gold/50 text-ink">{legal.email}</a> : need('', 'E-Mail')}
      {legal.phone && (
        <>
          <br />
          Telefon: <a href={`tel:${legal.phone.replace(/[^+\d]/g, '')}`} className="border-b border-gold/50 text-ink">{legal.phone}</a>
        </>
      )}
    </>
  )
}

function Impressum() {
  return (
    <>
      <h1 className="font-display text-[clamp(2.6rem,8vw,4.4rem)] leading-none">Impressum</h1>
      <P>Informationen nach § 5 E-Commerce-Gesetz, § 14 Unternehmensgesetzbuch und Offenlegung nach § 25 Mediengesetz.</P>

      <H2>Medieninhaber und Diensteanbieter</H2>
      <P>
        <Address />
      </P>
      <P>
        <Contact />
      </P>

      <H2>Unternehmensangaben</H2>
      <dl className="mt-4 grid gap-x-8 gap-y-3 leading-[1.7] text-ink-soft sm:grid-cols-[auto_1fr]">
        <dt className="text-ink">Rechtsform</dt>
        <dd>{need(legal.legalForm, 'Rechtsform')}</dd>
        <dt className="text-ink">Unternehmensgegenstand</dt>
        <dd>{legal.business}</dd>
        {legal.vat && (
          <>
            <dt className="text-ink">UID-Nummer</dt>
            <dd>{legal.vat}</dd>
          </>
        )}
        {legal.register && (
          <>
            <dt className="text-ink">Firmenbuch</dt>
            <dd>{legal.register}</dd>
          </>
        )}
        <dt className="text-ink">Kammer</dt>
        <dd>{legal.chamber}</dd>
        <dt className="text-ink">Gewerbebehörde</dt>
        <dd>{legal.authority}</dd>
        <dt className="text-ink">Berufsrecht</dt>
        <dd>
          Gewerbeordnung, abrufbar unter <A href="https://www.ris.bka.gv.at">www.ris.bka.gv.at</A>
        </dd>
      </dl>

      <H2>Grundlegende Richtung</H2>
      <P>Information über das Angebot von {site.name}: Gelato, Kaffee, Desserts und Getränke im Salon in der {site.street}.</P>

      <H2>Bildnachweis</H2>
      <P>
        Fotos und Videos aus dem Salon: {site.name}.
        {site.stockPhotos && (
          <>
            {' '}
            Einzelne Bilder sind Symbolfotos von <A href="https://unsplash.com">Unsplash</A> (Unsplash-Lizenz) und zeigen nicht unbedingt unsere Produkte.
          </>
        )}
      </P>
      <P>
        Kartendaten © <A href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</A>, verfügbar unter der Open Database License (ODbL).
      </P>

      <H2>Haftung für Inhalte und Links</H2>
      <P>
        Wir erstellen die Inhalte dieser Website mit Sorgfalt, können für Richtigkeit, Vollständigkeit und Aktualität (etwa von Öffnungszeiten, Preisen und Sorten) aber keine Gewähr übernehmen. Für
        Inhalte verlinkter Websites sind ausschließlich deren Betreiber verantwortlich. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar; bei Bekanntwerden entfernen wir solche
        Links umgehend.
      </P>
    </>
  )
}

function Datenschutz() {
  return (
    <>
      <h1 className="font-display text-[clamp(2.6rem,8vw,4.4rem)] leading-none">Datenschutzerklärung</h1>
      <P>
        Der Schutz deiner Daten ist uns wichtig. Auf dieser Website verwenden wir keine Cookies, keine Analyse- oder Trackingdienste, keine Werbenetzwerke und keine eingebetteten Social-Media-Inhalte.
        Hier erfährst du, welche Daten trotzdem verarbeitet werden und welche Rechte du hast.
      </P>

      <H2>Verantwortlicher</H2>
      <P>
        <Address />
      </P>
      <P>
        <Contact />
      </P>

      <H2>Hosting und Server-Logfiles</H2>
      <P>
        Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf verarbeitet der Server technisch notwendige Daten: IP-Adresse, Datum und Uhrzeit,
        aufgerufene Seite, Browser und Betriebssystem sowie die zuvor besuchte Seite. Das ist nötig, um die Website auszuliefern und sie vor Missbrauch und Angriffen zu schützen.
      </P>
      <P>
        Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und funktionierenden Website (Art. 6 Abs. 1 lit. f DSGVO). Die Daten werden nicht mit anderen Daten zusammengeführt und nach
        kurzer Zeit automatisch gelöscht. Für die Übermittlung in die USA stützt sich Vercel auf das EU-US Data Privacy Framework (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO) sowie auf
        Standardvertragsklauseln (Art. 46 DSGVO). Mehr dazu: <A href="https://vercel.com/legal/privacy-policy">vercel.com/legal/privacy-policy</A>.
      </P>

      <H2>Schriften, Bilder, Videos und Karte</H2>
      <P>
        Schriften, Fotos, Videos und die Karte liegen auf unserem eigenen Server. Beim Besuch werden deshalb keine Verbindungen zu Google Fonts, Bilddiensten oder Kartenanbietern aufgebaut. Die
        Kartendaten stammen von OpenStreetMap und sind direkt in die Website eingebaut.
      </P>

      <H2>Standort („Mein Standort“)</H2>
      <P>
        Nur wenn du in „Der Weg zu uns“ die Option „Mein Standort“ wählst, fragt dein Browser um deine Erlaubnis, den Standort zu verwenden. Erlaubst du es, wird deine Position ausschließlich in deinem
        Browser verwendet, um Entfernung und Gehzeit zu uns anzuzeigen. Sie wird nicht an uns übertragen und nicht gespeichert. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die
        du jederzeit in den Einstellungen deines Browsers widerrufen kannst.
      </P>
      <P>
        Tippst du danach auf „Route starten“, öffnet sich Google Maps mit deiner Position als Startpunkt. Ab dann gilt die Datenschutzerklärung von Google (Google Ireland Limited, Gordon House, Barrow
        Street, Dublin 4, Irland): <A href="https://policies.google.com/privacy">policies.google.com/privacy</A>.
      </P>

      <H2>Links zu Google Maps und Instagram</H2>
      <P>
        Die Links „Route starten“, „Route ab meinem Standort“, „Route planen“ und „Instagram“ führen zu Google Maps bzw. Instagram (Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland). Daten werden erst übertragen, wenn
        du einen dieser Links anklickst; dann gelten die Datenschutzerklärungen dieser Anbieter: <A href="https://policies.google.com/privacy">Google</A>,{' '}
        <A href="https://privacycenter.instagram.com/policy">Instagram</A>.
      </P>

      <H2>Speicherung der Spracheinstellung</H2>
      <P>
        Deine Sprachwahl (Deutsch oder Englisch) speichern wir im lokalen Speicher deines Browsers (Eintrag „gad-lang“), damit die Website beim nächsten Besuch in deiner Sprache erscheint. Der Eintrag
        enthält keine personenbezogenen Daten, bleibt auf deinem Gerät und wird nicht an uns übertragen. Er ist für die von dir gewünschte Funktion unbedingt erforderlich (§ 165 Abs. 3 TKG 2021). Du
        kannst ihn jederzeit in deinem Browser löschen.
      </P>

      <H2>Kontakt per E-Mail oder Telefon</H2>
      <P>
        Wenn du uns kontaktierst, verarbeiten wir deine Angaben, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b und f DSGVO). Wir löschen sie, sobald sie dafür nicht mehr nötig sind, sofern keine
        gesetzlichen Aufbewahrungspflichten bestehen.
      </P>

      <H2>Deine Rechte</H2>
      <P>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO) sowie das Recht, eine Einwilligung jederzeit zu
        widerrufen. Schreib uns dazu einfach an die oben genannte E-Mail-Adresse.
      </P>
      <P>
        Wenn du meinst, dass die Verarbeitung deiner Daten gegen das Datenschutzrecht verstößt, kannst du dich bei der Aufsichtsbehörde beschweren: Österreichische Datenschutzbehörde, Barichgasse 40 bis
        42, 1030 Wien, <A href="https://www.dsb.gv.at">www.dsb.gv.at</A>.
      </P>

      <P>Stand: {legal.updated}</P>
    </>
  )
}

export default function Legal({ page }) {
  return (
    <div className="min-h-svh bg-mist text-ink">
      <header className="border-b border-forest/10">
        <div className="container-x flex items-center justify-between py-6">
          <a href="/" aria-label="Gelati am Dom, zur Startseite" className="text-[1.7rem]">
            <Logo />
          </a>
          <a href="/" className="label text-ink-soft transition-colors hover:text-ink">
            ← Startseite
          </a>
        </div>
      </header>
      <main className="container-x max-w-[52rem] py-16 text-[0.95rem] md:py-24 md:text-base">{page === 'impressum' ? <Impressum /> : <Datenschutz />}</main>
      <footer className="border-t border-forest/10">
        <div className="container-x flex flex-wrap gap-x-6 gap-y-2 py-8 text-xs text-ink-soft">
          <a href="/impressum.html" className="hover:text-ink">
            Impressum
          </a>
          <a href="/datenschutz.html" className="hover:text-ink">
            Datenschutz
          </a>
          <span>© {YEAR} {site.name}</span>
        </div>
      </footer>
    </div>
  )
}
