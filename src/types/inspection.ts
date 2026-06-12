export type FindingTag = 'Clear' | 'Needs Attention' | 'Flagged';
export type Severity = 'None' | 'Low' | 'Medium' | 'High';
export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  roomId: string;
  roomName: string;
  type: MediaType;
  thumbnailUrl: string;
  capturedAt: Date;
  finding: FindingTag;
  severity: Severity;
  notes: string;
  addedToReport: boolean;
  duration?: string; // video only
  coordinates: { x: number; y: number; z: number };
}
