type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;

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
interface Table extends Node, ChildNode {
  // maye fix it later
  data: string | number[][];
  description?: string;
  title?: string;
}

interface Column extends Node, ChildNode {
  title: string;
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

export { NodeType };
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
};
