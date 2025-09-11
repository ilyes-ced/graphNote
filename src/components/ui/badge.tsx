import { cn } from "../../libs/cn";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        outlineBlue: "text-foreground border-2 border-chart-1 bg-chart-1/20",
        outlineGreen: "text-foreground border-2 border-chart-2 bg-chart-2/20",
        outlineYellow: "text-foreground border-2 border-chart-3 bg-chart-3/20",
        outlinePurple: "text-foreground border-2 border-chart-4 bg-chart-4/20",
        outlineRed: "text-foreground border-2 border-chart-5 bg-chart-5/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const Badge = (
  props: ComponentProps<"div"> & VariantProps<typeof badgeVariants>
) => {
  const [local, rest] = splitProps(props, ["class", "variant"]);

  return (
    <div
      class={cn(
        badgeVariants({
          variant: local.variant,
        }),
        local.class
      )}
      {...rest}
    />
  );
};
