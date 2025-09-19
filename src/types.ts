type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type ColorType = RGB | RGBA | HEX;

type Task = { text: string; check: boolean; children: Task[] };

enum NodeType {
  Note,
  Comment,
  Todo,
  Table,
  Url,

  Arrow,
  Board,
  Column,

  Code,
  Document,
  Upload,

  Drawing,
  Sketch,
  Color,
  Image,
}

interface BaseNode {
  id: string;
  type: NodeType;
}

interface Node extends BaseNode {
  x: number;
  y: number;
  //? can be decided by the user
  width?: number;
  //? height depends on content shouldnt be user controlled
  //height?: number;
  color?: Color;
  top_strip_color?: Color;
  zIndex?: number;
}

interface ChildNode extends BaseNode {
  id: string;
  type: NodeType;
  index: number;
  color?: Color;
}

interface Note extends Node, ChildNode {
  text: string; // rich text maybe json
}

interface Comment extends Node, ChildNode {
  comment: string;
}

interface Url extends Node, ChildNode {
  url: string;
}
interface Todo extends Node, ChildNode {
  title?: string;
  // [ ] text
  // [x] text
  tasks: Task[];
}

////////////////////////////////////////////////

type Badge = {
  label: string;
  color: Color;
};

type BadgeRegistry = Record<string, Badge[]>;

enum ColumnType {
  String,
  Number,
  Boolean,
  Date,
  Badge,
}
// can add more in the future

interface ColumnSchema {
  key: string;
  title: string;
  typeDef: ColumnType;
}
interface Table extends Node, ChildNode {
  columns: ColumnSchema[];
  rows: Record<string, string | number | Badge>[];
  description?: string;
  title?: string;
}
////////////////////////////////////////////////

interface Column extends Node, ChildNode {
  title: string;
}

interface Color extends Node, ChildNode {
  colorValue: ColorType;
  text: string;
}

interface Board extends Node, ChildNode {
  name: string;
  icon_path: string;
}
interface Image extends Node, ChildNode {
  path: string;
  title: string;
  description: string;
}

type NodeUnion = Note | Comment | Url | Todo | Table | Column | Board | Image;
export { NodeType, ColumnType };
export type {
  Node,
  ChildNode,
  Note,
  Comment,
  Url,
  Todo,
  Table,
  Column,
  NodeUnion,
  Task,
  Board,
  Image,
  Badge,
  ColumnSchema,
  BadgeRegistry,
};

/*
type ColumnType =
  | { type: "string" }
  | { type: "text" }
  | { type: "number" }
  | { type: "boolean" }
  | { type: "currency" }
  | { type: "percentage" }
  | { type: "date" }
  | { type: "time" }
  | { type: "datetime" }
  | { type: "duration" }
  | { type: "email" }
  | { type: "url" }
  | { type: "phone" }
  | { type: "color" }
  | { type: "image" }
  | { type: "file" }
  | { type: "rating"; max: number } // e.g. 5-star or 10-scale
  | { type: "status"; options: string[] }
  | { type: "label"; options: string[] }
  | { type: "priority"; options: string[] }
  | { type: "select"; options: string[] }
  | { type: "multiselect"; options: string[] }
  | { type: "user"; users: string[] } // or object references
  | { type: "reference"; table: string } // link to another table
  | { type: "formula"; expression: string };
*/
