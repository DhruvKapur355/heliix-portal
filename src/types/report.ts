import type { MediaItem } from './inspection';

export type ReportStatus = 'Draft' | 'Ready' | 'Sent';

export interface RoomFinding {
  roomId: string;
  roomName: string;
  severity: 'None' | 'Low' | 'Medium' | 'High';
  items: MediaItem[];
}

export interface FlightSummary {
  totalFlightTime: string;
  batteryUsed: number;
  beaconsDeployed: number;
  pathThumbnail?: string;
}

export interface Report {
  id: string;
  propertyAddress: string;
  inspectionDate: Date;
  agentName: string;
  status: ReportStatus;
  totalRooms: number;
  photosCount: number;
  videosCount: number;
  findingsFlagged: number;
  roomFindings: RoomFinding[];
  flightSummary: FlightSummary;
}
