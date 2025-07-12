import { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { customSchema } from "./schema";
import "./viewer.css";
export default function ProseMirrorViewer() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const jsonString = localStorage.getItem("prosemirror-doc");
    if (!jsonString) {
      alert("저장된 문서가 없습니다.");
      return;
    }

    const docJson = JSON.parse(jsonString);

    const state = EditorState.create({
      doc: customSchema.nodeFromJSON(docJson),
      schema: customSchema,
      plugins: [], // 편집 기능 끔
    });

    const view = new EditorView(editorRef.current, {
      state,
      editable: () => false, // 읽기 전용
    });

    setView(view);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", border: "1px solid blue" }}>
      <h3>뷰어 모드 (읽기 전용)</h3>
      <div style={{ width: "100%", height: "500px" }} ref={editorRef} />
    </div>
  );
}
