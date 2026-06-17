import type { AuthUser } from '../hooks/useAuth';

type NavItem = 'homes' | 'live' | 'reports' | 'settings';

interface Props {
  active: NavItem;
  onChange: (page: NavItem) => void;
  user: AuthUser;
  onLogout: () => void;
}

const NAV_ITEMS: { id: NavItem; label: string }[] = [
  { id: 'homes', label: 'Homes' },
  { id: 'reports', label: 'Reports' },
  { id: 'live', label: 'Live View' },
  { id: 'settings', label: 'Settings' },
];

export default function NavBar({ active, onChange, user, onLogout }: Props) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E4',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 48,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#1B3A6B',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3.5 3.5l2 2M10.5 10.5l2 2M10.5 3.5l-2 2M5.5 10.5l-2 2" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 20,
              fontWeight: 600,
              color: '#1B3A6B',
              letterSpacing: '-0.3px',
            }}
          >
            Heliix
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 14px',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1B3A6B' : '#6B6B65',
                  fontFamily: 'DM Sans, sans-serif',
                  borderBottom: isActive ? '2px solid #1B3A6B' : '2px solid transparent',
                  marginBottom: isActive ? -1 : -1,
                  borderRadius: 0,
                  transition: 'color 0.15s, border-color 0.15s',
                  position: 'relative',
                  top: 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#1A1A1A';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#6B6B65';
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#1B3A6B', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white',
                fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                flexShrink: 0,
              }}
            >
              {user.initials}
            </div>
            <span style={{ fontSize: 13, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </span>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              background: 'none', border: '1.5px solid #E8E8E4', borderRadius: 8,
              cursor: 'pointer', padding: '5px 10px',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#C0392B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E8E4'; e.currentTarget.style.color = '#6B6B65'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
