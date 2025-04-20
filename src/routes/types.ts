type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;


interface Block {
    id: string;
    type: Block_type;
    posX: number;
    posY: number;
    // width + heiht
}





interface Note {
    text: string, // rich text
    bg_color?: Color,
    top_strip_color?: string,
}


interface Note { }




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




export { Block_type };
export type { Block };
