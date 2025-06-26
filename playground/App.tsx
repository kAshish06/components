import React from "react";
import Tree from "./components/Tree/Tree";
import { treeData } from "./components/Tree/mock";
import Dropdown from "./components/Dropdown/Dropdown";
import { options } from "./components/Dropdown/mock";
import RecordAudio from "./components/RecordAudio/RecordAudio";
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
