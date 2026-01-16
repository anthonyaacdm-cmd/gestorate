
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]",
        secondary:
          "border-transparent bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-hover)]",
        success:
          "border-transparent bg-[var(--success-color)] text-white",
        warning:
          "border-transparent bg-[var(--warning-color)] text-white",
        destructive:
          "border-transparent bg-[var(--error-color)] text-white hover:opacity-90",
        outline: "text-[var(--text-primary)] border-[var(--border-color)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
