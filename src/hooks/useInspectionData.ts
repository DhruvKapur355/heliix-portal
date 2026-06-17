import { useState, useCallback } from 'react';
import type { HomeSummary, MediaItem } from '../types/inspection';
import type { Report } from '../types/report';

const ROOMS = [
  { id: 'living-room', name: 'Living Room' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'master-bedroom', name: 'Master Bedroom' },
  { id: 'bedroom-2', name: 'Bedroom 2' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'hallway', name: 'Hallway' },
];

function makeDate(minutesAgo: number): Date {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    roomId: 'living-room',
    roomName: 'Living Room',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/lr1/400/300',
    capturedAt: makeDate(42),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: true,
    coordinates: { x: 2.1, y: 3.4, z: 1.2 },
  },
  {
    id: 'm2',
    roomId: 'living-room',
    roomName: 'Living Room',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/lr2/400/280',
    capturedAt: makeDate(41),
    finding: 'Needs Attention',
    severity: 'Low',
    notes: 'Slight discoloration on north wall near window.',
    addedToReport: true,
    coordinates: { x: 2.4, y: 3.1, z: 1.2 },
  },
  {
    id: 'm3',
    roomId: 'living-room',
    roomName: 'Living Room',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/lr3/400/300',
    capturedAt: makeDate(40),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    duration: '0:32',
    coordinates: { x: 2.8, y: 3.0, z: 1.2 },
  },
  {
    id: 'm4',
    roomId: 'kitchen',
    roomName: 'Kitchen',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/kit1/400/310',
    capturedAt: makeDate(35),
    finding: 'Flagged',
    severity: 'High',
    notes: 'Visible water stain under sink cabinet. Possible leak — recommend plumber inspection.',
    addedToReport: true,
    coordinates: { x: 4.1, y: 2.8, z: 1.2 },
  },
  {
    id: 'm5',
    roomId: 'kitchen',
    roomName: 'Kitchen',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/kit2/400/300',
    capturedAt: makeDate(34),
    finding: 'Needs Attention',
    severity: 'Medium',
    notes: 'Grout between backsplash tiles showing wear.',
    addedToReport: true,
    coordinates: { x: 4.3, y: 2.6, z: 1.4 },
  },
  {
    id: 'm6',
    roomId: 'kitchen',
    roomName: 'Kitchen',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/kit3/400/290',
    capturedAt: makeDate(33),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    duration: '0:48',
    coordinates: { x: 4.5, y: 2.5, z: 1.2 },
  },
  {
    id: 'm7',
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/mb1/400/300',
    capturedAt: makeDate(28),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: true,
    coordinates: { x: 2.9, y: 5.2, z: 1.2 },
  },
  {
    id: 'm8',
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/mb2/400/320',
    capturedAt: makeDate(27),
    finding: 'Flagged',
    severity: 'Medium',
    notes: 'Crack in ceiling plaster above closet — approx. 15cm. Monitor for expansion.',
    addedToReport: true,
    coordinates: { x: 3.1, y: 5.0, z: 2.4 },
  },
  {
    id: 'm9',
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/mb3/400/300',
    capturedAt: makeDate(26),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    duration: '1:04',
    coordinates: { x: 3.0, y: 5.1, z: 1.2 },
  },
  {
    id: 'm10',
    roomId: 'bedroom-2',
    roomName: 'Bedroom 2',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/b21/400/300',
    capturedAt: makeDate(20),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    coordinates: { x: 1.5, y: 5.0, z: 1.2 },
  },
  {
    id: 'm11',
    roomId: 'bedroom-2',
    roomName: 'Bedroom 2',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/b22/400/280',
    capturedAt: makeDate(19),
    finding: 'Needs Attention',
    severity: 'Low',
    notes: 'Window seal appears slightly worn. Minor draft possible.',
    addedToReport: true,
    coordinates: { x: 1.3, y: 4.8, z: 1.2 },
  },
  {
    id: 'm12',
    roomId: 'bathroom',
    roomName: 'Bathroom',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/bath1/400/300',
    capturedAt: makeDate(14),
    finding: 'Flagged',
    severity: 'High',
    notes: 'Mold growth visible on grout in shower corner. Health concern — requires remediation.',
    addedToReport: true,
    coordinates: { x: 1.9, y: 3.8, z: 1.2 },
  },
  {
    id: 'm13',
    roomId: 'bathroom',
    roomName: 'Bathroom',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/bath2/400/310',
    capturedAt: makeDate(13),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    coordinates: { x: 2.0, y: 3.6, z: 1.2 },
  },
  {
    id: 'm14',
    roomId: 'hallway',
    roomName: 'Hallway',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/hall1/400/300',
    capturedAt: makeDate(8),
    finding: 'Clear',
    severity: 'None',
    notes: '',
    addedToReport: false,
    coordinates: { x: 2.1, y: 3.5, z: 1.2 },
  },
];

const HOME_LIST: HomeSummary[] = [
  {
    id: 'elmwood',
    address: '142 Elmwood Drive, Summit, NJ',
    photoUrl: 'https://picsum.photos/seed/elmwood-home/900/600',
  },
  {
    id: 'maple',
    address: '88 Maple Court, Princeton, NJ',
    photoUrl: 'https://picsum.photos/seed/maple-home/900/600',
  },
  {
    id: 'birchwood',
    address: '310 Birchwood Lane, Westfield, NJ',
    photoUrl: 'https://picsum.photos/seed/birchwood-home/900/600',
  },
];

function cloneMediaForHome(homeId: string, seedPrefix: string, offsetMinutes: number) {
  return INITIAL_MEDIA.map((item, index) => ({
    ...item,
    id: `${homeId}-${item.id}`,
    thumbnailUrl: `https://picsum.photos/seed/${seedPrefix}-${item.id}/400/300`,
    capturedAt: makeDate(offsetMinutes + index),
  }));
}

const MEDIA_BY_HOME: Record<string, MediaItem[]> = {
  elmwood: INITIAL_MEDIA,
  maple: cloneMediaForHome('maple', 'maple', 20),
  birchwood: cloneMediaForHome('birchwood', 'birchwood', 40),
};

function buildRoomFindings(media: MediaItem[]) {
  return ROOMS.map((room) => {
    const items = media.filter(
      (m) => m.roomId === room.id && (m.finding !== 'Clear' || m.addedToReport)
    );
    const flagged = items.filter((m) => m.finding === 'Flagged');
    const attn = items.filter((m) => m.finding === 'Needs Attention');
    const severity =
      flagged.length > 0 ? 'High' : attn.length > 0 ? 'Medium' : items.length > 0 ? 'Low' : 'None';
    return { roomId: room.id, roomName: room.name, severity, items } as const;
  }).filter((r) => r.items.length > 0);
}

const INITIAL_REPORTS: Report[] = [
  {
    id: 'r1',
    propertyAddress: '142 Elmwood Drive, Summit, NJ',
    inspectionDate: new Date('2025-05-20T10:30:00'),
    agentName: 'Sarah Chen',
    status: 'Ready',
    totalRooms: 6,
    photosCount: 11,
    videosCount: 3,
    findingsFlagged: 3,
    roomFindings: buildRoomFindings(INITIAL_MEDIA),
    flightSummary: {
      totalFlightTime: '14m 32s',
      batteryUsed: 38,
      beaconsDeployed: 4,
    },
  },
  {
    id: 'r2',
    propertyAddress: '88 Maple Court, Princeton, NJ',
    inspectionDate: new Date('2025-05-14T14:00:00'),
    agentName: 'Sarah Chen',
    status: 'Sent',
    totalRooms: 5,
    photosCount: 9,
    videosCount: 2,
    findingsFlagged: 1,
    roomFindings: [],
    flightSummary: {
      totalFlightTime: '11m 08s',
      batteryUsed: 29,
      beaconsDeployed: 4,
    },
  },
  {
    id: 'r3',
    propertyAddress: '310 Birchwood Lane, Westfield, NJ',
    inspectionDate: new Date('2025-05-28T09:15:00'),
    agentName: 'Sarah Chen',
    status: 'Draft',
    totalRooms: 7,
    photosCount: 14,
    videosCount: 4,
    findingsFlagged: 5,
    roomFindings: [],
    flightSummary: {
      totalFlightTime: '18m 45s',
      batteryUsed: 47,
      beaconsDeployed: 4,
    },
  },
];

export function useInspectionData() {
  const [mediaByHomeId, setMediaByHomeId] = useState<Record<string, MediaItem[]>>(MEDIA_BY_HOME);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>('r1');

  const updateMediaItem = useCallback(
    (
      homeId: string,
      id: string,
      updates: Partial<Pick<MediaItem, 'finding' | 'severity' | 'notes' | 'addedToReport' | 'roomId' | 'roomName'>>
    ) => {
      setMediaByHomeId((prev) => ({
        ...prev,
        [homeId]: (prev[homeId] ?? []).map((m) => (m.id === id ? { ...m, ...updates } : m)),
      }));
    },
    []
  );

  const deleteMediaItem = useCallback((homeId: string, id: string) => {
    setMediaByHomeId((prev) => ({
      ...prev,
      [homeId]: (prev[homeId] ?? []).filter((m) => m.id !== id),
    }));
  }, []);

  const generateReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'Ready' } : r))
    );
  }, []);

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? reports[0];

  return {
    homes: HOME_LIST,
    mediaByHomeId,
    rooms: ROOMS,
    reports,
    selectedReport,
    selectedReportId,
    setSelectedReportId,
    updateMediaItem,
    deleteMediaItem,
    generateReport,
  };
}
