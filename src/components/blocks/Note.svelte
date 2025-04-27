<script lang="ts">
    import InPlaceEdit from "../InPlaceEdit.svelte";

    let items_inside = [0, 0, 0, 0, 0, 0, 0, 0];
    import Svg from "./Svg.svelte";
    let { block, edit_func } = $props();
    import { Block_type } from "../../routes/types";
    import type { Block } from "../../routes/types";
</script>

<div
    id={block.id}
    class="block_container"
    draggable="true"
    role="region"
    style="transform: translateX({block.posX}px) translateY({block.posY}px);"
>
    <div class="block">
        <in-place-edit value={block.text} submit={edit_func}> </in-place-edit>
    </div>
</div>

<style>
    .block_container {
        /* 1 or 5 is best i think maybe make it use editable */
        padding: 5px;
        height: 80px;
        border: 1px solid red;
        max-width: 300px;
    }

    .block {
        background-color: var(--red);
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .independant {
        width: 300px;
    }
</style>
