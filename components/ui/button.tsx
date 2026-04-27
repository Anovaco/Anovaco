import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-normal uppercase tracking-[0.22em] transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-sans",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-green border border-gold hover:bg-transparent hover:text-gold shadow-[0_8px_24px_-12px_rgba(212,175,55,0.6)]",
        outline:
          "border border-green/30 text-green bg-transparent hover:border-green hover:text-green",
        ghost:
          "text-green hover:bg-canvas-2",
        forest:
          "bg-green text-canvas border border-green hover:bg-transparent hover:text-green",
      },
      size: {
        default: "h-12 px-7 py-3.5 gap-3",
        sm: "h-10 px-5 gap-2 text-[11px]",
        lg: "h-14 px-10 gap-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
