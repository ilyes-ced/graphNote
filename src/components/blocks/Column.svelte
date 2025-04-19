<script lang="ts">
    let items_inside = [0, 0, 0, 0, 0, 0, 0, 0];
    import Svg from "./Svg.svelte";
</script>

<div class="column">
    <!--hide it unless the column is hovered-->
    <div class="collapse_icon_container">
        <div class="collapse_icon">
            <Svg width="16" height="16" classes="" icon_name="collapse" />
        </div>
    </div>

    <div class="text_container">
        <div class="title">title</div>
        <div class="column_info">column info (numer of items inside)</div>
    </div>

    {#each items_inside as item, i}
        <div class="container"></div>
        {#if i != items_inside.length - 1}
            <div class="spacer"></div>
        {/if}
    {/each}
</div>

<style>
    .column {
        position: relative;
        background-color: var(--surface-color-2);
        width: 300px;
        min-width: 300px;
        max-width: 300px;
        padding: 7.5px;
        padding-top: 10px;
    }
    .text_container {
        padding: 17.5px;
        padding-top: 10px;
    }

    .container {
        background-color: var(--surface-color-1);
        width: 100%;
        min-height: 50px;
        break-after: column;
    }

    .spacer {
        height: 7.5px;
        background-color: var(--surface-color-2);
    }

    .collapse_icon_container {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 16px;
        height: 16px;
    }
    .collapse_icon_container:hover {
        background-color: yellow;
    }
    .collapse_icon {
        background-color: aqua;
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
</style>
