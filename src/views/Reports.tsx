import { useState } from 'react';
import type { Report, ReportStatus } from '../types/report';

interface Props {
  reports: Report[];
  selectedReport: Report;
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  onGenerateReport: (id: string) => void;
}

const STATUS_STYLE: Record<ReportStatus, { bg: string; color: string; border: string }> = {
  Draft: { bg: '#F5F5F2', color: '#6B6B65', border: '#E8E8E4' },
  Ready: { bg: '#EAF5EF', color: '#2E7D5B', border: '#BFE2CF' },
  Sent: { bg: '#EEF2FA', color: '#1B3A6B', border: '#C5D4ED' },
};

const SEV_COLOR: Record<string, string> = { High: '#C0392B', Medium: '#B07212', Low: '#2E7D5B', None: '#9B9B93' };
const SEV_BG: Record<string, string> = { High: '#FDECEA', Medium: '#FEF6E8', Low: '#EAF5EF', None: '#F5F5F2' };

function StatusBadge({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
      {status}
    </span>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: '#FAFAF8', border: '1px solid #E8E8E4', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Reports({ reports, selectedReport, selectedReportId, onSelectReport, onGenerateReport }: Props) {
  const [loading, setLoading] = useState(false);
  const [openRooms, setOpenRooms] = useState<Set<string>>(new Set(['kitchen', 'master-bedroom', 'bathroom']));

  function toggleRoom(id: string) {
    setOpenRooms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerateReport(selectedReportId);
    }, 2000);
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {/* Left panel */}
      <div
        style={{
          width: 340,
          flexShrink: 0,
          borderRight: '1px solid #E8E8E4',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #E8E8E4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A' }}>
              Reports
            </h2>
            <button
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                border: 'none',
                background: '#1B3A6B',
                color: 'white',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
              }}
            >
              + New Report
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {reports.map((report) => {
            const isSelected = report.id === selectedReportId;
            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                style={{
                  padding: '14px 14px',
                  borderRadius: 10,
                  border: isSelected ? '1.5px solid #1B3A6B' : '1px solid #E8E8E4',
                  background: isSelected ? '#EEF2FA' : '#FFFFFF',
                  cursor: 'pointer',
                  marginBottom: 8,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4, flex: 1, paddingRight: 8 }}>
                    {report.propertyAddress}
                  </span>
                  <StatusBadge status={report.status} />
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
                  <span>{report.inspectionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{report.findingsFlagged} findings</span>
                  <span>·</span>
                  <span>{report.photosCount + report.videosCount} media</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28, background: '#FAFAF8' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 4 }}>
              {selectedReport.propertyAddress}
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
                {selectedReport.inspectionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ color: '#E8E8E4' }}>·</span>
              <span style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>{selectedReport.agentName}</span>
              <StatusBadge status={selectedReport.status} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Edit', 'Export PDF', 'Share Link'].map((label) => (
              <button
                key={label}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid #E8E8E4',
                  background: '#FFFFFF',
                  color: '#1A1A1A',
                  fontSize: 13,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  fontWeight: label === 'Export PDF' ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <MetricCard label="Total Rooms" value={selectedReport.totalRooms} />
          <MetricCard label="Photos Captured" value={selectedReport.photosCount} />
          <MetricCard label="Videos Captured" value={selectedReport.videosCount} />
          <MetricCard label="Findings Flagged" value={selectedReport.findingsFlagged} sub={`${selectedReport.findingsFlagged} need review`} />
        </div>

        {/* Findings section */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E8E4',
            borderRadius: 12,
            marginBottom: 16,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E8E4' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A' }}>
              Findings by Room
            </h3>
          </div>

          {selectedReport.roomFindings.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
              No findings data for this report.
            </div>
          ) : (
            selectedReport.roomFindings.map((rf) => {
              const isOpen = openRooms.has(rf.roomId);
              return (
                <div key={rf.roomId} style={{ borderBottom: '1px solid #E8E8E4' }}>
                  <div
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      background: isOpen ? '#FAFAF8' : '#FFFFFF',
                    }}
                    onClick={() => toggleRoom(rf.roomId)}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', flex: 1 }}>
                      {rf.roomName}
                    </span>
                    <span style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
                      {rf.items.length} items
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: SEV_BG[rf.severity],
                        color: SEV_COLOR[rf.severity],
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {rf.severity}
                    </span>
                    <svg
                      width="12" height="8" viewBox="0 0 12 8" fill="none"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
                    >
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#9B9B93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '8px 20px 16px', background: '#FAFAF8' }}>
                      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                        {rf.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              flexShrink: 0,
                              width: 140,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '1px solid #E8E8E4',
                              background: '#FFFFFF',
                            }}
                          >
                            <div style={{ position: 'relative' }}>
                              <img
                                src={item.thumbnailUrl}
                                alt=""
                                style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
                                loading="lazy"
                              />
                              {item.type === 'video' && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M1 1L7 5L1 9V1Z" fill="#1A1A1A" /></svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div style={{ padding: '6px 8px' }}>
                              <FindingPill tag={item.finding} />
                              {item.notes && (
                                <p style={{ fontSize: 10, color: '#6B6B65', fontFamily: 'DM Sans, sans-serif', marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Flight summary */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 12, padding: '18px 20px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 14 }}>
            Flight Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlightStat label="Total Flight Time" value={selectedReport.flightSummary.totalFlightTime} />
            <FlightStat label="Battery Used" value={`${selectedReport.flightSummary.batteryUsed}%`} />
            <FlightStat label="Beacons Deployed" value={selectedReport.flightSummary.beaconsDeployed.toString()} />
          </div>
          {/* Mini map */}
          <div style={{ marginTop: 16 }}>
            <MiniFlightMap />
          </div>
        </div>

        {/* Generate button */}
        {selectedReport.status === 'Draft' && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 10,
              border: 'none',
              background: loading ? '#9B9B93' : '#F5A623',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                Generating Report...
              </>
            ) : (
              'Generate Report'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function FindingPill({ tag }: { tag: string }) {
  const COLORS: Record<string, { bg: string; color: string }> = {
    Clear: { bg: '#EAF5EF', color: '#2E7D5B' },
    'Needs Attention': { bg: '#FEF6E8', color: '#B07212' },
    Flagged: { bg: '#FDECEA', color: '#C0392B' },
  };
  const s = COLORS[tag] ?? { bg: '#F5F5F2', color: '#6B6B65' };
  return (
    <span style={{ padding: '2px 6px', borderRadius: 4, background: s.bg, color: s.color, fontSize: 9, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
      {tag}
    </span>
  );
}

function FlightStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#FAFAF8', border: '1px solid #E8E8E4', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 10, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A' }}>{value}</div>
    </div>
  );
}

function MiniFlightMap() {
  const waypoints = [
    [60, 35], [100, 35], [130, 20], [170, 20], [200, 30], [215, 50], [210, 70],
    [185, 85], [150, 90], [110, 88], [75, 80], [55, 65], [50, 48], [60, 35],
  ];
  const d = waypoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <div style={{ background: '#FAFAF8', border: '1px solid #E8E8E4', borderRadius: 8, padding: 12, display: 'inline-block' }}>
      <div style={{ fontSize: 10, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Flight Path Thumbnail
      </div>
      <svg viewBox="0 0 270 120" width="270" height="120" style={{ display: 'block' }}>
        <rect x="40" y="10" width="190" height="100" rx="3" fill="#F0EFEB" stroke="#D0CFC8" strokeWidth="1" />
        <path d={d} fill="none" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        {[{ x: 42, y: 12, id: 'B1' }, { x: 228, y: 12, id: 'B2' }, { x: 228, y: 108, id: 'B3' }, { x: 42, y: 108, id: 'B4' }].map((b) => (
          <g key={b.id}>
            <circle cx={b.x} cy={b.y} r="4" fill="#1B3A6B" opacity="0.5" />
            <text x={b.x} y={b.y - 6} textAnchor="middle" fill="#1B3A6B" fontSize="6" fontFamily="DM Sans, sans-serif">{b.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
