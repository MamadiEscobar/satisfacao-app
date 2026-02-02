import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KioskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "happy" | "neutral" | "sad";
  icon: ReactNode;
  label: string;
}

export function KioskButton({ variant, icon, label, className, ...props }: KioskButtonProps) {
  const variants = {
    happy: "border-[hsl(var(--feedback-happy))] bg-[hsl(var(--feedback-happy)/0.1)] hover:bg-[hsl(var(--feedback-happy))] text-[hsl(var(--feedback-happy))] hover:text-white",
    neutral: "border-[hsl(var(--feedback-neutral))] bg-[hsl(var(--feedback-neutral)/0.1)] hover:bg-[hsl(var(--feedback-neutral))] text-[hsl(var(--feedback-neutral))] hover:text-white",
    sad: "border-[hsl(var(--feedback-sad))] bg-[hsl(var(--feedback-sad)/0.1)] hover:bg-[hsl(var(--feedback-sad))] text-[hsl(var(--feedback-sad))] hover:text-white",
  };

  return (
    <button
      className={cn("btn-kiosk w-full h-64 md:h-80 lg:h-96", variants[variant], className)}
      {...props}
    >
      <div className="transform transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <span className="text-2xl md:text-4xl font-display font-bold tracking-wide uppercase">
        {label}
      </span>
    </button>
  );
}
