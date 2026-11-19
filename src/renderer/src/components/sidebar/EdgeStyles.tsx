import Svg from "../nodes/Svg"
import { FaSolidArrowLeftLong, FaSolidArrowRightLong } from 'solid-icons/fa'
import { CgBorderStyleDashed } from 'solid-icons/cg'
import { BsBorderWidth } from 'solid-icons/bs'
import { createEffect, createSignal } from "solid-js"
import { store } from "../../shared/store"
import { findEdgeById } from "../../shared/update"

export default () => {
    const [color, setColor] = createSignal("#EC4899")

    const setColors = () => {
        const edgeId = store.selectedEdge
        if (edgeId) {
            const edge = findEdgeById(edgeId)
            console.log(edge)
            setColor(edge?.color ?? "#444444")
        }
    }

    createEffect(() => {
        if (store.selectedEdge) {
            setColors()
        }
    })

    return (
        <div class="p-2">
            <div class="overflow-hidden w-[65px] p-4 bg-background border-2 border-primary">
                <div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2" style={{ background: color() }}>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    <Svg width={32} height={32} classes="" icon_name="arrow" />

                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">Color</p>
                    </div>
                </div>

                <div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2">
                                <div class="border-b-0 h-1/6 w-full" ></div>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    <FaSolidArrowLeftLong />
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">Start</p>
                    </div>
                </div>
                <div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2">
                                <div class="border-b-0 h-1/6 w-full" ></div>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    <FaSolidArrowRightLong />
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">End</p>
                    </div>
                </div><div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2">
                                <div class="border-b-0 h-1/6 w-full" ></div>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    T
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">Label</p>
                    </div>
                </div>
                <div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2">
                                <div class="border-b-0 h-1/6 w-full" ></div>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    <CgBorderStyleDashed />
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">Style</p>
                    </div>
                </div><div
                    class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
                >
                    <div>
                        <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                            <div class="flex flex-col size-full p-2">
                                <div class="border-b-0 h-1/6 w-full" ></div>
                                <div
                                    class="h-5/6 w-full flex items-center justify-center"
                                >
                                    <BsBorderWidth />
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-center">Stroke</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
