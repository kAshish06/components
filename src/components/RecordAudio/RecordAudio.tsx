import React from "react";

type Props = {
  children: React.ReactNode;
  recordInProgressDisplay: React.ReactNode;
};
export default function RecordAudio({
  children,
  recordInProgressDisplay,
}: Props) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState("");
  const intervalRef = React.useRef<number>(undefined);
  const startTimeRef = React.useRef<number>(Date.now());
  const handleRecord = () => {
    setIsRecording(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTimeRef.current;
      const formattedElapsedTime = formatElapsedTime(elapsedTime);
      setElapsedTime(formattedElapsedTime);
    }, 1000);
  };
  const handleStop = () => {
    startTimeRef.current = Date.now();
    clearInterval(intervalRef.current);
    setIsRecording(false);
  };
  return (
    <div>
      {isRecording ? (
        <div>
          {recordInProgressDisplay}
          <span>{elapsedTime}</span>
          <button onClick={handleStop}>Stop</button>
        </div>
      ) : (
        <button onClick={handleRecord}>{children}</button>
      )}
    </div>
  );
}

function formatElapsedTime(time: number) {
  const seconds = Math.floor(time / 1000) % 60;
  const minutes = Math.floor(time / 1000 / 60);
  const hours = Math.floor(time / 1000 / 3600);
  let formattedValue = "";
  if (hours) {
    formattedValue += `${hours}:`;
  }
  return (formattedValue += `${minutes}:${seconds}`);
}
