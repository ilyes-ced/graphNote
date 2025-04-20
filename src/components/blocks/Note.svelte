<script lang="ts">
    let items_inside = [0, 0, 0, 0, 0, 0, 0, 0];
    import Svg from "./Svg.svelte";
    let { block } = $props();
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
        <in-place-edit value={block.text}> </in-place-edit>
    </div>
</div>
