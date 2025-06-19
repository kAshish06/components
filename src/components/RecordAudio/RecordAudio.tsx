import React from "react";
import useRecorder from "./useRecorder";
import "./ReacordAudio.scss";
type Props = {
  children: React.ReactNode;
  recordInProgressDisplay: React.ReactNode;
  resume?: React.ReactNode;
  pause?: React.ReactNode;
  onFinish: (audioUrl: string) => void;
  displayPlayer?: boolean;
};
export default function RecordAudio({
  children,
  recordInProgressDisplay,
  resume = <span>Play</span>,
  pause = <span>Pause</span>,
  onFinish,
  displayPlayer = false,
}: Props) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [audioUrl, setAudioUrl] = React.useState("");
  const handleRecording = React.useCallback((recordedAudioUrl: string) => {
    setAudioUrl(recordedAudioUrl);
    onFinish(recordedAudioUrl);
  }, []);
  const {
    start,
    stop,
    pause: pauseRecorder,
    resume: resumeRecorder,
  } = useRecorder(handleRecording);
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
    } else {
      pauseRecorder();
      stopTime();
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
          <span>{formatElapsedTime(elapsedTime)}</span>
          <button onClick={handlePlayPause}>{isPaused ? resume : pause}</button>
          <button onClick={handleStop}>Stop</button>
        </div>
      ) : (
        <button onClick={handleRecord}>{children}</button>
      )}
      {displayPlayer && audioUrl && (
        <div>
          <audio ref={audioRef}>
            <source src={audioUrl} type="audio/ogg" />
          </audio>
          <button onClick={() => audioRef.current?.play()}>Play</button>
        </div>
      )}
    </div>
  );
}

function formatElapsedTime(time: number) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const hours = Math.floor(time / 3600);
  let formattedValue = "";
  if (hours) {
    formattedValue += `${hours}:`;
  }
  return (formattedValue += `${minutes}:${seconds}`);
}
