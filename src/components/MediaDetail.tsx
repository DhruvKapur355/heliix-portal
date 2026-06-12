import React, { useState, useEffect } from 'react';
import type { MediaItem, FindingTag, Severity } from '../types/inspection';

interface Props {
  item: MediaItem;
  rooms: { id: string; name: string }[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<MediaItem, 'finding' | 'severity' | 'notes' | 'addedToReport' | 'roomId' | 'roomName'>>) => void;
  onDelete: (id: string) => void;
}

const FINDING_OPTS: FindingTag[] = ['Clear', 'Needs Attention', 'Flagged'];
const SEVERITY_OPTS: Severity[] = ['None', 'Low', 'Medium', 'High'];

const FINDING_BADGE: Record<FindingTag, { bg: string; color: string }> = {
  Clear: { bg: '#EAF5EF', color: '#2E7D5B' },
  'Needs Attention': { bg: '#FEF6E8', color: '#B07212' },
  Flagged: { bg: '#FDECEA', color: '#C0392B' },
};

export default function MediaDetail({ item, rooms, onClose, onSave, onDelete }: Props) {
  const [finding, setFinding] = useState<FindingTag>(item.finding);
  const [severity, setSeverity] = useState<Severity>(item.severity);
  const [notes, setNotes] = useState(item.notes);
  const [addedToReport, setAddedToReport] = useState(item.addedToReport);
  const [roomId, setRoomId] = useState(item.roomId);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setFinding(item.finding);
    setSeverity(item.severity);
    setNotes(item.notes);
    setAddedToReport(item.addedToReport);
    setRoomId(item.roomId);
    setSaved(false);
    setConfirmDelete(false);
  }, [item.id]);

  function handleSave() {
    const selectedRoom = rooms.find((r) => r.id === roomId);
    onSave(item.id, {
      finding,
      severity,
      notes,
      addedToReport,
      roomId,
      roomName: selectedRoom?.name ?? item.roomName,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete() {
    onDelete(item.id);
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* Backdrop */}
      <div
        style={{ flex: 1, background: 'rgba(0,0,0,0.4)', cursor: 'pointer' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          width: 480,
          background: '#FFFFFF',
          borderLeft: '1px solid #E8E8E4',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideIn 0.2s ease-out',
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(480px); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8E8E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
              {item.roomName}
            </h3>
            <span style={{ fontSize: 12, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
              {item.type === 'photo' ? 'Photo' : 'Video'} · {item.capturedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F5F5F2',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B6B65',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#6B6B65" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Media */}
        <div style={{ flexShrink: 0 }}>
          {item.type === 'photo' ? (
            <img
              src={item.thumbnailUrl}
              alt={item.roomName}
              style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 240,
                background: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <img
                src={item.thumbnailUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <path d="M1 1L15 9L1 17V1Z" fill="#1A1A1A" />
                </svg>
              </div>
              {item.duration && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'DM Sans, sans-serif',
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  {item.duration}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coords */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E8E8E4' }}>
          <span
            style={{
              fontFamily: 'ui-monospace, Consolas, monospace',
              fontSize: 11,
              color: '#9B9B93',
            }}
          >
            {item.coordinates.x.toFixed(2)}, {item.coordinates.y.toFixed(2)}, z={item.coordinates.z.toFixed(2)}
          </span>
        </div>

        {/* Fields */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          {/* Room assignment */}
          <div>
            <label style={labelStyle}>Room</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ ...selectStyle, flex: 1 }}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {roomId !== item.roomId && (
                <span style={{ fontSize: 11, color: '#F5A623', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Changed
                </span>
              )}
            </div>
            {roomId !== item.roomId && (
              <p style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', marginTop: 5 }}>
                Originally captured in <strong>{item.roomName}</strong> — save to reassign.
              </p>
            )}
          </div>

          {/* Finding */}
          <div>
            <label style={labelStyle}>Finding</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {FINDING_OPTS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFinding(opt)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: `1.5px solid ${finding === opt ? FINDING_BADGE[opt].color : '#E8E8E4'}`,
                    background: finding === opt ? FINDING_BADGE[opt].bg : '#FFFFFF',
                    color: finding === opt ? FINDING_BADGE[opt].color : '#6B6B65',
                    fontSize: 12,
                    fontWeight: finding === opt ? 600 : 400,
                    fontFamily: 'DM Sans, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label style={labelStyle}>Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              style={selectStyle}
            >
              {SEVERITY_OPTS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this finding..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #E8E8E4',
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                color: '#1A1A1A',
                resize: 'vertical',
                outline: 'none',
                background: '#FAFAF8',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Add to Report toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 8,
              background: '#F5F5F2',
              border: '1px solid #E8E8E4',
              cursor: 'pointer',
            }}
            onClick={() => setAddedToReport(!addedToReport)}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif' }}>
                Add to Report
              </div>
              <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
                Include this item in the inspection report
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: addedToReport ? '#1B3A6B' : '#D0CFC8',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: 2,
                  left: addedToReport ? 20 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div
            style={{
              margin: '0 20px',
              padding: '14px',
              borderRadius: 8,
              background: '#FDECEA',
              border: '1px solid #F5C4C0',
              flexShrink: 0,
            }}
          >
            <p style={{ fontSize: 13, color: '#C0392B', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, marginBottom: 10 }}>
              Delete this {item.type}? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: 'none',
                  background: '#C0392B',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: '1px solid #E8E8E4',
                  background: '#FFFFFF',
                  color: '#6B6B65',
                  fontSize: 12,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #E8E8E4',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              border: 'none',
              background: saved ? '#2E7D5B' : '#1B3A6B',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #E8E8E4',
              background: '#FFFFFF',
              color: '#6B6B65',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M6 1v9M2 7l4 4 4-4M1 13h10" stroke="#6B6B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #F5C4C0',
              background: '#FDECEA',
              color: '#C0392B',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M1 3h10M4 3V2h4v1M2 3l1 9h6l1-9" stroke="#C0392B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#6B6B65',
  fontFamily: 'DM Sans, sans-serif',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 8,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid #E8E8E4',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1A1A',
  background: '#FAFAF8',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B65' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 32,
};
