type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type ColorType = RGB | RGBA | HEX;

type Task = { text: string; check: boolean; nestLevel: number };

enum NodeType {
  Note = "Note",
  Comment = "Comment",
  Todo = "Todo",
  Table = "Table",
  Url = "Url",
  Activity = "Activity",

  Arrow = "Arrow",
  Board = "Board",
  Column = "Column",

  Code = "Code",
  Document = "Document",
  Upload = "Upload",

  Drawing = "Drawing",
  Sketch = "Sketch",
  Color = "Color",
  Image = "Image",
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
  color?: ColorType;
  top_strip_color?: ColorType;
  zIndex?: number;
}

interface ChildNode extends BaseNode {
  id: string;
  type: NodeType;
  index: number;
  color?: ColorType;
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
  id: string;
  label: string;
  color: ColorType;
};

type BadgeRegistry = Record<string, Badge[]>;

enum ColumnType {
  String = "String",
  Number = "Number",
  Boolean = "Boolean",
  Date = "Date",
  Badge = "Badge",
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
interface Activity extends Node, ChildNode {
  //TODO: figure me out
  title: string;
  desciption: string;
  //? key string is for the date yyyy-mm-dd
  // ! pain in the ass to implment it to handle other date formats
  progress: Record<string, number>;
}

interface Arrow extends Node, ChildNode {}
interface Code extends Node, ChildNode {}
interface Upload extends Node, ChildNode {}
interface Drawing extends Node, ChildNode {}
interface Sketch extends Node, ChildNode {}
interface Document extends Node, ChildNode {}

////////////////////////////////////////////////

enum EdgeType {
  Bezier = "Bezier",
  Straight = "Straight",
  Step = "Step",
}

interface BaseEdge {
  srcNodeId: string;
  distNodeId: string;
  color?: string; // default foreground
  stroke?: string; // default 2
  label?: string; // default none
  style?: string; // solid, dashed ...., default solid
  // type?: string; // straight, bezier, step curved >>>> default bezier
  srcArrowHead?: string; // default none
  DistArrowHead?: string; // default normal arrow head
}
interface BezierEdge extends BaseEdge {
  type: EdgeType.Bezier;
  curvature?: number;
}
interface StraightEdge extends BaseEdge {
  type: EdgeType.Straight;
  sharpness?: number;
}
interface StepEdge extends BaseEdge {
  type: EdgeType.Step;
  stepDirection?: "horizontal" | "vertical";
}
type Edge = BezierEdge | StraightEdge | StepEdge;

////////////////////////////////////////////////

type NodeUnion =
  | Note
  | Comment
  | Todo
  | Table
  | Url
  | Activity
  | Arrow
  | Board
  | Column
  | Code
  | Document
  | Upload
  | Drawing
  | Sketch
  | Color
  | Image;

export { NodeType, ColumnType, EdgeType };
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
  Color,
  Activity,
  ColorType,
  Edge,
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
