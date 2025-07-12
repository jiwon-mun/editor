import { schema as basic } from "prosemirror-schema-basic";
import { images } from "./image";
import { Schema } from "prosemirror-model";

const nodes = basic.spec.nodes.addToEnd(images.name, images.spec);

export const customSchema = new Schema({
  nodes,
  marks: basic.spec.marks,
});
