import React from "react";
// import { Tree } from "@components/tree";
// import { treeData } from "@components/tree/mock";
import { Dropdown, options } from "@components/Dropdown";
import { RecordAudio } from "@components/RecordAudio";
import "./App.css";

function App() {
  const [recordedAudio, setRecordedAudio] = React.useState("");
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const handleAudio = (audio: string) => {
    setRecordedAudio(audio);
  };

  return (
    <>
      {/* <Tree data={treeData} selectable={true} /> */}
      <Dropdown
        options={options}
        labelKey="label"
        valueKey="value"
        selected={options[0]}
      />
      <div>Testing</div>
      <RecordAudio
        recordInProgressDisplay={<span>recording...</span>}
        onFinish={handleAudio}
      >
        <span>{">"}</span>
      </RecordAudio>
      {recordedAudio && (
        <div>
          <audio ref={audioRef}>
            <source src={recordedAudio} type="audio/ogg" />
          </audio>
          <button onClick={() => audioRef.current?.play()}>Play</button>
        </div>
      )}
    </>
  );
}

export default App;
