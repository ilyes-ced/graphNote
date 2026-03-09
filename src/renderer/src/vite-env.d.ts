/// <reference types="vite/client" />
import type { Directive } from "solid-js";

// for use:heightSnap

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      heightSnap: Directive<HTMLDivElement, true>;
    }
  }
}
