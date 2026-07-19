import * as React from "react";

/**
 * HDS Button — 레퍼런스 구현.
 *
 * 스타일은 semantic 토큰에서 생성된 CSS 변수(--hds-*)만 참조합니다.
 * 색/간격을 절대 하드코딩하지 않습니다. 토큰 변경은 tokens/ 에서 하고
 * `/hds:token-export` 로 tokens.css 를 재생성하세요.
 *
 * cn() 은 프로젝트의 className 병합 유틸(clsx+tailwind-merge)로 대체하세요.
 */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--hds-radius-md)] " +
  "transition-colors duration-[var(--hds-duration-fast)] ease-[var(--hds-ease-standard)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hds-focus-ring)] focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--hds-brand-default)] text-[var(--hds-fg-on-brand)] hover:bg-[var(--hds-brand-hover)] active:bg-[var(--hds-brand-active)]",
  secondary:
    "bg-[var(--hds-bg-base)] text-[var(--hds-fg-base)] border border-[var(--hds-border-strong)] hover:bg-[var(--hds-bg-subtle)]",
  ghost:
    "bg-transparent text-[var(--hds-fg-base)] hover:bg-[var(--hds-bg-subtle)]",
  danger:
    "bg-[var(--hds-feedback-danger)] text-[var(--hds-fg-on-brand)] hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    );
  }
);
