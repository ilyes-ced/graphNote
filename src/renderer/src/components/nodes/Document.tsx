import { onMount } from "solid-js";
import { Document } from "../../types";
import Svg from "./Svg";

type DocumentProps = Document & {
  is_child?: boolean;
};

export default (node: DocumentProps) => {

  onMount(async () => { });

  return (
    <div>
      <div class="flex flex-row p-2 space-x-2">
        <div class="flex items-center justify-center">
          <Svg
            width={40}
            height={40}
            classes=""
            icon_name={"pdf"}
          />
        </div>
        <div class="flex flex-col">
          <div class="text-lg font-extrabold">doc name</div>

          <div class="flex flex-row space-x-2">
            <div class="down_pdf underline cursor-pointer hover:text-primary transition-colors duration-200" >Download</div>
            <div class="open_pdf underline cursor-pointer hover:text-primary transition-colors duration-200" >Open</div>
            <div>11 MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};
