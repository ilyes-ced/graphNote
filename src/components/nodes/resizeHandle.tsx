import { IoResize } from "solid-icons/io";

export default (props: any) => {
  return (
    <div
      onPointerDown={props.startResizeFunction}
      class="z-50 resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out"
    >
      <IoResize color="#222222" size={24} class="rotate-90 " stroke="4" />
    </div>
  );
};
