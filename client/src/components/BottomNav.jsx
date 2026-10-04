const ITEMS = [
  {
    key: 'foods',
    label: 'Foods',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 3v7a3 3 0 0 0 6 0V3" />
        <path d="M7 3v18" />
        <path d="M17 3c-2 2-3 5-3 9h6c0-4-1-7-3-9Z" />
        <path d="M17 12v9" />
      </svg>
    ),
  },
  {
    key: 'workout',
    label: 'Workout',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="1" y="9" width="3" height="6" rx="1" />
        <rect x="4" y="6" width="3" height="12" rx="1" />
        <rect x="7" y="11" width="10" height="2" />
        <rect x="17" y="6" width="3" height="12" rx="1" />
        <rect x="20" y="9" width="3" height="6" rx="1" />
      </svg>
    ),
  },
  {
    key: 'weight',
    label: 'Weight',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="3,17 9,11 13,15 21,6" />
      </svg>
    ),
  },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={item.key === active ? 'nav-item active' : 'nav-item'}
          aria-current={item.key === active ? 'page' : undefined}
          onClick={() => onChange(item.key)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}