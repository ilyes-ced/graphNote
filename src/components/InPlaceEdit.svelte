<svelte:options customElement="in-place-edit" />

<script lang="ts">
    import { onMount } from "svelte";

    let { value } = $props();
    let required = true;

    let editing: boolean = $state(false);
    let original: String = value;

    onMount(() => {
        original = value;
    });

    function edit() {
        editing = true;
    }

    function accept() {
        if (value != original) {
            $host().dispatchEvent(new CustomEvent("submit"));
        }
        original = value;
        editing = false;
    }

    function keydown(event: { key: string; preventDefault: () => void }) {
        if (event.key == "Escape") {
            event.preventDefault();
            value = original;
            editing = false;
        }
    }

    function focus(element: HTMLInputElement) {
        element.focus();
    }
</script>

<main>
    {#if editing}
        <form on:submit|preventDefault={accept} on:keydown={keydown}>
            <input
                bind:value
                on:blur={accept}
                {required}
                use:focus
                style="border: 2px solid red;background-color: #ff0000;color: pink; font-size: inherit; font: inherit"
            />
        </form>
    {:else}
        <div
            class="editable"
            on:dblclick={edit}
            on:keydown={() => {}}
            role="region"
            style=""
        >
            {value}
        </div>
    {/if}
</main>

<style>
    input {
        border: 2px solid red;
        color: pink;
        font-size: inherit;
        font: inherit;
    }
    .editable {
        padding: 20px;
        border: 2px solid red;
    }
</style>
