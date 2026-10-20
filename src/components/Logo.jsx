// Schriftzug wie an der Wand des Salons: „Gelati am Dom“ in Messing-Gold, darunter „WIEN“.
// Größe über font-size der Klasse steuern.
export default function Logo({ className = '', city = true }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="text-gold-metal font-logo font-medium tracking-[-0.01em] whitespace-nowrap">
        Gelati <span className="text-[0.52em]">am</span> Dom
      </span>
      {city && <span className="text-gold-metal mt-[0.18em] font-sans text-[0.17em] font-normal tracking-[0.9em] uppercase">Wien</span>}
    </span>
  )
}
