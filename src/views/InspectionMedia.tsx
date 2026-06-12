import React, { useState, useMemo } from 'react';
import MediaCard from '../components/MediaCard';
import MediaDetail from '../components/MediaDetail';
import type { MediaItem, FindingTag } from '../types/inspection';

interface Props {
  media: MediaItem[];
  rooms: { id: string; name: string }[];
  onUpdateItem: (id: string, updates: Partial<Pick<MediaItem, 'finding' | 'severity' | 'notes' | 'addedToReport' | 'roomId' | 'roomName'>>) => void;
  onDeleteItem: (id: string) => void;
}

type Tab = 'all' | 'photos' | 'videos';
type SortOption = 'newest' | 'room' | 'severity';

const FINDING_TAGS: { value: FindingTag | 'All'; label: string }[] = [
  { value: 'All', label: 'All Findings' },
  { value: 'Clear', label: 'Clear' },
  { value: 'Needs Attention', label: 'Needs Attention' },
  { value: 'Flagged', label: 'Flagged' },
];

const SEVERITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2, None: 3 };
const ROOM_ORDER = ['Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bathroom', 'Hallway'];

export default function InspectionMedia({ media, rooms, onUpdateItem, onDeleteItem }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [findingFilter, setFindingFilter] = useState<FindingTag | 'All'>('All');
  const [sort, setSort] = useState<SortOption>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    let items = [...media];
    if (tab === 'photos') items = items.filter((m) => m.type === 'photo');
    if (tab === 'videos') items = items.filter((m) => m.type === 'video');
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) => m.roomName.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q) || m.finding.toLowerCase().includes(q)
      );
    }
    if (roomFilter !== 'all') items = items.filter((m) => m.roomId === roomFilter);
    if (findingFilter !== 'All') items = items.filter((m) => m.finding === findingFilter);
    if (sort === 'newest') items.sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime());
    if (sort === 'room') items.sort((a, b) => ROOM_ORDER.indexOf(a.roomName) - ROOM_ORDER.indexOf(b.roomName));
    if (sort === 'severity') items.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
    return items;
  }, [media, tab, search, roomFilter, findingFilter, sort]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const counts = {
    all: media.length,
    photos: media.filter((m) => m.type === 'photo').length,
    videos: media.filter((m) => m.type === 'video').length,
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24, position: 'relative' }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 4 }}>
          Inspection Media
        </h2>
        <p style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
          142 Elmwood Drive, Summit, NJ · {media.length} items · {media.filter(m => m.finding === 'Flagged').length} flagged
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E8E4',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 180 }}>
          <svg
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="13" height="13" viewBox="0 0 13 13" fill="none"
          >
            <circle cx="5.5" cy="5.5" r="4" stroke="#9B9B93" strokeWidth="1.5" />
            <path d="M8.5 8.5L11.5 11.5" stroke="#9B9B93" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search rooms, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 28px',
              border: '1px solid #E8E8E4',
              borderRadius: 7,
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              color: '#1A1A1A',
              outline: 'none',
              background: '#FAFAF8',
            }}
          />
        </div>

        {/* Room filter */}
        <select
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Rooms</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        {/* Finding filter */}
        <select
          value={findingFilter}
          onChange={(e) => setFindingFilter(e.target.value as FindingTag | 'All')}
          style={filterSelectStyle}
        >
          {FINDING_TAGS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          style={filterSelectStyle}
        >
          <option value="newest">Newest First</option>
          <option value="room">Room Order</option>
          <option value="severity">By Severity</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid #E8E8E4' }}>
        {(['all', 'photos', 'videos'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #1B3A6B' : '2px solid transparent',
              marginBottom: -1,
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#1B3A6B' : '#6B6B65',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            {t === 'all' ? 'All Media' : t === 'photos' ? 'Photos' : 'Videos'}
            <span
              style={{
                background: tab === t ? '#EEF2FA' : '#F5F5F2',
                color: tab === t ? '#1B3A6B' : '#9B9B93',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: 'sticky',
            top: 76,
            zIndex: 30,
            background: '#1B3A6B',
            color: 'white',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            boxShadow: '0 4px 16px rgba(27,58,107,0.25)',
          }}
        >
          <span style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', flex: 1 }}>
            <strong>{selectedIds.size}</strong> {selectedIds.size === 1 ? 'item' : 'items'} selected
          </span>
          <button style={bulkActionBtn}>Export as ZIP</button>
          <button style={bulkActionBtn}>Add to Report</button>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{ ...bulkActionBtn, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
          No media matches your filters.
        </div>
      ) : (
        <div
          style={{
            columns: '280px',
            columnGap: 12,
          }}
        >
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={toggleSelect}
              onClick={setDetailItem}
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {detailItem && (
        <MediaDetail
          item={detailItem}
          rooms={rooms}
          onClose={() => setDetailItem(null)}
          onSave={(id, updates) => {
            onUpdateItem(id, updates);
            setDetailItem((prev) => prev && prev.id === id ? { ...prev, ...updates } : prev);
          }}
          onDelete={(id) => {
            onDeleteItem(id);
            setDetailItem(null);
          }}
        />
      )}
    </div>
  );
}

const filterSelectStyle: React.CSSProperties = {
  padding: '7px 28px 7px 10px',
  border: '1px solid #E8E8E4',
  borderRadius: 7,
  fontSize: 12,
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1A1A',
  background: '#FAFAF8',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B65' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

const bulkActionBtn: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: 'none',
  background: 'rgba(255,255,255,0.15)',
  color: 'white',
  fontSize: 12,
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 500,
  cursor: 'pointer',
};
