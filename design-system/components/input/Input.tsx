import * as React from "react";

/**
 * HDS Input — 레퍼런스 구현.
 *
 * 스타일은 semantic 토큰에서 생성된 CSS 변수(--hds-*)만 참조합니다.
 * 색/간격을 절대 하드코딩하지 않습니다. 토큰 변경은 tokens/ 에서 하고
 * `/hds:token-export` 로 tokens.css 를 재생성하세요.
 *
 * cn() 은 프로젝트의 className 병합 유틸(clsx+tailwind-merge)로 대체하세요.
 */

type Size = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  size?: Size;
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
  /** 바깥 wrapper(label + input + helper) 에 적용할 클래스 */
  containerClassName?: string;
}

const fieldBase =
  "w-full bg-[var(--hds-bg-base)] text-[var(--hds-fg-base)] rounded-[var(--hds-radius-md)] " +
  "border border-[var(--hds-border-base)] placeholder:text-[var(--hds-fg-muted)] " +
  "transition-colors duration-[var(--hds-duration-fast)] ease-[var(--hds-ease-standard)] " +
  "hover:border-[var(--hds-border-strong)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hds-focus-ring)] focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const invalidField =
  "border-[var(--hds-feedback-danger)] hover:border-[var(--hds-feedback-danger)] " +
  "focus-visible:ring-[var(--hds-feedback-danger)]";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const sizesWithIcon: Record<Size, string> = {
  sm: "h-8 pl-9 pr-3 text-sm",
  md: "h-10 pl-10 pr-4 text-sm",
  lg: "h-12 pl-11 pr-5 text-base",
};

const iconPosition: Record<Size, string> = {
  sm: "left-3",
  md: "left-3",
  lg: "left-4",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useFallbackId(providedId?: string) {
  const reactId = React.useId();
  return providedId ?? `hds-input-${reactId}`;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      helperText,
      errorMessage,
      size = "md",
      invalid = false,
      disabled,
      leadingIcon,
      id,
      className,
      containerClassName,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) {
    const inputId = useFallbackId(id);
    const isInvalid = invalid || Boolean(errorMessage);
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const showError = isInvalid && errorMessage;
    const showHelper = !showError && helperText;

    const describedBy =
      cn(
        showError && errorId,
        showHelper && helperId,
        ariaDescribedBy
      ) || undefined;

    return (
      <div className={cn("flex flex-col gap-[var(--hds-space-stack-sm)]", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--hds-fg-base)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute flex items-center text-[var(--hds-fg-muted)]",
                iconPosition[size]
              )}
            >
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              fieldBase,
              leadingIcon ? sizesWithIcon[size] : sizes[size],
              isInvalid && invalidField,
              className
            )}
            {...props}
          />
        </div>
        {showError ? (
          <p id={errorId} className="text-xs text-[var(--hds-feedback-danger)]">
            {errorMessage}
          </p>
        ) : showHelper ? (
          <p id={helperId} className="text-xs text-[var(--hds-fg-muted)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
