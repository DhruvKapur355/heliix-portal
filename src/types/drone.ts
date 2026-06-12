export type MissionState = 'ACTIVE' | 'PAUSED' | 'ABORTED' | 'COMPLETE' | 'RETURNING';

export interface DronePosition {
  x: number;
  y: number;
  room: string;
}

export interface DroneState {
  position: DronePosition;
  trail: { x: number; y: number }[];
  missionState: MissionState;
  flightTime: number; // seconds
  battery: number; // percent
  roomsCompleted: number;
  totalRooms: number;
  photosInCurrentRoom: number;
  videosInCurrentRoom: number;
  currentRoomCoords: { x: number; y: number; z: number };
  statusLine: string;
}

export interface EventLogEntry {
  id: string;
  timestamp: Date;
  message: string;
}

export interface Room {
  id: string;
  name: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface BeaconMarker {
  id: string;
  x: number;
  y: number;
}

export interface WaypointNode {
  x: number;
  y: number;
  room: string;
  photos: number;
  videos: number;
  dwell: number; // ms
}
