import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground hover:bg-accent-hover",
        outline:
          "border-border bg-transparent hover:bg-surface-raised text-foreground",
        secondary:
          "bg-surface-raised text-foreground hover:bg-border",
        ghost:
          "hover:bg-surface-raised text-foreground",
        destructive:
          "bg-red-500/10 text-red-500 hover:bg-red-500/20 focus-visible:border-red-500/40 focus-visible:ring-red-500/20",
        link:
          "text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        sm:      "h-7 gap-1 rounded-md px-3 text-xs",
        lg:      "h-10 gap-2 px-5",
        icon:    "size-9",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
