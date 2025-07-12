import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import "./css.css";

export class ImageNodeView implements NodeView {
  dom: HTMLElement;
  node: ProseMirrorNode;
  view: EditorView;
  getPos: () => number | undefined;

  toolbar: HTMLDivElement;

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
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    // 수정: href가 있으면 <a> 태그로 감싸기
    let imgContainer: HTMLElement;

    const img = document.createElement("img");
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("alt", node.attrs.alt || "");
    img.setAttribute("title", node.attrs.title || "");

    // width, height가 숫자이거나 문자열일 수 있으니 스타일에 맞게 처리
    if (node.attrs.width) {
      img.style.width =
        typeof node.attrs.width === "number"
          ? `${node.attrs.width}px`
          : node.attrs.width;
    }
    if (node.attrs.height) {
      img.style.height =
        typeof node.attrs.height === "number"
          ? `${node.attrs.height}px`
          : node.attrs.height;
    }

    if (node.attrs.href) {
      const link = document.createElement("a"); // 수정
      link.href = node.attrs.href; // 수정
      link.target = "_blank"; // 수정
      link.rel = "noopener noreferrer"; // 수정
      link.appendChild(img);
      link.classList.add("prosemirror-image-link");

      link.addEventListener("click", (event) => {
        // 에디터가 포커스 되어 있으면 링크 클릭 방지(편집 중)
        if (this.view.hasFocus()) {
          event.preventDefault();
          // 필요하면 여기서 링크 편집 UI 호출 가능
        }
        // 수정 모드가 아니면 클릭 허용 → 새 탭으로 이동
      });

      imgContainer = link;
    } else {
      imgContainer = img;
    }

    wrapper.appendChild(imgContainer);

    // 🔹 Resize handles
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
          if (typeof pos !== "number") return;

          const tr = view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            width: newWidth, // 수정: 숫자 그대로 저장
            height: newHeight,
          });
          view.dispatch(tr);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });

    // 🔹 툴바 생성
    this.toolbar = document.createElement("div");
    this.toolbar.className = "pm-image-toolbar";
    this.toolbar.style.position = "absolute";
    this.toolbar.style.bottom = "100%";
    this.toolbar.style.left = "50%";
    this.toolbar.style.transform = "translateX(-50%)";
    this.toolbar.style.background = "white";
    this.toolbar.style.border = "1px solid #ccc";
    this.toolbar.style.borderRadius = "4px";
    this.toolbar.style.padding = "4px 8px";
    this.toolbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    this.toolbar.style.display = "none";
    this.toolbar.style.zIndex = "10";
    this.toolbar.style.gap = "4px";
    this.toolbar.style.whiteSpace = "nowrap";

    // 🔘 링크 버튼
    const linkBtn = document.createElement("button");
    linkBtn.textContent = "🔗";
    linkBtn.onclick = (e) => {
      e.preventDefault();
      const url = prompt("이미지에 넣을 링크:");
      if (url && typeof this.getPos() === "number") {
        const pos = this.getPos()!;
        const tr = this.view.state.tr.setNodeMarkup(pos, undefined, {
          ...this.node.attrs,
          href: url,
        });
        this.view.dispatch(tr);
      }
    };

    // 🔘 전체 너비 버튼
    const fullBtn = document.createElement("button");
    fullBtn.textContent = "⛶";
    fullBtn.onclick = (e) => {
      e.preventDefault();
      const pos = this.getPos();
      if (typeof pos !== "number") return;

      const tr = this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        width: "100%", // 수정: 문자열도 허용
        height: undefined,
      });
      this.view.dispatch(tr);
    };

    // 🔘 크기 입력 버튼
    const resizeBtn = document.createElement("button");
    resizeBtn.textContent = "📏";
    resizeBtn.onclick = (e) => {
      e.preventDefault();
      const width = prompt("width(px 또는 %)", this.node.attrs.width || "");
      const height = prompt("height(px)", this.node.attrs.height || "");
      const pos = this.getPos();
      if (typeof pos !== "number") return;

      const tr = this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        width: width || undefined,
        height: height || undefined,
      });
      this.view.dispatch(tr);
    };

    this.toolbar.appendChild(linkBtn);
    this.toolbar.appendChild(resizeBtn);
    this.toolbar.appendChild(fullBtn);

    wrapper.appendChild(this.toolbar);
    this.dom = wrapper;
  }

  selectNode() {
    this.dom.classList.add("ProseMirror-selectednode");
    this.toolbar.style.display = "flex";
  }

  deselectNode() {
    this.dom.classList.remove("ProseMirror-selectednode");
    this.toolbar.style.display = "none";
  }
}
