import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "glass" | "glass-strong" | "glass-dark" | "outline";

const variantClasses: Record<CardVariant, string> = {
  glass: "glass",
  "glass-strong": "glass-strong",
  "glass-dark": "glass-dark",
  outline: "border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5",
};

export const cardVariants = (opts?: { variant?: CardVariant; className?: string }) => {
  const { variant = "glass", className } = opts ?? {};
  return cn(
    "rounded-2xl transition-shadow duration-300",
    variantClasses[variant],
    className
  );
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, className }),
        hoverable && "hover:-translate-y-0.5 hover:shadow-glass-lg"
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />;
}
