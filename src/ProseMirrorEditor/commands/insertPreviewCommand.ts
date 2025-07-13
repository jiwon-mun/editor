import type { EditorState, Transaction } from "prosemirror-state";
import type { Command } from "prosemirror-state";

export function insertPreviewCommand(attrs: {
  url: string;
  title: string;
  description: string;
  image: string;
}): Command {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { schema } = state;
    const node = schema.nodes.preview.create(attrs);
    const tr = state.tr.replaceSelectionWith(node);

    if (dispatch) dispatch(tr.scrollIntoView());
    return true;
  };
}
