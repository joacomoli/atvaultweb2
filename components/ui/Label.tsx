import { JSX } from "preact";

interface LabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export function Label({ htmlFor, class: className, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      class={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
} 