import { useState } from 'react';
import type { MediaItem } from '../types/inspection';

interface Props {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: (item: MediaItem) => void;
}

const FINDING_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Clear: { bg: '#EAF5EF', color: '#2E7D5B', border: '#BFE2CF' },
  'Needs Attention': { bg: '#FEF6E8', color: '#B07212', border: '#F5D78A' },
  Flagged: { bg: '#FDECEA', color: '#C0392B', border: '#F5C4C0' },
};

export default function MediaCard({ item, isSelected, onToggleSelect, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const findingStyle = FINDING_STYLES[item.finding];

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        background: '#FFFFFF',
        border: isSelected ? '2px solid #1B3A6B' : '1px solid #E8E8E4',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        breakInside: 'avoid',
        marginBottom: 12,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
    >
      {/* Checkbox */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          opacity: hovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(item.id);
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            background: isSelected ? '#1B3A6B' : 'rgba(255,255,255,0.9)',
            border: isSelected ? '2px solid #1B3A6B' : '2px solid #D0CFC8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div style={{ position: 'relative' }}>
        <img
          src={item.thumbnailUrl}
          alt={item.roomName}
          style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
          loading="lazy"
        />
        {/* Room badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: 5,
            fontSize: 10,
            fontWeight: 600,
            color: '#1A1A1A',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {item.roomName}
        </div>
        {/* Video overlay */}
        {item.type === 'video' && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                  <path d="M1 1L11 7L1 13V1Z" fill="#1A1A1A" />
                </svg>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0,0,0,0.65)',
                color: 'white',
                fontSize: 10,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {item.duration}
            </div>
          </>
        )}
        {/* Timestamp */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: 'rgba(0,0,0,0.55)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 10,
            fontFamily: 'DM Sans, sans-serif',
            padding: '2px 6px',
            borderRadius: 4,
          }}
        >
          {item.capturedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: item.type === 'photo' ? '#1B3A6B' : '#F5A623',
            }}
          />
          <span style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
            {item.type === 'photo' ? 'Photo' : 'Video'}
          </span>
        </div>
        <div
          style={{
            padding: '2px 7px',
            borderRadius: 5,
            background: findingStyle.bg,
            border: `1px solid ${findingStyle.border}`,
            fontSize: 10,
            fontWeight: 600,
            color: findingStyle.color,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {item.finding}
        </div>
      </div>
    </div>
  );
}
