<script lang="ts">
    import Svg from "./Svg.svelte";
    let { block, edit_func } = $props();
    import { Block_type } from "../../routes/types";
    import type { Block, BlockUnion } from "../../routes/types";
    import Note from "./Note.svelte";

    let children_visible = $state(false);

    const change_vis = () => {
        children_visible = !children_visible;
    };
</script>

<div class="block_container" id={block.id}>
    <div class="column">
        <!--hide it unless the column is hovered-->
        <div class="collapse_icon_container" on:click={change_vis}>
            <div class="collapse_icon">
                <Svg width="16" height="16" classes="" icon_name="collapse" />
            </div>
        </div>

        <div class="text_container">
            <div class="title">
                <in-place-edit value={block.title}></in-place-edit>
            </div>
            <div class="column_info">column info (number of items inside)</div>
        </div>

        <div class={children_visible ? "" : "hide_children"}>
            {#each block.children as child, i}
                {#if child.type == Block_type.Note}
                    <Note block={child} {edit_func} />
                {:else}
                    <div>error</div>
                {/if}
                {#if i != block.children.length - 1}
                    <div class="spacer"></div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .block_container {
        /* 1 or 5 is best i think maybe make it use editable */
        padding: 5px;
        border: 1px solid red;
        max-width: 300px;
    }
    .column {
        position: relative;
        background-color: var(--bg2);
        max-width: 300px;
        padding: 7.5px;
        padding-top: 10px;
    }
    .text_container {
        padding: 17.5px;
        padding-top: 10px;
    }

    .container {
        background-color: var(--bg);
        width: 100%;
        min-height: 50px;
        break-after: column;
    }

    .spacer {
        height: 7.5px;
        background-color: var(--bg2);
    }

    .collapse_icon_container {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 16px;
        height: 16px;
        transition: all 0.2s ease-in;
    }
    .collapse_icon_container:hover {
        background-color: aqua;
    }
    .collapse_icon {
        width: 16px;
        height: 16px;
    }

    .title,
    .column_info {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .title {
        font-size: 16px;
    }
    .hide_children {
        display: none;
    }
</style>
