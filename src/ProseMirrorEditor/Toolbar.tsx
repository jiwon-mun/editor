import { toggleMark } from "prosemirror-commands";
import type { MarkType } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

interface ToolbarProps {
  editorView: EditorView | null;
  editorState: EditorState | null;
}

export function Toolbar({ editorView, editorState }: ToolbarProps) {
  if (!editorView || !editorState) return null;

  const { schema, selection, storedMarks } = editorState;

  const isMarkActive = (markType: MarkType) => {
    const { from, $from, to, empty } = selection;
    if (empty) {
      return !!markType.isInSet(storedMarks || $from.marks());
    } else {
      return editorState.doc.rangeHasMark(from, to, markType);
    }
  };

  const toggleMarkCommand = (markType: MarkType) => {
    toggleMark(markType)(editorState, editorView!.dispatch);
    editorView!.focus();
  };

  const insertImageCommand = (src: string) => {
    return function (state: EditorState, dispatch: (tr: Transaction) => void) {
      const { schema } = state;
      const node = schema.nodes.image.create({ src });
      const transaction = state.tr.replaceSelectionWith(node);
      dispatch(transaction.scrollIntoView());
      return true;
    };
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMarkCommand(schema.marks.strong);
        }}
        style={{
          fontWeight: isMarkActive(schema.marks.strong) ? "bold" : "normal",
        }}
      >
        B
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMarkCommand(schema.marks.em);
        }}
        style={{
          fontStyle: isMarkActive(schema.marks.em) ? "italic" : "normal",
        }}
      >
        I
      </button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        id="image-upload"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !editorView || !editorState) return;

          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string; // base64 or blob URL
            insertImageCommand(src)(editorState, editorView.dispatch);
            editorView.focus();
          };
          reader.readAsDataURL(file); // 또는 URL.createObjectURL(file) 사용
        }}
      />

      <label htmlFor="image-upload">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            document.getElementById("image-upload")?.click();
          }} // 기본 에디터 포커스 방지
        >
          🖼 업로드
        </button>
      </label>
    </div>
  );
}
