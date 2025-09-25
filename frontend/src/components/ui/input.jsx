import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }, ref) {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400",
        "focus:outline-none focus:ring-1  focus:border-neutral-700", // 👈 thin subtle focus
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/30",
        className
      )}
      {...props}
    />
  );
}

const ForwardedInput = React.forwardRef(Input);
export { ForwardedInput as Input };
