import React, { useReducer } from "react";
const RECORDER_STATE = {
  RECORDING: "RECORDING",
  PAUSED: "PAUSED",
  IDLE: "IDLE",
};
const actions = {
  START: "START",
  STOP: "STOP",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
};

const recorderStateReducer = (
  prevState: string,
  action: { type: string }
): string => {
  switch (action.type) {
    case actions.START: {
      return RECORDER_STATE.RECORDING;
    }
    case actions.STOP: {
      return RECORDER_STATE.IDLE;
    }
    case actions.PAUSE: {
      return RECORDER_STATE.PAUSED;
    }
    case actions.RESUME: {
      return RECORDER_STATE.RECORDING;
    }
    default: {
      return RECORDER_STATE.IDLE;
    }
  }
};
export function useRecorder(
  onStop: (audioUrl: string) => void,
  { mimeType }: { mimeType: string } = { mimeType: "audio/webm" }
) {
  const [recorderState, dispatch] = useReducer(recorderStateReducer, "idle");
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const audioChunksRef = React.useRef<Blob[]>(null);
  const mediaStreamRef = React.useRef<MediaStream>(null);

  React.useEffect(() => {
    return () => {
      recorderCleanup();
    };
  }, []);
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
    dispatch({ type: actions.START });
  }, [createRecorder]);

  const stop = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      dispatch({ type: actions.STOP });
    }
  }, []);

  const pause = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      dispatch({ type: actions.PAUSE });
    }
  }, []);

  const resume = React.useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      dispatch({ type: actions.RESUME });
    }
  }, []);

  const recorderFunctions = React.useMemo(
    () => ({ recorderState, start, stop, pause, resume }),
    [recorderState, pause, resume, start, stop]
  );
  return recorderFunctions;
}

export default useRecorder;
