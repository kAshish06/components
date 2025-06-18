import React from "react";

type Props = {
  children: React.ReactNode;
  recordInProgressDisplay: React.ReactNode;
  play?: React.ReactNode;
  pause?: React.ReactNode;
};
export default function RecordAudio({
  children,
  recordInProgressDisplay,
  play = <span>Play</span>,
  pause = <span>Pause</span>,
}: Props) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const intervalRef = React.useRef<number>(undefined);
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };
  const stopTime = () => {
    clearInterval(intervalRef.current);
  };
  const handleRecord = () => {
    setIsRecording(true);
    startTimer();
    setElapsedTime(0);
  };
  const handleStop = () => {
    stopTime();
    setIsRecording(false);
  };
  const handlePlayPause = () => {
    if (isPaused) {
      startTimer();
    } else {
      stopTime();
    }
    setIsPaused((prev) => !prev);
  };
  return (
    <div>
      {isRecording ? (
        <div>
          {recordInProgressDisplay}
          <span>{formatElapsedTime(elapsedTime)}</span>
          <button onClick={handlePlayPause}>{isPaused ? play : pause}</button>
          <button onClick={handleStop}>Stop</button>
        </div>
      ) : (
        <button onClick={handleRecord}>{children}</button>
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
