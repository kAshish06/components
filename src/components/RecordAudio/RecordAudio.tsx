import React from "react";
import useRecorder from "./useRecorder";
import "./ReacordAudio.scss";
type Props = {
  children: React.ReactNode;
  recordInProgressDisplay: React.ReactNode;
  resumeButton?: React.ReactNode;
  pauseButton?: React.ReactNode;
  stopButton?: React.ReactNode;
  onRecordingStarted?: () => void;
  onRecordingPaused?: () => void;
  onRecordingResumed?: () => void;
  onFinish: (audioUrl: string) => void;
  displayPlayer?: boolean;
  showPauseResumeButton?: boolean;
  mimeType?: string;
};
export default function RecordAudio({
  children,
  recordInProgressDisplay,
  resumeButton = <span>Play</span>,
  pauseButton = <span>Pause</span>,
  stopButton = <span>Stop</span>,
  onRecordingStarted,
  onRecordingPaused,
  onRecordingResumed,
  onFinish,
  displayPlayer = false,
  showPauseResumeButton = false,
  mimeType = "audio/webm",
}: Props) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [audioUrl, setAudioUrl] = React.useState("");
  const handleRecording = React.useCallback(
    (recordedAudioUrl: string) => {
      setAudioUrl(recordedAudioUrl);
      onFinish(recordedAudioUrl);
    },
    [onFinish]
  );
  const {
    start,
    stop,
    pause: pauseRecorder,
    resume: resumeRecorder,
  } = useRecorder(handleRecording, { mimeType });
  const intervalRef = React.useRef<number>(undefined);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };
  const stopTime = () => {
    clearInterval(intervalRef.current);
  };
  const handleRecord = async () => {
    setIsRecording(true);
    startTimer();
    setElapsedTime(0);
    setAudioUrl("");
    /** Initiate Recorder */
    start();
    if (typeof onRecordingStarted === "function") {
      onRecordingStarted();
    }
  };
  const handleStop = () => {
    stop();
    stopTime();
    setIsRecording(false);
  };
  const handlePlayPause = () => {
    if (isPaused) {
      resumeRecorder();
      startTimer();
      if (typeof onRecordingResumed === "function") {
        onRecordingResumed();
      }
    } else {
      pauseRecorder();
      stopTime();
      if (typeof onRecordingPaused === "function") {
        onRecordingPaused();
      }
    }
    setIsPaused((prev) => !prev);
  };
  return (
    <div className="record-audio-container">
      {isRecording ? (
        <div className="recording-container">
          <div className="recording-display-slot">
            {recordInProgressDisplay}
          </div>
          <span className="recording-time">
            {formatElapsedTime(elapsedTime)}
          </span>
          {showPauseResumeButton && (
            <button
              aria-label={`${isPaused ? "Resume" : "Pause"}`}
              onClick={handlePlayPause}
            >
              {isPaused ? resumeButton : pauseButton}
            </button>
          )}
          <button aria-label="Stop Recording" onClick={handleStop}>
            {stopButton}
          </button>
        </div>
      ) : (
        <button aria-label="Record Audio" onClick={handleRecord}>
          {children}
        </button>
      )}
      {displayPlayer && audioUrl && (
        <div>
          <audio ref={audioRef}>
            <source src={audioUrl} type={mimeType} />
          </audio>
          <button
            aria-label="Play Recorded Audio"
            onClick={() => audioRef.current?.play()}
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
}

function formatElapsedTime(time: number) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time % 3600) / 60);
  const hours = Math.floor(time / 3600);
  let formattedValue = "";
  if (hours) {
    formattedValue += `${hours}:`;
  }
  return (formattedValue += `${minutes >= 10 ? minutes : `0${minutes}`}:${
    seconds >= 10 ? seconds : `0${seconds}`
  }`);
}
