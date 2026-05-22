import { For, Show, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { setStore, store } from "../../shared/store";
import { RadioGroup, RadioGroupItem, RadioGroupItemControl, RadioGroupItemLabel } from "../ui/radio-group";

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
const ToggleSettings: {
    name: string;
    description: string;
    storeFieldName: "youtubeVidCache" | "cacheUrlData" | "showMiniMap"
}[] = [
        {
            name: "Enable caching Youtube videos",
            description: "Save youtube videos locally to avoid waiting for loading, or to use offline.",
            storeFieldName: "youtubeVidCache"
        },
        {
            name: "Cache URL metadata",
            description: "Store thumbnail and URL information locally to be seen offline and avoid long loading times.",
            storeFieldName: "cacheUrlData"
        },
        {
            name: "Show MiniMap",
            description: "Choose to show or not show the minimap of the canvas",
            storeFieldName: "showMiniMap"
        },
    ]
const radioSettings: {
    name: string;
    description: string;
    values: string[];
    storeFieldName: "gridStyle" | "pdfReaderType"
}[] = [
        {
            name: "Board Grid Style",
            description: "Choose between dots or grid style for the canvas background",
            values: ["dots", "grid"],
            storeFieldName: "gridStyle"
        }, {
            name: "PDF Reader Style",
            description: "Displayed to the Side, as a modal, or using the OS default PDF reader",
            values: ["side", "modal", "external",],
            storeFieldName: "pdfReaderType"
        }
    ]


const _FileSettings = [
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
                <div class="z-10000 absolute top-0 left-0 size-full  backdrop-blur-md" onClick={() => setStore("settingsModal", false)}>
                    <div onClick={(e) => e.stopPropagation()} id="settings_modal_content" class="bg-background absolute w-5xl aspect-video top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary animate-[modalIn_0.25s_ease]">

                        <div class="flex flex-col w-full">
                            <div class="text-4xl p-4">
                                category title
                            </div>
                            <div>
                                <For each={ToggleSettings}>
                                    {(Setting) => (
                                        <SettingsItemToggle name={Setting.name} description={Setting.description} value={store.userConfig[Setting.storeFieldName]} storeFieldName={Setting.storeFieldName} />
                                    )}
                                </For >


                                <For each={radioSettings}>
                                    {(Setting) => (
                                        <SettingsItemRadio name={Setting.name} description={Setting.description} values={Setting.values} storeFieldName={Setting.storeFieldName} />
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

function SettingsItemToggle(props: {
    name: string;
    description: string;
    value: boolean;
    storeFieldName: "youtubeVidCache" | "cacheUrlData" | "showMiniMap"
}) {
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
                <Toggle checked={accepted()} onChange={() => {
                    console.log("changing: ")
                    console.log(props.storeFieldName)
                    console.log(!accepted())
                    setStore("userConfig", props.storeFieldName, !accepted())
                    setAccepted(!accepted());
                    console.log(store.userConfig.showMiniMap)
                }} />
            </div>
        </div>
    );
}

function SettingsItemRadio(props: {
    name: string;
    description: string;
    values: string[];
    storeFieldName: "pdfReaderType" | "gridStyle";
}) {
    const [selected, setSelected] = createSignal(store.userConfig[props.storeFieldName]);

    return (
        <div class="w-full px-4 py-1 space-y-4 text-white">
            <div class="flex items-center justify-between border border-border p-4 space-y-3 hover:bg-card transition">
                <div>
                    <div class="text-md font-bold">{props.name}</div>
                    <div class="text-sm text-muted-foreground mt-1">
                        {props.description}
                    </div>
                </div>
                <div class="flex gap-4">
                    <RadioGroup
                        value={selected()}
                        onChange={() => console.log("here we changer the store balue")}
                        class="flex flex-row gap-4"
                    >
                        <For each={props.values}>
                            {(value) => (
                                <RadioGroupItem onclick={() => {
                                    setSelected(value)
                                    setStore("userConfig", props.storeFieldName, value)
                                }} value={value} class="flex items-center gap-2">
                                    <RadioGroupItemLabel class="">{value}:</RadioGroupItemLabel>
                                    <RadioGroupItemControl class="cursor-pointer relative size-6 bg-card border border-primary/80 flex items-center p-1 outline-2 outline-primary" />
                                </RadioGroupItem>

                            )}
                        </For >
                    </RadioGroup>
                </div>
            </div>
        </div>
    )
}