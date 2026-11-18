// Das Logo des Kunden (vom Inhaber geliefert, freigestellt). Größe über font-size der Umgebung (em).
//  tone="light": helle Version für dunkle Flächen (Hero, Fußzeile)
//  tone="dark":  Originalfarben (Olivgrün und Gold) für helle Flächen
//  tone="gold" / "gold-light": in Gold wie die Schrift im Salon (nur der Schriftzug, für die Kopfzeile):
//    das helle Gold der Herzchen auf dunklem Grund, ein tieferes Gold auf hellem Grund
//  city={false}: nur der Schriftzug, ohne „WIEN“ und Devise (kleine Kopfzeile)
const SUFFIX = { light: '-light', dark: '', gold: '-gold', 'gold-light': '-gold-light' }
export default function Logo({ className = '', city = true, tone = 'light' }) {
  const file = `/logo${city ? '' : '-word'}${SUFFIX[tone] ?? ''}.png`
  return (
    <span className={`inline-block max-w-full leading-none ${className}`} style={{ width: city ? '5.8em' : '6.2em' }}>
      <img
        src={file}
        alt=""
        width={city ? 1400 : 1000}
        height={city ? 427 : 216}
        draggable="false"
        className="block h-auto w-full"
      />
    </span>
  )
}
