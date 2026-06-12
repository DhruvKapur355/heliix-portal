import React from 'react';
import FloorPlan from '../components/FloorPlan';
import EventLog from '../components/EventLog';
import type { DroneState, EventLogEntry, MissionState } from '../types/drone';

interface Props {
  droneState: DroneState;
  events: EventLogEntry[];
  onPause: () => void;
  onResume: () => void;
  onAbort: () => void;
  onReturn: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const MISSION_BADGE: Record<MissionState, { label: string; bg: string; color: string; dot: string }> = {
  ACTIVE: { label: 'ACTIVE', bg: '#EAF5EF', color: '#2E7D5B', dot: '#2E7D5B' },
  PAUSED: { label: 'PAUSED', bg: '#FEF6E8', color: '#B07212', dot: '#F5A623' },
  ABORTED: { label: 'ABORTED', bg: '#FDECEA', color: '#C0392B', dot: '#C0392B' },
  COMPLETE: { label: 'COMPLETE', bg: '#EEF2FA', color: '#1B3A6B', dot: '#1B3A6B' },
  RETURNING: { label: 'RETURNING', bg: '#FEF6E8', color: '#B07212', dot: '#F5A623' },
};

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
        {value}
      </div>
    </div>
  );
}

export default function LiveView({ droneState, events, onPause, onResume, onAbort, onReturn }: Props) {
  const badge = MISSION_BADGE[droneState.missionState];
  const isPaused = droneState.missionState === 'PAUSED';
  const isAborted = droneState.missionState === 'ABORTED' || droneState.missionState === 'RETURNING';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 20,
          padding: 24,
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          minHeight: 0,
        }}
      >
        {/* Floor plan */}
        <FloorPlan droneState={droneState} />

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Mission Status */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9B9B93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif', marginBottom: 4 }}>
                  Mission Status
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
                  142 Elmwood Drive
                </h3>
                <p style={{ fontSize: 12, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>Summit, NJ 07901</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: badge.bg,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: badge.dot,
                    animation: droneState.missionState === 'ACTIVE' ? 'pulse 2s infinite' : 'none',
                  }}
                />
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
                <span style={{ fontSize: 11, fontWeight: 700, color: badge.color, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em' }}>
                  {badge.label}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <StatItem label="Flight Time" value={formatTime(droneState.flightTime)} />
              <StatItem label="Battery" value={`${Math.round(droneState.battery)}%`} />
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Rooms Completed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 5, background: '#E8E8E4', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(droneState.roomsCompleted / droneState.totalRooms) * 100}%`,
                        background: '#1B3A6B',
                        borderRadius: 3,
                        transition: 'width 0.5s',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                    {droneState.roomsCompleted} of {droneState.totalRooms}
                  </span>
                </div>
              </div>
            </div>

            {/* Battery bar */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Battery Level
              </div>
              <div style={{ height: 5, background: '#E8E8E4', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${droneState.battery}%`,
                    background: droneState.battery > 50 ? '#2E7D5B' : droneState.battery > 25 ? '#F5A623' : '#C0392B',
                    borderRadius: 3,
                    transition: 'width 1s, background 1s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Current Room */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9B9B93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif', marginBottom: 12 }}>
              Current Room
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: '#1B3A6B', fontFamily: 'Fraunces, serif', marginBottom: 12 }}>
              {droneState.position.room}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: '#F5F5F2', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Photos</div>
                <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A' }}>{droneState.photosInCurrentRoom}</div>
              </div>
              <div style={{ background: '#F5F5F2', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Videos</div>
                <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A' }}>{droneState.videosInCurrentRoom}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Coordinates
              </div>
              <code style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'ui-monospace, Consolas, monospace' }}>
                x={droneState.currentRoomCoords.x.toFixed(2)} y={droneState.currentRoomCoords.y.toFixed(2)} z={droneState.currentRoomCoords.z.toFixed(2)}m
              </code>
            </div>
          </div>

          {/* Mission Controls */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9B9B93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif', marginBottom: 12 }}>
              Mission Controls
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!isAborted && (
                <button
                  onClick={isPaused ? onResume : onPause}
                  style={{
                    ...ctaButtonStyle,
                    background: isPaused ? '#EAF5EF' : '#F5F5F2',
                    color: isPaused ? '#2E7D5B' : '#1A1A1A',
                    border: isPaused ? '1px solid #BFE2CF' : '1px solid #E8E8E4',
                  }}
                >
                  {isPaused ? '▶  Resume Mission' : '⏸  Pause Mission'}
                </button>
              )}
              {!isAborted && (
                <button onClick={onReturn} style={{ ...ctaButtonStyle, background: '#F5F5F2', color: '#1A1A1A', border: '1px solid #E8E8E4' }}>
                  ↩  Return to Start
                </button>
              )}
              {!isAborted && (
                <button
                  onClick={onAbort}
                  style={{
                    ...ctaButtonStyle,
                    background: '#FDECEA',
                    color: '#C0392B',
                    border: '1px solid #F5C4C0',
                    fontWeight: 600,
                  }}
                >
                  ✕  Abort Mission
                </button>
              )}
              {isAborted && (
                <div style={{ padding: '12px', borderRadius: 8, background: '#FDECEA', border: '1px solid #F5C4C0' }}>
                  <p style={{ fontSize: 13, color: '#C0392B', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                    {droneState.missionState === 'RETURNING' ? 'Drone returning to start position...' : 'Mission aborted. Drone is holding position.'}
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                background: '#F5F5F2',
                borderRadius: 8,
                borderLeft: '3px solid #F5A623',
              }}
            >
              <p style={{ fontSize: 12, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>
                {droneState.statusLine}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event log */}
      <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E8E8E4' }}>
          <EventLog events={events} />
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 12,
  border: '1px solid #E8E8E4',
  padding: 18,
};

const ctaButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 500,
  textAlign: 'left',
  transition: 'opacity 0.15s',
};
