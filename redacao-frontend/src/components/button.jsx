import { cn } from "@/lib/utils";
import React from "react";

export const Button = ({ children, className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
