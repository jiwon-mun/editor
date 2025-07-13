import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { NodeView } from "prosemirror-view";

export class PreviewNodeView implements NodeView {
  dom: HTMLElement;

  constructor(node: ProseMirrorNode) {
    const { url, title, description, image } = node.attrs;

    const container = document.createElement("div");
    container.className = "preview-card";
    container.contentEditable = "false"; // 미리보기는 수정 불가

    const imgEl = document.createElement("img");
    imgEl.src = image;
    container.appendChild(imgEl);

    const content = document.createElement("div");
    content.className = "preview-content";

    const titleEl = document.createElement("div");
    titleEl.className = "preview-title";
    titleEl.textContent = title;

    const descEl = document.createElement("div");
    descEl.className = "preview-description";
    descEl.textContent = description;

    const linkEl = document.createElement("a");
    linkEl.href = url;
    linkEl.target = "_blank";
    linkEl.textContent = url;

    content.appendChild(titleEl);
    content.appendChild(descEl);
    content.appendChild(linkEl);

    container.appendChild(content);

    this.dom = container;
  }
}
