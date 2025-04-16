<script>
    import Svg from "./blocks/Svg.svelte";

    let icons = [
        "note",
        "todo",
        "arrow",
        "board",
        "column",
        "comment",
        "table",
    ];
</script>

<main>
    <div id="icon_container">
        {#each icons as icon}
            <div class="icon">
                <Svg width="32" height="24" classes="test" icon_name={icon} />
                <div class="space"></div>
                <span>{icon}</span>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        background-color: var(--surface-color-1);
        height: 100%;
        width: 50px;
        border-right: 1px solid var(--surface-color-2);
    }

    #icon_container {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .icon {
        background-color: #00000000;
        padding: 10px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 0.35s ease;
    }
    .icon:hover {
        transform: translateX(5px);
    }

    svg {
    }

    span {
    }
    .space {
        padding: 3px;
    }
</style>
