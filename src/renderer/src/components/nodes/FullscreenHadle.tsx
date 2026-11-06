import { AiOutlineArrowsAlt } from 'solid-icons/ai'
export default (props: any) => {
    return (
        <div
            onPointerDown={props.startNodeViewer}
            class="z-50 resize_handle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out"
        >
            <AiOutlineArrowsAlt size={16} />
        </div>
    )
}
