<script lang="ts">
    let { width, height, icon_name, classes } = $props();

    let icon_bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--tone-color-1")
        .trim();
    let icon_hint1 = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color-1")
        .trim();
    let icon_hint2 = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color-2")
        .trim();
    let icon_hint3 = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color-3")
        .trim();
    let icon_hint4 = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color-4")
        .trim();
    let icon_txt = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color-1")
        .trim();

    let icons = {
        note: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
                    <path fill="${icon_txt}"
                    d="M5.75 5h20.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 0 1 0-1.5zm0 5h20.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5zm0 5h18.143a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5z">
                    </path>
                </g>
            `,
        },

        todo: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
                    <path fill="${icon_txt}"
                    d="M6.28 7.77a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06L7.25 8.74l-.97-.97zm0 6.5a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-2.47 2.47-.97-.97zM14.75 8h11.3a.75.75 0 1 1 0 1.5h-11.3a.75.75 0 1 1 0-1.5zm0 6.4h11.3a.75.75 0 1 1 0 1.5h-11.3a.75.75 0 1 1 0-1.5z">
                    </path>
                </g>
            `,
        },
        arrow: {
            width: width,
            height: height,
            svg: `
                <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
                <path fill="${icon_txt}" fill-rule="evenodd"
                    d="m30.385 0-3 8-1.793-1.793-21.5 21.5a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1 0-1.414L24.177 4.792 22.385 3l8-3z">
                </path>
            `,
        },
        board: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="32" height="32" fill="${icon_hint1}" rx="8"></rect>
                    <rect width="7" height="7" x="8" y="8" fill="#FFF" rx="2"></rect>
                    <rect width="7" height="7" x="8" y="17" fill="#FFF" fill-opacity="0.75" rx="2"></rect>
                    <rect width="7" height="7" x="17" y="8" fill="#FFF" fill-opacity="0.25" rx="3.5"></rect>
                    <rect width="7" height="7" x="17" y="17" fill="#FFF" fill-opacity="0.5" rx="2"></rect>
                </g>
            `,
        },
        column: {
            width: width,
            height: height,
            svg: `
                <defs>
                    <filter id="ElementColumnIcon__a" width="131.2%" height="131.2%" x="-15.6%" y="-12.5%"
                        filterUnits="objectBoundingBox">
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1.5"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    </filter>
                    <rect id="ElementColumnIcon__b" width="32" height="32" rx="2"></rect>
                </defs>
                <g fill="none" fill-rule="evenodd">
                    <use xlink:href="#ElementColumnIcon__b" fill="#000" filter="url(#ElementColumnIcon__a)"></use>
                    <use xlink:href="#ElementColumnIcon__b" fill="#3D3D3D"></use>
                    <path fill="#333" d="M3 9h26v9H3zm0 11h26v9H3z"></path>
                    <rect width="18" height="1.5" x="7" y="4" fill="${icon_hint4}" rx="0.75"></rect>
                </g>
            `,
        },
        comment: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <path fill="${icon_hint3}"
                        d="M2.002 22A1.995 1.995 0 0 1 0 20.009V1.99C0 .891.89 0 2.002 0h27.996C31.104 0 32 .89 32 1.991V20.01c0 1.1-.89 1.991-2.002 1.991H20l-4 4-4-4H2.002z">
                    </path>
                    <path fill="${icon_hint1}"
                        d="M24.24 14c.385 0 .703.28.753.648l.007.102c0 .414-.33.75-.76.75H5.76a.753.753 0 0 1-.76-.75c0-.414.33-.75.76-.75h18.48zm2.003-4c.383 0 .7.28.75.648l.007.102c0 .414-.346.75-.757.75H5.757A.752.752 0 0 1 5 10.75c0-.414.346-.75.757-.75h20.486zm0-4c.383 0 .7.28.75.648L27 6.75c0 .414-.346.75-.757.75H5.757A.752.752 0 0 1 5 6.75c0-.414.346-.75.757-.75h20.486z">
                    </path>
                </g>
            `,
        },
        table: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <path fill="#3D3D3D" d="M2 0h28a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path>
                    <path fill="#4D4D4D" d="M2 0h28a2 2 0 0 1 2 2v3H0V2a2 2 0 0 1 2-2z"></path>
                    <path fill="#FFF" fill-opacity="0.1"
                        d="M11 0v10h10V0h1v10h10v1H22v6h10v1H22v6h-1v-6H11v6h-1v-6H0v-1h10v-6H0v-1h10V0h1zm10 17v-6H11v6h10z">
                    </path>
                </g>
            `,
        },
        code: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="${icon_bg}" rx="2"></rect>
                    <path d="M9 8L5 11.6923L9 16M15 8L19 11.6923L15 16" stroke="${icon_txt}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    </path>
                </g>
            `,
        },
        color: {
            width: width,
            height: height,
            svg: `
                <defs>
                    <filter id="ElementColorSwatchIcon__b" width="155.6%" height="143.5%" x="-27.8%" y="-17.4%"
                        filterUnits="objectBoundingBox">
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1.5"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    </filter>
                    <filter id="ElementColorSwatchIcon__e" width="155.6%" height="143.5%" x="-27.8%" y="-17.4%"
                        filterUnits="objectBoundingBox">
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1.5"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    </filter>
                    <path id="ElementColorSwatchIcon__a"
                        d="M0 1.003A.999.999 0 0 1 .993 0h16.014c.548 0 .993.439.993 1.003v20.994A.998.998 0 0 1 17.007 23H.993A.992.992 0 0 1 0 21.997V1.003z">
                    </path>
                    <path id="ElementColorSwatchIcon__d"
                        d="M0 1.003A.999.999 0 0 1 .993 0h16.014c.548 0 .993.439.993 1.003v20.994A.998.998 0 0 1 17.007 23H.993A.992.992 0 0 1 0 21.997V1.003z">
                    </path>
                </defs>
                <g fill="none" fill-rule="evenodd">
                    <g transform="rotate(-4 17.978 .628)">
                        <mask id="ElementColorSwatchIcon__c" fill="#fff">
                            <use xlink:href="#ElementColorSwatchIcon__a"></use>
                        </mask>
                        <use xlink:href="#ElementColorSwatchIcon__a" fill="#000" filter="url(#ElementColorSwatchIcon__b)"></use>
                        <use xlink:href="#ElementColorSwatchIcon__a" fill="#3D3D3D"></use>
                        <path fill="#318295" d="M-2.685-2.024h23v18h-23z" mask="url(#ElementColorSwatchIcon__c)"></path>
                    </g>
                    <g transform="rotate(4 -109.493 148.676)">
                        <mask id="ElementColorSwatchIcon__f" fill="#fff">
                            <use xlink:href="#ElementColorSwatchIcon__d"></use>
                        </mask>
                        <use xlink:href="#ElementColorSwatchIcon__d" fill="#000" filter="url(#ElementColorSwatchIcon__e)"></use>
                        <use xlink:href="#ElementColorSwatchIcon__d" fill="#3D3D3D"></use>
                        <path fill="#E15678" d="M-2-2h22v18H-2z" mask="url(#ElementColorSwatchIcon__f)"></path>
                    </g>
                </g>
            `,
        },
        document: {
            width: width,
            height: height,
            svg: `
                <defs>
                    <filter id="ElementDocumentIcon__b" width="138.5%" height="131.2%" x="-19.2%" y="-12.5%"
                        filterUnits="objectBoundingBox">
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1.5"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    </filter>
                    <filter id="ElementDocumentIcon__d" width="279.6%" height="277.8%" x="-89.7%" y="-77.8%"
                        filterUnits="objectBoundingBox">
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2.5"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                        <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="1"></feGaussianBlur>
                        <feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                            <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        </feMerge>
                    </filter>
                    <path id="ElementDocumentIcon__a"
                        d="M.855 0H16.74c.228 0 .447.091.608.254l8.406 8.496c.158.16.247.376.247.602v21.793a.855.855 0 0 1-.855.855H.855A.855.855 0 0 1 0 31.145V.855C0 .383.383 0 .855 0z">
                    </path>
                    <path id="ElementDocumentIcon__e" d="m17.094 0 8.812 9h-8.042a.855.855 0 0 1-.855-.855v-.01L17.094 0z"></path>
                </defs>
                <g fill="none" fill-rule="evenodd">
                    <g>
                        <mask id="ElementDocumentIcon__c" fill="#fff">
                            <use xlink:href="#ElementDocumentIcon__a"></use>
                        </mask>
                        <use xlink:href="#ElementDocumentIcon__a" fill="#000" filter="url(#ElementDocumentIcon__b)"></use>
                        <use xlink:href="#ElementDocumentIcon__a" fill="#3D3D3D"></use>
                        <g fill="#000" mask="url(#ElementDocumentIcon__c)">
                            <use xlink:href="#ElementDocumentIcon__e" filter="url(#ElementDocumentIcon__d)"></use>
                        </g>
                        <path fill="#4D4D4D" d="M17.095 0 26 9h-8.136a.855.855 0 0 1-.855-.855v-.01L17.095 0z"
                            mask="url(#ElementDocumentIcon__c)"></path>
                    </g>
                    <path fill="#F2F2F2"
                        d="M20.25 24c.38 0 .693.28.743.648l.007.102c0 .414-.334.75-.75.75H5.75a.749.749 0 1 1 0-1.5h14.5zm-9.962-8 .118 1.81h-.549c-.376-.917-.525-1.316-1.16-1.316h-.242v3.972c0 .43.172.517.69.54v.494H6.37v-.494c.525-.023.705-.11.705-.54v-3.972h-.25c-.635 0-.784.4-1.16 1.316h-.541L5.243 16h5.045zm9.96 4c.38 0 .695.28.745.648l.007.102c0 .414-.344.75-.753.75h-6.494a.75.75 0 1 1 0-1.5h6.494zm0-4c.38 0 .695.28.745.648l.007.102c0 .414-.344.75-.753.75h-6.494a.75.75 0 1 1 0-1.5h6.494z">
                    </path>
                </g>
            `,
        },
        drawing: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="#3D3D3D" rx="4"></rect>
                    <g fill="#F2F2F2" fill-rule="nonzero">
                        <path
                            d="M21.778 6.733a2.3 2.3 0 0 1 2.969.02l.13.12 1.062 1.063c.8.8.894 2.052.249 2.959l-.108.14-1.623 1.948a.8.8 0 0 1-1.293-.936l.063-.088 1.624-1.948a.7.7 0 0 0 .026-.862l-.07-.081-1.062-1.063a.702.702 0 0 0-.856-.105l-.087.062-1.948 1.623a.8.8 0 0 1-1.103-1.154l.079-.075 1.948-1.623zM8.391 21.754l-1.226 2.56a.998.998 0 0 0 1.333 1.334l2.561-1.226a.501.501 0 0 0 .138-.805l-2-2a.5.5 0 0 0-.805.137z">
                        </path>
                        <path
                            d="m18.575 9.117-6.877 6.875a9.503 9.503 0 0 0-1.78 2.47L8.501 21.3a1.501 1.501 0 0 0 .281 1.731l1 1a1.5 1.5 0 0 0 1.732.281l2.839-1.419a9.515 9.515 0 0 0 2.469-1.78l6.873-6.873a2.501 2.501 0 0 0 0-3.536l-1.586-1.586a2.501 2.501 0 0 0-3.536 0zm1.06 1.06a1 1 0 0 1 1.32-.082l.094.083 1.586 1.586a1 1 0 0 1 .083 1.32l-.083.094-6.875 6.875a8.016 8.016 0 0 1-1.754 1.326l-.325.172-2.839 1.42-1-1 1.42-2.84a8.034 8.034 0 0 1 1.244-1.812l.254-.266 6.875-6.875z">
                        </path>
                    </g>
                </g>
            `,
        },
        sketch: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="#3D3D3D" rx="2"></rect>
                    <path fill="#E6E6E6"
                        d="M20.79 4.344a.88.88 0 0 1-.095 1.18l-.078.066-2.54 1.878-1.34 1.005-.84.637-.613.47-.83.644-.744.586-.68.55-.641.53-.416.354-.414.362-.187.168-.34.312-.155.148-.286.282-.26.273c-.084.09-.164.18-.243.272a4.384 4.384 0 0 0-.353.466 1.75 1.75 0 0 0-.095.16l-.023.047.04-.003c.247-.028.525-.087.885-.182l.187-.05.236-.069.496-.153.54-.179.614-.215 1.042-.383 2.483-.94.877-.318.14-.049c.17-.058.322-.109.47-.155l.318-.095c.233-.066.394-.105.585-.13l.18-.019a1.1 1.1 0 0 1 .373.038c.066.02.136.051.229.106.103.07.2.169.242.256.05.086.085.18.095.246a.98.98 0 0 1-.039.502l-.055.14a2.15 2.15 0 0 1-.123.222 3.896 3.896 0 0 1-.132.197l-.152.199c-.056.07-.12.146-.193.233l-.202.227-.204.223-.333.35-.256.261-2.02 2.007-.123.125 1.598-.444.588-.155.338-.08.158-.033.306-.058.15-.024.307-.042a6.977 6.977 0 0 1 1.51-.03c.578.065 1.086.205 1.526.443.497.258.923.658 1.214 1.136.107.174.197.36.27.554l.069.197c.065.21.108.408.132.611l.016.205a.567.567 0 0 1-1.123.149l-.013-.093a2.248 2.248 0 0 0-.334-1.013 1.954 1.954 0 0 0-.778-.706c-.3-.157-.666-.252-1.093-.294a5.794 5.794 0 0 0-1.242.044c-.41.056-.831.149-1.36.295l-1.843.54-.269.073-.24.061-.24.055-.214.042-.182.026a1.803 1.803 0 0 1-.507.005.917.917 0 0 1-.404-.151l-.106-.08-.062-.063-.042-.05-.036-.056a.761.761 0 0 1-.086-.218l-.012-.092a.688.688 0 0 1 .003-.153l.03-.145.032-.09c.047-.109.09-.188.155-.283l.108-.15.152-.193.16-.189.184-.204.465-.495 1.818-1.855.346-.363.147-.158-.61.23-3.009 1.186-.671.256-.627.229c-.493.176-.924.32-1.35.446l-.399.111a6.207 6.207 0 0 1-1.103.206c-.19.013-.332.013-.501-.007a1.526 1.526 0 0 1-.347-.087 1.089 1.089 0 0 1-.436-.298 1.496 1.496 0 0 1-.32-1.315c.069-.31.19-.575.375-.868.135-.216.287-.423.465-.637.249-.297.497-.567.785-.857l.304-.297.34-.32.385-.352.212-.19.423-.37.428-.367.668-.56.722-.592.802-.644 1.237-.976 1.574-1.222 1.458-1.115L19.55 4.18a.89.89 0 0 1 1.24.164z">
                    </path>
                </g>
            `,
        },
        upload: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="#3D3D3D" rx="4"></rect>
                    <path fill="#E6E6E6" d="M18.586 6a1 1 0 0 1 .707.293l4.414 4.414a1 1 0 0 1 .293.707V24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8.586zM17 7.5h-7a.5.5 0 0 0-.5.5v16a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V13h-4.75a.75.75 0 0 1-.743-.648L17 12.25V7.5zm5.379 4L18.5 7.622V11.5h3.879z"></path>
                </g>
            `,
        },
        image: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="32" height="32" fill="#3D3D3D" rx="4"></rect>
                    <path fill="#E6E6E6"
                        d="M22 7a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h12zm-8 11.06-4.97 4.97a.758.758 0 0 1-.063.057A1.49 1.49 0 0 0 10 23.5h12c.401 0 .765-.157 1.034-.414l-.064-.056L19 19.06l-1.47 1.47a.75.75 0 0 1-1.06 0L14 18.06zm8-9.56H10A1.5 1.5 0 0 0 8.5 10v11.438l4.97-4.968a.75.75 0 0 1 .976-.073l.084.073L17 18.94l1.47-1.47a.75.75 0 0 1 1.06 0l3.97 3.969V10A1.5 1.5 0 0 0 22 8.5zM19 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z">
                    </path>
                </g>
            `,
        },
        url: {
            width: width,
            height: height,
            svg: `
                <g fill="none" fill-rule="evenodd">
                    <rect width="${width}" height="${height}" fill="#3D3D3D" rx="2"></rect>
                    <path fill="#E6E6E6" fill-rule="nonzero"
                        d="M17.986 10.014a4.285 4.285 0 0 1 0 6.06l-1.67 1.67a4.285 4.285 0 0 1-6.06-6.06.741.741 0 0 1 1.048 1.05 2.802 2.802 0 0 0 3.963 3.962l1.67-1.67a2.802 2.802 0 0 0 0-3.964.741.741 0 1 1 1.049-1.048zm3.759-3.759a4.285 4.285 0 0 1 0 6.06.741.741 0 0 1-1.049-1.048 2.802 2.802 0 0 0-3.963-3.963l-1.67 1.67a2.802 2.802 0 0 0 0 3.964.741.741 0 1 1-1.049 1.048 4.285 4.285 0 0 1 0-6.06l1.67-1.67a4.285 4.285 0 0 1 6.06 0z">
                    </path>
                </g>
            `,
        },
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
