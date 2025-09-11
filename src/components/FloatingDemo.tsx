import { FloatingDock } from "./Floating";

import { AiFillGithub, AiFillTwitterCircle, AiFillHome } from "solid-icons/ai";
import { FaBrandsStackExchange, FaSolidTerminal } from "solid-icons/fa";
import { TbNewSection } from "solid-icons/tb";

export default function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <AiFillHome class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Products",
      icon: (
        <FaSolidTerminal class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <TbNewSection class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <FaBrandsStackExchange class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Twitter",
      icon: (
        <AiFillTwitterCircle class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <AiFillGithub class="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  return (
    <div class="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  );
}
