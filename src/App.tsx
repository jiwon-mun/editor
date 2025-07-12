import ProseMirrorEditor from "./ProseMirrorEditor/ProseMirrorEditor";

function App() {
  return (
    <div>
      <h1>Editor</h1>
      <div style={{ width: "100%", height: "100%" }}>
        <ProseMirrorEditor />
      </div>
    </div>
  );
}

export default App;
