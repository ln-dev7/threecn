import Link from "next/link"

import { cn } from "@/lib/utils"

/** Small isometric cube mark, inherits `currentColor`. */
export function CubeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <path
        d="M12 2.5 21 7v10l-9 4.5L3 17V7l9-4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M3 7l9 4.5L21 7M12 11.5V21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="opacity-60"
      />
      <path
        d="M12 11.5 21 7v5l-9 4.5-9-4.5V7l9 4.5Z"
        fill="hsl(var(--primary))"
        fillOpacity="0.18"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-mono text-[15px] font-semibold tracking-tight",
        className
      )}
    >
      <CubeMark className="text-primary" />
      <span>threecn</span>
    </Link>
  )
}
