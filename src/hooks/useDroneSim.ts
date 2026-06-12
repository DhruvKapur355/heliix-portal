import { useState, useEffect, useRef, useCallback } from 'react';
import type { DroneState, EventLogEntry, WaypointNode, MissionState } from '../types/drone';

const WAYPOINTS: WaypointNode[] = [
  { x: 120, y: 200, room: 'Hallway', photos: 2, videos: 0, dwell: 1200 },
  { x: 160, y: 200, room: 'Hallway', photos: 0, videos: 0, dwell: 800 },
  { x: 200, y: 160, room: 'Living Room', photos: 3, videos: 1, dwell: 2000 },
  { x: 260, y: 140, room: 'Living Room', photos: 2, videos: 0, dwell: 1500 },
  { x: 300, y: 160, room: 'Living Room', photos: 1, videos: 0, dwell: 1000 },
  { x: 330, y: 200, room: 'Kitchen', photos: 3, videos: 1, dwell: 2000 },
  { x: 360, y: 230, room: 'Kitchen', photos: 2, videos: 0, dwell: 1200 },
  { x: 330, y: 280, room: 'Kitchen', photos: 1, videos: 0, dwell: 800 },
  { x: 260, y: 300, room: 'Master Bedroom', photos: 4, videos: 1, dwell: 2500 },
  { x: 200, y: 310, room: 'Master Bedroom', photos: 2, videos: 0, dwell: 1500 },
  { x: 160, y: 300, room: 'Master Bedroom', photos: 1, videos: 0, dwell: 1000 },
  { x: 130, y: 290, room: 'Bedroom 2', photos: 3, videos: 1, dwell: 2000 },
  { x: 110, y: 270, room: 'Bedroom 2', photos: 2, videos: 0, dwell: 1200 },
  { x: 120, y: 250, room: 'Bedroom 2', photos: 1, videos: 0, dwell: 800 },
  { x: 150, y: 240, room: 'Bathroom', photos: 2, videos: 0, dwell: 1500 },
  { x: 170, y: 230, room: 'Bathroom', photos: 2, videos: 0, dwell: 1200 },
  { x: 160, y: 215, room: 'Bathroom', photos: 1, videos: 0, dwell: 800 },
  { x: 140, y: 210, room: 'Hallway', photos: 0, videos: 0, dwell: 600 },
  { x: 120, y: 200, room: 'Hallway', photos: 0, videos: 0, dwell: 600 },
];

const ROOM_ESTIMATED_TIMES: Record<string, number> = {
  Hallway: 1,
  'Living Room': 3,
  Kitchen: 2,
  'Master Bedroom': 4,
  'Bedroom 2': 3,
  Bathroom: 2,
};

const EVENT_POOL = [
  (room: string) => `Entered ${room}`,
  (room: string) => `Photo captured in ${room}`,
  (_room: string) => 'Photo captured — possible water stain flagged',
  (room: string) => `Scanning ${room} — measuring dimensions`,
  (_room: string) => 'Battery at 60%',
  (room: string) => `${room} scan complete — 8 photos taken`,
  (_room: string) => 'Returning to hallway checkpoint',
  (room: string) => `Video segment started in ${room}`,
  (_room: string) => 'Beacon B3 signal strong',
  (room: string) => `Mapping complete for ${room}`,
  (_room: string) => 'Auto-adjusting altitude for ceiling height',
  (_room: string) => 'Photo captured — ceiling corner detail logged',
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

let eventIdCounter = 100;

function makeEventId() {
  return `evt-${++eventIdCounter}`;
}

export function useDroneSim() {
  const CYCLE_MS = 15000;
  const startTimeRef = useRef(Date.now());
  const animRef = useRef<number | null>(null);
  const lastEventTimeRef = useRef(0);
  const lastRoomRef = useRef('');

  const [state, setState] = useState<DroneState>({
    position: { x: WAYPOINTS[0].x, y: WAYPOINTS[0].y, room: 'Hallway' },
    trail: [],
    missionState: 'ACTIVE',
    flightTime: 0,
    battery: 85,
    roomsCompleted: 0,
    totalRooms: 6,
    photosInCurrentRoom: 0,
    videosInCurrentRoom: 0,
    currentRoomCoords: { x: 0.0, y: 0.0, z: 1.2 },
    statusLine: 'Drone is scanning Hallway — estimated 1 min remaining',
  });

  const [events, setEvents] = useState<EventLogEntry[]>([
    {
      id: makeEventId(),
      timestamp: new Date(),
      message: 'Mission started — flying to first beacon',
    },
    {
      id: makeEventId(),
      timestamp: new Date(Date.now() - 4000),
      message: 'Entered Hallway',
    },
    {
      id: makeEventId(),
      timestamp: new Date(Date.now() - 8000),
      message: 'All beacons locked — B1 B2 B3 B4',
    },
  ]);

  const [missionState, setMissionState] = useState<MissionState>('ACTIVE');
  const missionStateRef = useRef<MissionState>('ACTIVE');

  const addEvent = useCallback((message: string) => {
    setEvents((prev) => [
      { id: makeEventId(), timestamp: new Date(), message },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const pauseMission = useCallback(() => {
    missionStateRef.current = 'PAUSED';
    setMissionState('PAUSED');
    addEvent('Mission paused by agent');
  }, [addEvent]);

  const resumeMission = useCallback(() => {
    missionStateRef.current = 'ACTIVE';
    setMissionState('ACTIVE');
    addEvent('Mission resumed');
  }, [addEvent]);

  const abortMission = useCallback(() => {
    missionStateRef.current = 'ABORTED';
    setMissionState('ABORTED');
    addEvent('Mission aborted — drone holding position');
  }, [addEvent]);

  const returnToStart = useCallback(() => {
    missionStateRef.current = 'RETURNING';
    setMissionState('RETURNING');
    addEvent('Returning to start position');
  }, [addEvent]);

  useEffect(() => {
    const tick = () => {
      if (missionStateRef.current === 'PAUSED' || missionStateRef.current === 'ABORTED') {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = (Date.now() - startTimeRef.current) % CYCLE_MS;
      const progress = elapsed / CYCLE_MS;

      const totalSegments = WAYPOINTS.length - 1;
      const segmentProgress = progress * totalSegments;
      const segIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
      const segT = segmentProgress - segIndex;

      const from = WAYPOINTS[segIndex];
      const to = WAYPOINTS[Math.min(segIndex + 1, WAYPOINTS.length - 1)];

      const x = lerp(from.x, to.x, segT);
      const y = lerp(from.y, to.y, segT);
      const room = from.room;

      const wallTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const battery = Math.max(20, 85 - wallTime * 0.05);

      const roomOrder = ['Hallway', 'Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bathroom'];
      const currentRoomIdx = roomOrder.indexOf(room);
      const roomsCompleted = Math.max(0, currentRoomIdx - 1);

      const estMin = ROOM_ESTIMATED_TIMES[room] ?? 2;
      const statusLine =
        missionStateRef.current === 'RETURNING'
          ? 'Drone is returning to start position'
          : `Drone is mapping ${room} — estimated ${estMin} min remaining`;

      setState((prev) => {
        const newTrail = [...prev.trail, { x: prev.position.x, y: prev.position.y }].slice(-40);
        return {
          ...prev,
          position: { x, y, room },
          trail: newTrail,
          missionState: missionStateRef.current,
          flightTime: wallTime,
          battery,
          roomsCompleted,
          photosInCurrentRoom: from.photos,
          videosInCurrentRoom: from.videos,
          currentRoomCoords: {
            x: parseFloat((x / 100).toFixed(2)),
            y: parseFloat((y / 100).toFixed(2)),
            z: 1.2,
          },
          statusLine,
        };
      });

      const now = Date.now();
      if (now - lastEventTimeRef.current > 8500) {
        lastEventTimeRef.current = now;
        if (room !== lastRoomRef.current) {
          lastRoomRef.current = room;
          addEvent(`Entered ${room}`);
        } else {
          const fn = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
          addEvent(fn(room));
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [addEvent]);

  return {
    state: { ...state, missionState },
    events,
    pauseMission,
    resumeMission,
    abortMission,
    returnToStart,
  };
}
