import type { DroneState } from '../types/drone';

interface Props {
  droneState: DroneState;
}

const ROOMS = [
  { id: 'living-room', label: 'Living Room', x: 160, y: 110, width: 190, height: 120 },
  { id: 'kitchen', label: 'Kitchen', x: 350, y: 160, width: 120, height: 110 },
  { id: 'master-bedroom', label: 'Master Bedroom', x: 160, y: 255, width: 190, height: 100 },
  { id: 'bedroom-2', label: 'Bedroom 2', x: 60, y: 230, width: 100, height: 90 },
  { id: 'bathroom', label: 'Bathroom', x: 120, y: 175, width: 90, height: 75 },
  { id: 'hallway', label: 'Hallway', x: 90, y: 175, width: 120, height: 80 },
];

const BEACONS = [
  { id: 'B1', x: 70, y: 115 },
  { id: 'B2', x: 460, y: 115 },
  { id: 'B3', x: 460, y: 350 },
  { id: 'B4', x: 70, y: 350 },
];

export default function FloorPlan({ droneState }: Props) {
  const { position, trail } = droneState;
  const currentRoom = position.room;

  const trailPath =
    trail.length > 1
      ? `M ${trail[0].x} ${trail[0].y} ` +
        trail
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(' ')
      : '';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E8E8E4',
        padding: 24,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
          Floor Plan
        </h3>
        <span
          style={{
            fontSize: 11,
            color: '#6B6B65',
            fontFamily: 'DM Sans, sans-serif',
            background: '#F5F5F2',
            padding: '3px 8px',
            borderRadius: 4,
          }}
        >
          142 Elmwood Drive
        </span>
      </div>

      <svg
        viewBox="40 95 450 275"
        style={{ width: '100%', flex: 1 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer walls */}
        <rect x="58" y="108" width="412" height="255" rx="3" fill="#F0EFEB" stroke="#C8C8C0" strokeWidth="2" />

        {/* Rooms */}
        {ROOMS.map((room) => {
          const isActive = currentRoom === room.label;
          return (
            <g key={room.id}>
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={isActive ? '#EEF2FA' : '#FAFAF8'}
                stroke={isActive ? '#1B3A6B' : '#D0CFC8'}
                strokeWidth={isActive ? 1.5 : 1}
                rx="2"
                style={{ transition: 'fill 0.4s, stroke 0.4s' }}
              />
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2 - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? '#1B3A6B' : '#6B6B65'}
                fontSize="8.5"
                fontFamily="DM Sans, sans-serif"
                fontWeight={isActive ? '600' : '400'}
                style={{ transition: 'fill 0.4s' }}
              >
                {room.label}
              </text>
            </g>
          );
        })}

        {/* Wall dividers */}
        <line x1="160" y1="175" x2="160" y2="230" stroke="#C8C8C0" strokeWidth="1" />
        <line x1="210" y1="110" x2="210" y2="175" stroke="#C8C8C0" strokeWidth="1" />
        <line x1="350" y1="160" x2="350" y2="230" stroke="#C8C8C0" strokeWidth="1" />
        <line x1="160" y1="230" x2="350" y2="230" stroke="#C8C8C0" strokeWidth="1" />
        <line x1="60" y1="230" x2="160" y2="230" stroke="#C8C8C0" strokeWidth="1" />

        {/* Beacons */}
        {BEACONS.map((b) => (
          <g key={b.id}>
            <circle cx={b.x} cy={b.y} r="7" fill="#1B3A6B" opacity="0.15" />
            <circle cx={b.x} cy={b.y} r="4" fill="#1B3A6B" opacity="0.6" />
            <text
              x={b.x}
              y={b.y - 11}
              textAnchor="middle"
              fill="#1B3A6B"
              fontSize="7"
              fontFamily="DM Sans, sans-serif"
              fontWeight="600"
            >
              {b.id}
            </text>
          </g>
        ))}

        {/* Trail */}
        {trailPath && (
          <path
            d={trailPath}
            fill="none"
            stroke="#F5A623"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Drone */}
        <circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="#1B3A6B"
          opacity="0.15"
        />
        <circle
          cx={position.x}
          cy={position.y}
          r="6"
          fill="#1B3A6B"
        />
        <circle
          cx={position.x}
          cy={position.y}
          r="2.5"
          fill="white"
        />
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="#1B3A6B" />
            <circle cx="6" cy="6" r="1.5" fill="white" />
          </svg>
          <span style={{ fontSize: 11, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif' }}>Drone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="16" height="8" viewBox="0 0 16 8">
            <path d="M 0 4 L 16 4" stroke="#F5A623" strokeWidth="2" strokeOpacity="0.5" />
          </svg>
          <span style={{ fontSize: 11, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif' }}>Flight path</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill="#EEF2FA" stroke="#1B3A6B" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: 11, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif' }}>Active room</span>
        </div>
      </div>
    </div>
  );
}
