import * as React from "react";

/**
 * HDS Textarea — 레퍼런스 구현.
 *
 * HES(🧱 Template/textarea) 매핑: line=textarea/textareaL · box=textareaBox.
 * maxLength 지정 시 우하단에 "n/한도자" 카운터가 자동 노출됩니다.
 * 스타일은 semantic 토큰 CSS 변수(--hds-*)만 참조합니다.
 */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "line" | "box";
  label?: string;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = "line",
      label,
      error = false,
      errorMessage,
      clearable = true,
      maxLength,
      rows = 3,
      disabled,
      className,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) {
    const id = React.useId();
    const guideId = React.useId();
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = React.useState(false);
    // 카운터용 글자수 — 제어/비제어 모두 지원
    const [count, setCount] = React.useState(
      String(value ?? defaultValue ?? "").length
    );
    React.useEffect(() => {
      if (value !== undefined) setCount(String(value).length);
    }, [value]);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    const clear = () => {
      const node = innerRef.current;
      if (!node) return;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      setter?.call(node, "");
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.focus();
    };

    return (
      <div className={cn("w-full", disabled && "opacity-40", className)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-xs text-[var(--hds-fg-muted)]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative transition-colors duration-[var(--hds-duration-fast)] ease-[var(--hds-ease-standard)]",
            variant === "line" && "border-b pb-6",
            variant === "line" &&
              (error
                ? "border-[var(--hds-feedback-danger)]"
                : focused
                  ? "border-[var(--hds-fg-base)]"
                  : "border-[var(--hds-border-strong)]"),
            variant === "box" &&
              "rounded-[var(--hds-radius-md)] bg-[var(--hds-bg-subtle)] p-[var(--hds-space-inset-md)] pb-8"
          )}
        >
          <textarea
            ref={setRefs}
            id={id}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? guideId : undefined}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              if (value === undefined) setCount(e.target.value.length);
              onChange?.(e);
            }}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full resize-none bg-transparent text-base text-[var(--hds-fg-base)]",
              "placeholder:text-[var(--hds-fg-muted)] focus:outline-none",
              clearable && "pr-8"
            )}
            {...props}
          />
          {clearable && focused && count > 0 && (
            <button
              type="button"
              aria-label="입력 내용 지우기"
              // blur 가 클릭보다 먼저 발생해 버튼이 사라지는 것을 막기 위해 mousedown 사용
              onMouseDown={(e) => {
                e.preventDefault();
                clear();
              }}
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-[var(--hds-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hds-focus-ring)]"
            >
              <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-4 w-4">
                <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.35" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="var(--hds-bg-base)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {maxLength !== undefined && (
            <span
              aria-hidden
              className="absolute bottom-1 right-2 text-xs text-[var(--hds-fg-muted)]"
            >
              <span className={cn(count > 0 && "text-[var(--hds-brand-default)]")}>
                {count}
              </span>
              /{maxLength.toLocaleString()}자
            </span>
          )}
        </div>
        {error && errorMessage && (
          <p id={guideId} role="alert" className="mt-1 text-xs text-[var(--hds-feedback-danger)]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
