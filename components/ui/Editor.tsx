import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface EditorProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (value: string) => void;
}

export function Editor({ id, name, value, onChange, placeholder, required, class: className, ...props }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  const handleInput = (e: JSX.TargetedEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
    onChange?.(target.value);
  };

  return (
    <div class="relative">
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onInput={handleInput}
        placeholder={placeholder}
        required={required}
        class={`min-h-[200px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
} 