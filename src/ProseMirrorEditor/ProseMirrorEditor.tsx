import { useRef, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { Toolbar } from "./Toolbar";
import { customSchema } from "./schema";
import { ImageNodeView } from "./nodeview/ImageNodeView";

export default function ProseMirrorEditor() {
  const [view, setView] = useState<EditorView | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      schema: customSchema,
      plugins: [keymap(baseKeymap)],
    });

    const view = new EditorView(editorRef.current, {
      state,
      nodeViews: {
        image: (node, view, getPos) => new ImageNodeView(node, view, getPos),
      },
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        setEditorState(newState);
      },
    });

    setView(view);
    setEditorState(state);

    return () => {
      view.destroy();
    };
  }, []);

  const saveDocument = () => {
    if (!view) return;
    const json = view.state.doc.toJSON();
    localStorage.setItem("prosemirror-doc", JSON.stringify(json));
    alert("문서가 localStorage에 저장되었습니다!");
  };

  return (
    <>
      <Toolbar editorView={view} editorState={editorState} />
      <button onClick={saveDocument} style={{ marginBottom: 8 }}>
        저장하기
      </button>
      <div
        onClick={() => {
          view?.focus();
        }}
        style={{ width: "100%", height: "100%", border: "1px solid red" }}
      >
        {/* editorView와 editorState 둘 다 전달 */}
        <div style={{ width: "100%", height: "300px" }} ref={editorRef} />
      </div>
    </>
  );
}
