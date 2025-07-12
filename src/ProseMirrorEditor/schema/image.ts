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
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom: HTMLElement) {
          const img = dom as HTMLImageElement;
          return {
            src: img.getAttribute("src"),
            title: img.getAttribute("title"),
            alt: img.getAttribute("alt"),
            width: img.getAttribute("width"),
            height: img.getAttribute("height"),
          };
        },
      },
    ],
    toDOM(node: ProseMirrorNode): DOMOutputSpec {
      const { src, alt, title, width, height } = node.attrs;
      return [
        "img",
        { src, alt, title, width: width || null, height: height || null },
      ];
    },
  },
};
