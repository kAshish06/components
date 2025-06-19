export default async function recorder(
  onStop: (audioUrl: string) => void
): Promise<MediaRecorder> {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const recorder = new MediaRecorder(audioStream);
    const audioChunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      onStop(audioUrl);
    };
    return recorder;
  } catch (e) {
    console.log(e);
    throw "something went wrong.";
  }
}
