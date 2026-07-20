import * as React from "react";
import { createPortal } from "react-dom";

/**
 * HDS Toast / Snackbar — 레퍼런스 구현.
 *
 * HES(🧱 Template/toast) 매핑: toast=Toast(자동 닫힘) · snackbar=Snackbar(닫기 버튼).
 * 가장자리 간격은 HES 변수 그대로: bottom 24 · bottom+고정버튼 84 · top 102 · top+고정탭 150.
 * 스타일은 semantic 토큰 CSS 변수(--hds-*)만 참조합니다.
 */

export interface ToastProps {
  open: boolean;
  message: React.ReactNode;
  variant?: "toast" | "snackbar";
  align?: "center" | "left";
  position?: "bottom" | "top";
  hasFixedBtn?: boolean;
  hasFixedTab?: boolean;
  /** toast 자동 닫힘(ms). snackbar 에선 무시 */
  duration?: number;
  onClose: () => void;
  className?: string;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// HES toast/spacing/* (px)
function edgeOffset(
  position: "bottom" | "top",
  hasFixedBtn: boolean,
  hasFixedTab: boolean
) {
  if (position === "bottom") return hasFixedBtn ? 84 : 24;
  return hasFixedTab ? 150 : 102;
}

export function Toast({
  open,
  message,
  variant = "toast",
  align = variant === "snackbar" ? "left" : "center",
  position = "bottom",
  hasFixedBtn = false,
  hasFixedTab = false,
  duration = 3000,
  onClose,
  className,
}: ToastProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [open]);

  // toast 는 일정 시간 후 자동 닫힘
  React.useEffect(() => {
    if (!open || variant !== "toast") return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, variant, duration, onClose]);

  if (!open || typeof document === "undefined") return null;

  const offset = edgeOffset(position, hasFixedBtn, hasFixedTab);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{ [position]: offset } as React.CSSProperties}
      className={cn(
        "fixed inset-x-0 z-50 flex justify-center px-[var(--hds-space-inset-md)] pointer-events-none",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-start gap-2",
          "rounded-[var(--hds-radius-sm)] bg-[var(--hds-bg-inverse)] text-[var(--hds-fg-on-inverse)]",
          "p-[var(--hds-space-inset-md)] text-sm leading-relaxed",
          "transition-[opacity,transform] duration-[var(--hds-duration-base)] ease-[var(--hds-ease-emphasized)] motion-reduce:transition-none",
          visible
            ? "translate-y-0 opacity-100"
            : cn("opacity-0", position === "bottom" ? "translate-y-2" : "-translate-y-2")
        )}
      >
        <p className={cn("flex-1", align === "center" && "text-center")}>{message}</p>
        {variant === "snackbar" && (
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            // HES comp/snackbar/button/width=44 — 시각 아이콘보다 넓은 터치 영역
            className="-m-3 grid h-11 w-11 shrink-0 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hds-focus-ring)]"
          >
            <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
