<script lang="ts">
    let { width, height, icon_name, classes } = $props();

    let icon_bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--tone-color-1")
        .trim();
    let icon_hint = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color-1")
        .trim();
    let icon_txt = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color-1")
        .trim();

    let icons = {
        note: {
            width: width,
            height: height,
            svg: `<g fill="none" fill-rule="evenodd">
        <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
        <path fill="${icon_txt}"
            d="M5.75 5h20.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 0 1 0-1.5zm0 5h20.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5zm0 5h18.143a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5z">
        </path>
    </g>`,
        },

        todo: {
            width: width,
            height: height,
            svg: `    <g fill="none" fill-rule="evenodd">
        <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
        <path fill="${icon_txt}"
            d="M6.28 7.77a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06L7.25 8.74l-.97-.97zm0 6.5a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-2.47 2.47-.97-.97zM14.75 8h11.3a.75.75 0 1 1 0 1.5h-11.3a.75.75 0 1 1 0-1.5zm0 6.4h11.3a.75.75 0 1 1 0 1.5h-11.3a.75.75 0 1 1 0-1.5z">
        </path>
    </g>`,
        },
        arrow: {
            width: width,
            height: height,
            svg: `
            
        <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
            <path fill="${icon_txt}" fill-rule="evenodd"
        d="m30.385 0-3 8-1.793-1.793-21.5 21.5a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1 0-1.414L24.177 4.792 22.385 3l8-3z">
    </path>`,
        },
        board: {
            width: width,
            height: height,
            svg: `    <g fill="none" fill-rule="evenodd">
        <rect width="32" height="32" fill="${icon_hint}" rx="8"></rect>
        <rect width="7" height="7" x="8" y="8" fill="#FFF" rx="2"></rect>
        <rect width="7" height="7" x="8" y="17" fill="#FFF" fill-opacity="0.75" rx="2"></rect>
        <rect width="7" height="7" x="17" y="8" fill="#FFF" fill-opacity="0.25" rx="3.5"></rect>
        <rect width="7" height="7" x="17" y="17" fill="#FFF" fill-opacity="0.5" rx="2"></rect>
    </g>`,
        },
        column: { width: width, height: height, svg: `` },
        comment: { width: width, height: height, svg: `` },
        table: { width: width, height: height, svg: `` },
    } as const;

    let display_icon = icons[icon_name];
</script>

<svg
    class={classes}
    {width}
    {height}
    viewBox="0 0 {display_icon.width} {display_icon.height}"
    >{@html display_icon.svg}</svg
>
