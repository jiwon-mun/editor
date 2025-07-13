import type { Schema } from "./types";

export const preview: Schema = {
  name: "preview",
  spec: {
    group: "block",
    atom: true,
    selectable: true,
    attrs: {
      url: {},
      title: { default: "" },
      description: { default: "" },
      image: { default: "" },
    },
    parseDOM: [{ tag: "div.preview-card" }],
    toDOM(node) {
      const { url, title, description, image } = node.attrs;
      return [
        "div",
        { class: "preview-card" },
        ["img", { src: image }],
        [
          "div",
          { class: "preview-content" },
          ["div", { class: "preview-title" }, title],
          ["div", { class: "preview-description" }, description],
          ["a", { href: url, target: "_blank" }, url],
        ],
      ];
    },
  },
};
