import React from "react";
import recorder from "./recorder";

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
  const [audioUrl, setAudioUrl] = React.useState("");
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const intervalRef = React.useRef<number>(undefined);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    recorder((recordedAudioUrl: string) => {
      setAudioUrl(recordedAudioUrl);
    })
      .then((mediaRecorder) => {
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch(() => {
        console.log("something went wrong");
      });
  }, []);
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
    /** Initiate Recorder */
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
    }
  };
  const handleStop = () => {
    mediaRecorderRef.current?.stop();
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
      {audioUrl && (
        <>
          <audio ref={audioRef}>
            <source src={audioUrl} type="audio/ogg" />
          </audio>
          <button onClick={() => audioRef.current?.play()}>Play</button>
        </>
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
