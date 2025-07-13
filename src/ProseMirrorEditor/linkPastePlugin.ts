import { Plugin } from "prosemirror-state";
import { insertPreviewCommand } from "./commands/insertPreviewCommand";

export const linkPastePlugin = new Plugin({
  props: {
    handlePaste(view, event, slice) {
      console.log("handlePaste1");
      const text = event.clipboardData?.getData("text/plain");
      console.log("handlePaste2");

      if (!text || !isValidHttpUrl(text)) return false;
      console.log("handlePaste3");

      // 임시: 정적 메타데이터로 테스트 (실제에선 API 호출)
      const previewData = {
        url: text,
        title: "링크 제목입니다",
        description: "설명 텍스트입니다",
        image: "https://via.placeholder.com/150",
      };

      insertPreviewCommand(previewData)(view.state, view.dispatch);
      return true;
    },
  },
});

// URL 유효성 검증
function isValidHttpUrl(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
