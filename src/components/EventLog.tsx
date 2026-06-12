import { useRef, useEffect } from 'react';
import type { EventLogEntry } from '../types/drone';

interface Props {
  events: EventLogEntry[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getEventStyle(message: string): { dot: string; text: string } {
  if (message.toLowerCase().includes('flagged') || message.toLowerCase().includes('stain') || message.toLowerCase().includes('water')) {
    return { dot: '#C0392B', text: '#C0392B' };
  }
  if (message.toLowerCase().includes('battery')) {
    return { dot: '#F5A623', text: '#F5A623' };
  }
  if (message.toLowerCase().includes('complete') || message.toLowerCase().includes('all beacons')) {
    return { dot: '#2E7D5B', text: '#2E7D5B' };
  }
  return { dot: '#6B6B65', text: '#1A1A1A' };
}

export default function EventLog({ events }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [events.length]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E8E8E4',
        padding: '12px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
          Event Log
        </span>
        <div style={{ height: 1, background: '#E8E8E4', flex: 1 }} />
      </div>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {events.map((event, i) => {
          const style = getEventStyle(event.message);
          return (
            <div
              key={event.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: i === 0 ? '#F5F5F2' : 'transparent',
                  border: i === 0 ? '1px solid #E8E8E4' : '1px solid transparent',
                  minWidth: 180,
                  maxWidth: 220,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: style.dot,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: '#9B9B93',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: style.text,
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {event.message}
                </p>
              </div>
              {i < events.length - 1 && (
                <div
                  style={{
                    width: 20,
                    height: 1,
                    background: '#E8E8E4',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
