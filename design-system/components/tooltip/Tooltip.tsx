import * as React from "react";

/**
 * HES Tooltip — 레퍼런스 구현.
 *
 * HES(🧱 Template/tooltip) 매핑: 기본=tooltip · title 지정 시=tooltipTitle.
 * 트리거 클릭 시 하단에 노출되는 클릭형이며 min 150 / max 260 크기 규칙을 따릅니다.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 */

export interface TooltipProps {
  open: boolean;
  onClose: () => void;
  text: React.ReactNode;
  subText?: React.ReactNode;
  title?: React.ReactNode;
  /** 트리거 버튼 위치 기준 박스 정렬 — 트리거가 화면 왼쪽에 가까우면 left (HES 규칙) */
  position?: "center" | "left" | "right";
  /** 트리거 요소(주로 ⓘ 아이콘 버튼) */
  children: React.ReactNode;
  className?: string;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const positions = {
  center: "left-1/2 -translate-x-1/2",
  left: "left-0",
  right: "right-0",
} as const;

export function Tooltip({
  open,
  onClose,
  text,
  subText,
  title,
  position = "center",
  children,
  className,
}: TooltipProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null);

  // ESC·바깥 클릭으로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  return (
    <span ref={rootRef} className={cn("relative inline-block", className)}>
      {children}
      {open && (
        <div
          role="note"
          className={cn(
            "absolute top-full z-40 mt-2 min-w-[150px] max-w-[260px]",
            positions[position],
            "rounded-[var(--hes-radius-sm)] border border-[var(--hes-border-base)]",
            "bg-[var(--hes-bg-base)] p-[var(--hes-space-inset-md)] shadow-md",
            "text-left text-sm leading-relaxed text-[var(--hes-fg-base)]"
          )}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {title && <p className="mb-1 font-bold">{title}</p>}
              <p>{text}</p>
              {subText && (
                <p className="mt-1 text-xs text-[var(--hes-fg-muted)]">{subText}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="-m-1 grid h-8 w-8 shrink-0 place-items-center text-[var(--hes-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hes-focus-ring)]"
            >
              <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
