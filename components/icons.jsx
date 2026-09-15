export function SearchIcon({ className = "w-4 h-4" }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2.3" />
    <path d="M14.8 14.8L20.5 20.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M7.2 7.5c.8-1.3 2-2 3.5-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".5" />
  </svg>;
}

export function CartIcon({ className = "w-4 h-4" }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3.5 4.5h2l1.8 10.1a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2l1-6.6H7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.7 10.5h7.4M10.2 13h6.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity=".75" />
    <circle cx="9.3" cy="19.4" r="1.25" fill="currentColor" />
    <circle cx="17.2" cy="19.4" r="1.25" fill="currentColor" />
  </svg>;
}

export function MenuIcon({ className = "w-4 h-4" }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className}><line x1="4" y1="6.5" x2="20" y2="6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="4" y1="17.5" x2="14.5" y2="17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

export function ChevronIcon({ className = "w-4 h-4", direction = "right" }) {
  return <svg viewBox="0 0 24 24" fill="none" className={`${className} ${direction === "left" ? "rotate-180" : ""}`}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
