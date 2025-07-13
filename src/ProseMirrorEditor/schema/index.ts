import { schema as basic } from "prosemirror-schema-basic";
import { images } from "./image";
import { Schema } from "prosemirror-model";
import { preview } from "./preview";
const nodes = basic.spec.nodes
  .addToEnd(images.name, images.spec)
  .addToEnd(preview.name, preview.spec);

export const customSchema = new Schema({
  nodes,
  marks: basic.spec.marks,
});
