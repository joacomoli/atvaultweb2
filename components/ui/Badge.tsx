import { JSX } from "preact";

interface BadgeProps {
  children: JSX.Element | JSX.Element[] | string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  class?: string;
  onClick?: () => void;
}

export function Badge({ 
  children, 
  variant = "default", 
  class: className = "",
  onClick
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  const variantStyles = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-100 text-red-700 hover:bg-red-200",
    outline: "border border-gray-200 text-gray-900 hover:bg-gray-100"
  };

  return (
    <span 
      class={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
    </span>
  );
} 