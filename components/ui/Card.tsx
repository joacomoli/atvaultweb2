import { JSX } from "preact";

export function Card({ class: className, children, ...props }: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, class: className = "" }: CardProps) {
  return (
    <div class={`p-4 border-b ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, class: className = "" }: CardProps) {
  return (
    <h3 class={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, class: className = "" }: CardProps) {
  return (
    <p class={`text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, class: className = "" }: CardProps) {
  return (
    <div class={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, class: className = "" }: CardProps) {
  return (
    <div class={`p-4 border-t bg-gray-50 ${className}`}>
      {children}
    </div>
  );
} 