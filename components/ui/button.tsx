import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-ember text-white shadow-glow hover:bg-[#ff8a22]",
        variant === "secondary" && "bg-linen text-void hover:bg-pearl",
        variant === "ghost" && "border border-parchment/20 bg-white/5 text-pearl hover:border-ember/60 hover:text-ember",
        className
      )}
      {...props}
    />
  );
}
