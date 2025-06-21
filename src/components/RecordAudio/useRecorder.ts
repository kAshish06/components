import React from "react";

export default function useRecorder(
  onStop: (audioUrl: string) => void,
  { mimeType }: { mimeType: string } = { mimeType: "audio/webm" }
) {
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const audioChunksRef = React.useRef<Blob[]>(null);
  const mediaStreamRef = React.useRef<MediaStream>(null);
  const recorderCleanup = () => {
    mediaStreamRef.current
      ?.getTracks()
      .forEach((track: MediaStreamTrack) => track.stop());
    mediaStreamRef.current = null;
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current = null;
    }
  };
  const createRecorder = React.useCallback(async () => {
    let audioUrl: string;
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const recorder = new MediaRecorder(audioStream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current?.push(e.data);
      }
    };
    recorder.onstop = () => {
      if (audioChunksRef.current) {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        audioUrl = URL.createObjectURL(audioBlob);
        onStop(audioUrl);
        audioChunksRef.current = [];
        recorderCleanup();
      }
    };
    return { recorder, audioStream };
  }, [onStop, mimeType]);
  const start = React.useCallback(async () => {
    const { recorder, audioStream } = await createRecorder();
    mediaRecorderRef.current = recorder;
    mediaStreamRef.current = audioStream;
    if (mediaRecorderRef.current) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
  }, [createRecorder]);
  const stop = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, []);
  const pause = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
    }
  }, []);
  const resume = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
    }
  }, []);

  const recorderFunctions = React.useMemo(
    () => ({ start, stop, pause, resume }),
    [pause, resume, start, stop]
  );
  return recorderFunctions;
}
