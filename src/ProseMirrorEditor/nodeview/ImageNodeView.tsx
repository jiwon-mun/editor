import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import "./css.css";

export class ImageNodeView implements NodeView {
  dom: HTMLElement;
  node: ProseMirrorNode;
  view: EditorView;
  getPos: () => number | undefined;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    const wrapper = document.createElement("span");
    wrapper.className = "pm-image-wrapper";

    const img = document.createElement("img");
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("alt", node.attrs.alt || "");
    img.setAttribute("title", node.attrs.title || "");
    if (node.attrs.width) img.style.width = `${node.attrs.width}px`;
    if (node.attrs.height) img.style.height = `${node.attrs.height}px`;

    wrapper.appendChild(img);

    // 🔹 4개의 resize 핸들 생성
    ["top-left", "top-right", "bottom-left", "bottom-right"].forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${pos}`;
      wrapper.appendChild(handle);

      handle.addEventListener("mousedown", (startEvent) => {
        startEvent.preventDefault();

        const startX = startEvent.clientX;
        const startY = startEvent.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;
        const aspectRatio = startWidth / startHeight;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const diffX = moveEvent.clientX - startX;
          const diffY = moveEvent.clientY - startY;

          let newWidth = startWidth + diffX;
          let newHeight = startHeight + diffY;

          // 👇 Shift 키가 눌려 있다면 비율 고정
          if (moveEvent.shiftKey) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
              newHeight = newWidth / aspectRatio;
            } else {
              newWidth = newHeight * aspectRatio;
            }
          }

          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);

          const newWidth = img.offsetWidth;
          const newHeight = img.offsetHeight;

          const pos = this.getPos();
          if (!pos) return;

          const tr = view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            width: newWidth,
            height: newHeight,
          });
          view.dispatch(tr);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });
    console.log("wrapper::", wrapper);

    this.dom = wrapper;
  }

  selectNode() {
    this.dom.classList.add("ProseMirror-selectednode");
  }

  deselectNode() {
    this.dom.classList.remove("ProseMirror-selectednode");
  }
}
