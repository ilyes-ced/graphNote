import { onMount } from "solid-js";
import { Portal } from "solid-js/web";


onMount(() => {
    console.log("settings panel")
});



export default () => {
    return (
        <Portal>
            <div class="z-50 absolute top-0 left-0 size-full bg-black border">
                <div id="settings_modal_content" class="absolute w-5xl aspect-16/9 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary [box-shadow:5px_5px_var(--color-chart2) flex items-center justify-center">

                    <div class="flex flex-col w-full">
                        <div class="text-4xl p-4" >
                            category title
                        </div>
                        <div class="w-full border p-4">
                            text
                            toggle
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};
