type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;

type Task = { text: string; check: boolean; children: Task[] };

enum Block_type {
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

interface Block {
  id: string;
  type: Block_type;
  x: number;
  y: number;
  //? can be decided by the user
  width?: number;
  //? height depends on content shouldnt be user controlled
  //height?: number;
  color?: Color;
  top_strip_color?: Color;
}

interface ChildBlock {
  id: string;
  type: Block_type;
  index: number;
  color?: Color;
}

interface Note extends Block, ChildBlock {
  text: string; // rich text maybe json
}

interface Comment extends Block, ChildBlock {
  comment: string;
}

interface Url extends Block, ChildBlock {
  url: string;
}
interface Todo extends Block, ChildBlock {
  // [ ] text
  // [x] text
  tasks: Task[];
}
interface Table extends Block, ChildBlock {
  // maye fix it later
  rows: string[][];
}

interface Column extends Block, ChildBlock {
  title: string;
  children: ChildBlock[];
}

type BlockUnion = Note | Comment | Url | Todo | Table | Column;

export { Block_type };
export type {
  Block,
  ChildBlock,
  Note,
  Comment,
  Url,
  Todo,
  Table,
  Column,
  BlockUnion,
  Task,
};
