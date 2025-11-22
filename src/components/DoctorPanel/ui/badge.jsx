import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Badge variant styles using class-variance-authority - REMOVED HOVER EFFECTS
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground", 
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Badge component in JSX
function Badge(props) {
  const { className, variant = "default", ...rest } = props;

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest} />
  );
}

export { Badge, badgeVariants };