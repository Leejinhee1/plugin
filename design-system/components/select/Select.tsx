import * as React from "react";
import { createPortal } from "react-dom";

/**
 * HES Select — 레퍼런스 구현.
 *
 * HES(🧱 Template/select) 매핑: line=wrapSel · box=wrapSelBox · 옵션 시트=layer/layerSelect.
 * 트리거 터치 → 옵션 바텀시트가 열리는 모바일 기준 구성입니다.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 */

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps {
  variant?: "line" | "box";
  label: string;
  hideLabel?: boolean;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    fill="none"
    className={cn(
      "h-5 w-5 shrink-0 text-[var(--hes-fg-muted)] transition-transform duration-[var(--hes-duration-fast)]",
      open && "rotate-180"
    )}
  >
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Select({
  variant = "line",
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  placeholder = "선택",
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  // Modal 과 동일한 진입 트랜지션 패턴: 마운트 다음 프레임에 visible 전환
  React.useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [open]);

  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "w-full text-left transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hes-focus-ring)]",
          "disabled:opacity-40 disabled:pointer-events-none",
          variant === "line" && "border-b pb-2",
          variant === "line" &&
            (error
              ? "border-[var(--hes-feedback-danger)]"
              : open
                ? "border-[var(--hes-fg-base)]"
                : "border-[var(--hes-border-strong)]"),
          variant === "box" &&
            "rounded-[var(--hes-radius-md)] bg-[var(--hes-bg-subtle)] p-[var(--hes-space-inset-md)]"
        )}
      >
        <span
          className={cn(
            "mb-1 block text-xs text-[var(--hes-fg-muted)]",
            hideLabel && "sr-only"
          )}
        >
          {label}
        </span>
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-base",
              selected ? "text-[var(--hes-fg-base)]" : "text-[var(--hes-fg-muted)]"
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <Chevron open={open} />
        </span>
      </button>

      {error && errorMessage && (
        <p role="alert" className="mt-1 text-xs text-[var(--hes-feedback-danger)]">
          {errorMessage}
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[var(--hes-fg-muted)]">{helperText}</p>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          role="dialog"
          aria-label={label}
          className="fixed inset-0 z-50 flex items-end justify-center"
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          <div
            aria-hidden
            onClick={close}
            className={cn(
              "absolute inset-0 bg-[var(--hes-bg-overlay)]",
              "transition-opacity duration-[var(--hes-duration-base)] ease-[var(--hes-ease-emphasized)] motion-reduce:transition-none",
              visible ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "relative w-full max-w-md rounded-t-[var(--hes-radius-xl)] bg-[var(--hes-bg-base)]",
              "p-[var(--hes-space-inset-lg)] pb-[var(--hes-space-inset-md)]",
              "transition-transform duration-[var(--hes-duration-base)] ease-[var(--hes-ease-emphasized)] motion-reduce:transition-none",
              visible ? "translate-y-0" : "translate-y-full"
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--hes-fg-base)]">{label}</h2>
              <button
                type="button"
                aria-label="닫기"
                onClick={close}
                className="grid h-11 w-11 place-items-center text-[var(--hes-fg-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hes-focus-ring)]"
              >
                <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul role="listbox" aria-label={label} className="max-h-[50vh] overflow-y-auto">
              {options.map((o) => {
                const isSelected = o.value === value;
                return (
                  <li key={o.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      autoFocus={isSelected}
                      onClick={() => {
                        onChange?.(o.value);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 py-3 text-left text-base",
                        "text-[var(--hes-fg-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hes-focus-ring)]",
                        isSelected && "font-bold"
                      )}
                    >
                      <span>
                        {o.label}
                        {o.description && (
                          <span className="mt-0.5 block text-xs font-normal text-[var(--hes-fg-muted)]">
                            {o.description}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-5 w-5 text-[var(--hes-brand-default)]">
                          <path d="M6 12.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
