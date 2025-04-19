<main id="container">
    <div id="breadcrumbs">test / tes ff ft / test</div>
    <div id="title">title</div>
    <div id="settings">settings</div>
</main>

<style>
    #container {
        width: 100%;
        height: 50px;
        min-height: 50px;
        background-color: var(--surface-color-1);
        border-bottom: 1px solid var(--surface-color-2);

        padding-left: 25px;
        padding-right: 25px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 20px;
    }
    #container > * {
        width: 33.33%;
        display: flex;
    }

    #breadcrumbs {
    }
    #title {
        justify-content: center;
    }
    #settings {
        justify-content: right;
    }
</style>
