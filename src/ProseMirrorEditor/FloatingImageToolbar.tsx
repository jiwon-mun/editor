// FloatingImageToolbar.tsx
import { useEffect, useRef, useState } from "react";
import type { EditorView } from "prosemirror-view";
import type { Node as ProseMirrorNode } from "prosemirror-model";

interface FloatingImageToolbarProps {
  editorView: EditorView;
  imageNode: ProseMirrorNode;
  getPos: () => number;
}

export function FloatingImageToolbar({
  editorView,
  imageNode,
  getPos,
}: FloatingImageToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const dom = editorView.domAtPos(getPos()).node as HTMLElement;
    if (!dom || !toolbarRef.current) return;

    const rect = dom.getBoundingClientRect();
    const toolbarWidth = 200;
    const toolbarHeight = 48;

    setCoords({
      top: rect.top + window.scrollY - toolbarHeight - 8, // 이미지 위 8px 띄움
      left: rect.left + window.scrollX + rect.width / 2 - toolbarWidth / 2,
    });
  }, [imageNode, getPos, editorView]);

  return (
    <div
      ref={toolbarRef}
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        width: 200,
        padding: 8,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <button>🔗 링크 삽입</button>
      <button>📏 사이즈 설정</button>
      <button>⛶ 전체 너비</button>
    </div>
  );
}
