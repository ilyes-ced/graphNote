import { createSignal, For, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { cn } from "../libs/cn";

import { BsArrowsCollapse } from "solid-icons/bs";
export function FloatingDock(props: {
  items: { title: string; icon: any; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) {
  return (
    <>
      <FloatingDockDesktop
        items={props.items}
        className={props.desktopClassName}
      />
      <FloatingDockMobile
        items={props.items}
        className={props.mobileClassName}
      />
    </>
  );
}

function FloatingDockMobile(props: {
  items: { title: string; icon: any; href: string }[];
  className?: string;
}) {
  const [open, setOpen] = createSignal(false);

  return (
    <div class={cn("relative block md:hidden", props.className)}>
      <Presence>
        <Show when={open()}>
          <For each={props.items}>
            {(item, idx) => (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: idx() * 0.05, duration: 0.2 }}
              >
                <a
                  href={item.href}
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
                >
                  <div class="h-4 w-4">{item.icon}</div>
                </a>
              </Motion.div>
            )}
          </For>
        </Show>
      </Presence>
      <button
        onClick={() => setOpen(!open())}
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <BsArrowsCollapse class="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
}

function FloatingDockDesktop(props: {
  items: { title: string; icon: any; href: string }[];
  className?: string;
}) {
  // For desktop, instead of motion value etc., you might attach mousemove events
  // and then animate via inline styles + Motion, or transitions, or using spring
  // via spring() if supported for numeric values.

  const [mouseX, setMouseX] = createSignal<number>(0);
  const [hoveredTitle, setHoveredTitle] = createSignal<string | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.pageX);
  };
  const handleMouseLeave = () => {
    setMouseX(Infinity);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      class={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-md bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900 ",
        props.className
      )}
    >
      <For each={props.items}>
        {(item) => (
          <IconContainer
            mouseX={mouseX()}
            title={item.title}
            icon={item.icon}
            href={item.href}
          />
        )}
      </For>
    </div>
  );
}

function IconContainer(props: {
  mouseX: number;
  title: string;
  icon: any;
  href: string;
}) {
  let ref: HTMLDivElement | undefined;
  const [hovered, setHovered] = createSignal(false);

  const getDistance = () => {
    if (!ref) return Infinity;
    const bounds = ref.getBoundingClientRect();
    return props.mouseX - bounds.x - bounds.width / 2;
  };

  // you could derive width/height based on getDistance with spring or transition in style
  // for example:
  const computeSize = () => {
    const dist = getDistance();
    // map dist from [-150,0,150] → [40, 80, 40]
    if (dist < -150) return 40;
    if (dist > 150) return 40;
    // linear interpolation
    if (dist < 0) {
      return 40 + ((80 - 40) * (dist + 150)) / 150;
    } else {
      return 80 - ((80 - 40) * dist) / 150;
    }
  };

  return (
    <a href={props.href}>
      <Motion.div
        ref={(el) => (ref = el)}
        style={{
          width: `${computeSize()}px`,
          height: `${computeSize()}px`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        class="relative flex aspect-square items-center justify-center rounded-md bg-gray-200 dark:bg-neutral-800"
      >
        <Presence>
          <Show when={hovered()}>
            <Motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              transition={{ duration: 0.2 }}
              class="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {props.title}
            </Motion.div>
          </Show>
        </Presence>
        <Motion.div
          style={{
            width: `${computeSize() / 2}px`,
            height: `${computeSize() / 2}px`,
          }}
          class="flex items-center justify-center"
        >
          {props.icon}
        </Motion.div>
      </Motion.div>
    </a>
  );
}
