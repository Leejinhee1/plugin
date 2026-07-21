import * as React from "react";

/**
 * HES Switch — 레퍼런스 구현.
 *
 * HES(🧱 Template/switch) 원본 치수: 트랙 48×24 · 썸 20. 레이블 없는 싱글 타입이므로
 * aria-label(또는 aria-labelledby)이 필수입니다.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 */

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ disabled, className, ...props }, ref) {
    return (
      <label
        className={cn(
          "relative inline-block h-6 w-12 shrink-0",
          disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-[var(--hes-radius-full)]",
            "bg-[var(--hes-bg-muted)] peer-checked:bg-[var(--hes-brand-default)]",
            "transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--hes-focus-ring)] peer-focus-visible:ring-offset-2",
            "after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5",
            "after:rounded-full after:bg-[var(--hes-fg-on-brand)] after:shadow",
            "after:transition-transform after:duration-[var(--hes-duration-fast)] after:ease-[var(--hes-ease-standard)]",
            "peer-checked:after:translate-x-6"
          )}
        />
      </label>
    );
  }
);
