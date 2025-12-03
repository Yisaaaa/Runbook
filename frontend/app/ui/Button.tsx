"use client";

import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  children,
  className,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-full text-sm transition-colors hover:cursor-pointer",
        {
          "text-white bg-primary": variant === "primary",
          "text-primary": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </button>
  );
}
