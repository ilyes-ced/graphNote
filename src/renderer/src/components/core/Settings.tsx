import { For, Show, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { setStore, store } from "../../shared/store";

onMount(() => {
    console.log("settings panel")
});


/*
possible settigns:  
    font type
    text size

    change encryption password
    allow or disallow nodes.json backups
*/
const ToggleSettings = [
    {
        "name": "Enable caching Youtube videos",
        "description": "Save youtube videos locally to avoid waiting for loading, or to use offline.",
        "value": false,
    }, {
        "name": "Cache URL metadata",
        "description": "Store thumbnail and URL information locally to be seen offline and avoid long loading times.",
        "value": true,
    }
]
const FileSettings = [
    {
        "name": "Set app data folder location",
        "description": "Choose which folder the app saves all the data, nodes, images, videos",
        "value": false,
    }
]


export default () => {
    return (
        <Show when={store.settingsModal === true}>
            <Portal>
                <div class="z-50 absolute top-0 left-0 size-full  backdrop-blur-md" onClick={() => setStore("settingsModal", false)}>
                    <div onClick={(e) => e.stopPropagation()} id="settings_modal_content" class="bg-background absolute w-5xl aspect-video top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary animate-[modalIn_0.25s_ease]">

                        <div class="flex flex-col w-full">
                            <div class="text-4xl p-4">
                                category title
                            </div>
                            <div>
                                <For each={ToggleSettings}>
                                    {(Setting) => (
                                        <SettingsItem name={Setting.name} description={Setting.description} value={Setting.value} />
                                    )}
                                </For >
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>

    );
};


interface ToggleProps {
    name: string;
    description: string;
    value: boolean
}


function Toggle(props: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => props.onChange(!props.checked)}
            class="cursor-pointer relative w-10 h-6 bg-card border border-primary/80 flex items-center p-1 outline-2 outline-primary"
        >
            <div class={`w-4 h-4 transition-transform duration-200 ${props.checked ? "translate-x-4 bg-primary" : "bg-foreground"}`} />
        </button>
    );
}

function SettingsItem(props: ToggleProps) {
    const [accepted, setAccepted] = createSignal(props.value);

    return (
        <div class="w-full px-4 py-1 space-y-4 text-white">
            <div class="flex items-center justify-between border border-border p-4 hover:bg-card transition">
                <div>
                    <div class="text-md font-bold">{props.name}</div>
                    <div class="text-sm text-muted-foreground mt-1">
                        {props.description}
                    </div>
                </div>
                <Toggle checked={accepted()} onChange={() => { setAccepted(!accepted()) }} />
            </div>
        </div>
    );
}