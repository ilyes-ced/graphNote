<script>
    import Svg from "./blocks/Svg.svelte";

    let icons = [
        // basic blocks
        { name: "note", width: 32, height: 24 },
        { name: "todo", width: 32, height: 24 },
        { name: "comment", width: 32, height: 24 },
        { name: "table", width: 32, height: 24 },
        { name: "url", width: 32, height: 24 },

        // layout blocks
        { name: "arrow", width: 32, height: 32 },
        { name: "board", width: 32, height: 32 },
        { name: "column", width: 32, height: 32 },

        // text
        { name: "code", width: 24, height: 24 },
        { name: "document", width: 26, height: 32 },
        { name: "upload", width: 32, height: 32 },

        // artistic maybe
        { name: "drawing", width: 32, height: 32 },
        { name: "sketch", width: 32, height: 24 },
        { name: "color", width: 28, height: 32 },
        { name: "image", width: 32, height: 32 },
    ];
</script>

<main>
    <div id="icon_container">
        {#each icons as icon}
            <div class="icon">
                <Svg
                    width={icon.width}
                    height={icon.height}
                    classes=""
                    icon_name={icon.name}
                />
                <div class="space"></div>
                <span>{icon.name}</span>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        background-color: var(--bg);
        height: 100%;
        width: 50px;
        border-right: 1px solid var(--bg2);
        overflow: hidden;
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
