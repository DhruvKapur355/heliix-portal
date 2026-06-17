import type { HomeSummary } from '../types/inspection';

interface Props {
  homes: HomeSummary[];
  onOpenHome: (homeId: string) => void;
}

export default function Homes({ homes, onOpenHome }: Props) {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 4 }}>
          Homes
        </h2>
        <p style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
          Select a property to open its inspection media.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {homes.map((home) => (
          <button
            key={home.id}
            onClick={() => onOpenHome(home.id)}
            style={{
              textAlign: 'left',
              padding: 0,
              border: '1px solid #E8E8E4',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ aspectRatio: '4 / 3', background: '#F5F5F2' }}>
              <img src={home.photoUrl} alt={home.address} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9B93', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif', marginBottom: 8 }}>
                Property
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: '#1A1A1A', fontFamily: 'Fraunces, serif', marginBottom: 8 }}>
                {home.address}
              </div>
              <div style={{ fontSize: 13, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif' }}>
                Open inspection media
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}