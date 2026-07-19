import * as React from "react";
import { createPortal } from "react-dom";

/**
 * HDS Modal — 레퍼런스 구현.
 *
 * 스타일은 semantic 토큰에서 생성된 CSS 변수(--hds-*)만 참조합니다.
 * 색/간격을 절대 하드코딩하지 않습니다. 토큰 변경은 tokens/ 에서 하고
 * `/hds:token-export` 로 tokens.css 를 재생성하세요.
 *
 * cn() 은 프로젝트의 className 병합 유틸(clsx+tailwind-merge)로 대체하세요.
 *
 * 포함된 동작: ESC 닫기, 오버레이 클릭 닫기(옵션), 열릴 때 포커스 이동,
 * 닫힐 때 포커스 복귀, 열려 있는 동안 포커스 트랩, body 포털 렌더링.
 */

type Size = "sm" | "md" | "lg";

export interface ModalProps {
  /** 표시 여부(제어 컴포넌트) */
  open: boolean;
  /** ESC·오버레이 클릭 등으로 닫기를 요청할 때 호출 */
  onClose: () => void;
  /** 다이얼로그 제목. aria-labelledby 로 연결됨 */
  title: React.ReactNode;
  children?: React.ReactNode;
  /** 우측 정렬 액션 버튼 영역 */
  footer?: React.ReactNode;
  size?: Size;
  /** 오버레이 클릭 시 닫기 허용 여부. 파괴적 확인 모달은 false 권장 */
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizes: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  function Modal(
    {
      open,
      onClose,
      title,
      children,
      footer,
      size = "md",
      closeOnOverlayClick = true,
      className,
    },
    ref
  ) {
    const titleId = React.useId();
    const panelRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);
    const [visible, setVisible] = React.useState(false);

    // 열릴 때: 직전 포커스를 저장하고 패널 내부로 포커스를 옮긴다.
    // 닫힐 때(언마운트): 직전 포커스로 되돌린다.
    React.useEffect(() => {
      if (!open) return;
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const raf = requestAnimationFrame(() => {
        setVisible(true);
        const focusable = panelRef.current ? getFocusable(panelRef.current) : [];
        (focusable[0] ?? panelRef.current)?.focus();
      });
      return () => {
        cancelAnimationFrame(raf);
        previousFocusRef.current?.focus();
      };
    }, [open]);

    // ESC 닫기 + Tab 포커스 트랩
    React.useEffect(() => {
      if (!open) return;

      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key !== "Tab" || !panelRef.current) return;
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-[var(--hds-space-inset-md)]",
          "bg-[var(--hds-bg-overlay)]",
          "transition-opacity duration-[var(--hds-duration-base)] ease-[var(--hds-ease-emphasized)] motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0"
        )}
        onMouseDown={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={mergeRefs(panelRef, ref)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            "flex w-full flex-col gap-[var(--hds-space-stack-md)] rounded-[var(--hds-radius-lg)]",
            "bg-[var(--hds-bg-base)] border border-[var(--hds-border-base)] p-[var(--hds-space-inset-lg)]",
            "transition-[opacity,transform] duration-[var(--hds-duration-base)] ease-[var(--hds-ease-emphasized)] motion-reduce:transition-none",
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0",
            sizes[size],
            className
          )}
        >
          <h2
            id={titleId}
            className="text-lg font-semibold leading-snug text-[var(--hds-fg-base)]"
          >
            {title}
          </h2>
          {children && (
            <div className="text-sm leading-relaxed text-[var(--hds-fg-base)]">
              {children}
            </div>
          )}
          {footer && (
            <div className="flex items-center justify-end gap-[var(--hds-space-stack-sm)]">
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }
);
