import type { Node as ProseMirrorNode, DOMOutputSpec } from "prosemirror-model";
import type { Schema } from "./types";

export const images: Schema = {
  name: "image",
  spec: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      href: { default: null }, // 링크 속성 추가
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom: HTMLElement) {
          const img = dom as HTMLImageElement;
          // 부모가 <a> 태그면 href 가져오기
          let href = null;
          if (img.parentElement && img.parentElement.tagName === "A") {
            href = img.parentElement.getAttribute("href");
          }
          return {
            src: img.getAttribute("src"),
            title: img.getAttribute("title"),
            alt: img.getAttribute("alt"),
            width: img.getAttribute("width"),
            height: img.getAttribute("height"),
            href,
          };
        },
      },
    ],
    toDOM(node: ProseMirrorNode): DOMOutputSpec {
      const { src, alt, title, width, height, href } = node.attrs;
      const imgAttrs = {
        src,
        alt,
        title,
        width: width || null,
        height: height || null,
      };

      if (href) {
        return [
          "a",
          { href, target: "_blank", rel: "noopener noreferrer" },
          ["img", imgAttrs],
        ];
      }

      return ["img", imgAttrs];
    },
  },
};
