import * as React from "react";

/**
 * HES Badge — 레퍼런스 구현.
 *
 * 스타일은 semantic 토큰에서 생성된 CSS 변수(--hes-*)만 참조합니다.
 * 색/간격을 절대 하드코딩하지 않습니다. 토큰 변경은 tokens/ 에서 하고
 * `/hes:token-export` 로 tokens.css 를 재생성하세요.
 *
 * 비인터랙티브 요소이므로 항상 <span> 으로 렌더링하고 onClick/tabIndex 를 받지 않습니다.
 *
 * cn() 은 프로젝트의 className 병합 유틸(clsx+tailwind-merge)로 대체하세요.
 */

type Variant = "neutral" | "brand" | "success" | "warning" | "danger";
type Size = "sm" | "md";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-1 font-medium rounded-[var(--hes-radius-full)] " +
  "select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  neutral: "bg-[var(--hes-bg-muted)] text-[var(--hes-fg-muted)]",
  brand: "bg-[var(--hes-brand-subtle)] text-[var(--hes-brand-default)]",
  success: "bg-[var(--hes-feedback-success)] text-[var(--hes-fg-on-brand)]",
  warning: "bg-[var(--hes-feedback-warning)] text-[var(--hes-fg-on-brand)]",
  danger: "bg-[var(--hes-feedback-danger)] text-[var(--hes-fg-on-brand)]",
};

const sizes: Record<Size, string> = {
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-xs",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { variant = "neutral", size = "md", className, children, ...props },
    ref
  ) {
    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
