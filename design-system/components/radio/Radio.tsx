import * as React from "react";

/**
 * HES Radio / RadioGroup — 레퍼런스 구현.
 *
 * HES(🧱 Template/radio) 매핑: dot=rdo/rdoM · list=rdoList/rdoListCol · listCheck=rdoListChk.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 */

type Variant = "dot" | "list" | "listCheck";

interface GroupContextValue {
  name: string;
  variant: Variant;
  value?: string;
  onChange?: (value: string) => void;
}

const GroupContext = React.createContext<GroupContextValue | null>(null);

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  variant?: Variant;
  /** 버튼형(list/listCheck) 그리드 열 수. 없으면 1행 균등 분할. */
  columns?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({
  name,
  label,
  variant = "dot",
  columns,
  value,
  onChange,
  className,
  children,
}: RadioGroupProps) {
  const isButtons = variant !== "dot";
  return (
    <GroupContext.Provider value={{ name, variant, value, onChange }}>
      <fieldset className={cn("border-0 p-0 m-0", className)}>
        {label && (
          <legend className="mb-2 text-sm text-[var(--hes-fg-muted)]">
            {label}
          </legend>
        )}
        <div
          className={cn(
            isButtons
              ? "grid gap-px overflow-hidden rounded-[var(--hes-radius-xs)] bg-[var(--hes-border-base)] border border-[var(--hes-border-base)]"
              : "flex flex-col gap-3"
          )}
          style={
            isButtons
              ? { gridTemplateColumns: `repeat(${columns ?? React.Children.count(children)}, 1fr)` }
              : undefined
          }
        >
          {children}
        </div>
      </fieldset>
    </GroupContext.Provider>
  );
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ value, disabled, className, children, ...props }, ref) {
    const group = React.useContext(GroupContext);
    if (!group) throw new Error("Radio 는 RadioGroup 안에서만 사용하세요.");
    const { name, variant, value: selected, onChange } = group;
    const controlled = selected !== undefined;

    const input = (
      <input
        ref={ref}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        checked={controlled ? selected === value : undefined}
        onChange={() => onChange?.(value)}
        className="peer sr-only"
        {...props}
      />
    );

    if (variant === "dot") {
      return (
        <label
          className={cn(
            "inline-flex select-none items-center gap-2 text-base text-[var(--hes-fg-base)]",
            disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
            className
          )}
        >
          {input}
          <span
            aria-hidden
            className={cn(
              "grid h-6 w-6 shrink-0 place-items-center rounded-full border bg-[var(--hes-bg-base)]",
              "border-[var(--hes-border-strong)] peer-checked:border-[var(--hes-brand-default)]",
              "transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)]",
              "[&_i]:scale-0 peer-checked:[&_i]:scale-100",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--hes-focus-ring)] peer-focus-visible:ring-offset-2"
            )}
          >
            <i className="block h-3 w-3 rounded-full bg-[var(--hes-brand-default)] transition-transform" />
          </span>
          {children}
        </label>
      );
    }

    // 버튼형 (list / listCheck)
    return (
      <label
        className={cn(
          "relative flex select-none items-center justify-center gap-1 px-2 py-2 text-sm text-center",
          "bg-[var(--hes-bg-subtle)] text-[var(--hes-fg-muted)]",
          "transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)]",
          "has-[:checked]:bg-[var(--hes-bg-base)] has-[:checked]:text-[var(--hes-fg-base)] has-[:checked]:font-bold",
          "has-[:checked]:outline has-[:checked]:outline-1 has-[:checked]:-outline-offset-1 has-[:checked]:outline-[var(--hes-fg-base)]",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-[var(--hes-focus-ring)]",
          disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
          className
        )}
      >
        {input}
        {variant === "listCheck" && (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            fill="none"
            className="hidden h-4 w-4 text-[var(--hes-brand-default)] peer-checked:block"
          >
            <path
              d="M6 12.5l4 4 8-9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {children}
      </label>
    );
  }
);
