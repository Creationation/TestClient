// Messing-Wandleuchte wie im Salon (zwei Scheiben) mit warmem Lichthof – rein dekorativ.
// Position/Größe über className (z. B. "absolute top-0 right-6 h-24 w-20").
export default function Sconce({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="relative h-full w-full">
        <div className="absolute -inset-[80%] rounded-full bg-[radial-gradient(circle,rgba(255,214,150,0.5)_0%,rgba(255,214,150,0.16)_35%,transparent_68%)]" />
        <svg viewBox="0 0 100 120" className="relative h-full w-full">
          <defs>
            <linearGradient id="sc-brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#EAD3A0" />
              <stop offset="0.5" stopColor="#B8944F" />
              <stop offset="1" stopColor="#8E6F37" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="46" r="38" fill="url(#sc-brass)" />
          <circle cx="60" cy="82" r="24" fill="url(#sc-brass)" stroke="#7E6131" strokeWidth="1" />
          <circle cx="60" cy="82" r="8" fill="#FFF4D6" />
        </svg>
      </div>
    </div>
  )
}
