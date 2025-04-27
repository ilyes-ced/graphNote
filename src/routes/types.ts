type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;



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
    width: number;
    height: number;
    color?: Color
    top_strip_color?: Color;
}





interface Note extends Block {
    text: string, // rich text maye json
}

interface Comment extends Block {
    comment: string,
}

interface Url extends Block {
    url: string,
}
interface Todo extends Block {
    // [ ] text
    // [x] text
    tasks: { text: string, check: boolean }[],
}
interface Table extends Block {
    // maye fix it later
    rows: string[][],
}








type BlockUnion = Note | Comment | Url | Todo | Table;

interface Column extends Block {
    title: string,
    children: BlockUnion[]
}








export { Block_type };
export type {
    Block,
    Note,
    Comment,
    Url,
    Todo,
    Table,
    Column,
    BlockUnion
};
