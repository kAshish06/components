import Tree from "./components/Tree/Tree";
import { treeData } from "./components/Tree/mock";
import Dropdown from "./components/Dropdown/Dropdown";
import { options } from "./components/Dropdown/mock";
import RecordAudio from "./components/RecordAudio/RecordAudio";
import "./App.css";

function App() {
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
      <RecordAudio recordInProgressDisplay={<span>recording...</span>}>
        <span>Record</span>
      </RecordAudio>
    </>
  );
}

export default App;
