export interface RecordAudioProps {
  children: React.ReactNode;
  recordInProgressDisplay: React.ReactNode;
  resume?: React.ReactNode;
  pause?: React.ReactNode;
  onRecordingStarted?: () => void;
  onRecordingPaused?: () => void;
  onRecordingResumed?: () => void;
  onFinish: (audioUrl: string) => void;
  displayPlayer?: boolean;
  pausePlay?: boolean;
}
