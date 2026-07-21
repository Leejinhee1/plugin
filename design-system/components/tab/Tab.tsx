import * as React from "react";

/**
 * HES Tab — 레퍼런스 구현.
 *
 * HES(🧱 Template/tab) 매핑: underline=tab/tab2/tabScroll · round=tabRound · toggle=tabToggle.
 * underline 은 4개 이하 균등 분할, 5개 이상 가로 스크롤(HES 규칙)로 자동 전환됩니다.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 */

export interface TabItem {
  value: string;
  label: string;
  /** toggle 전용 — 라벨 아래 작은 서브 텍스트 (HES SubText) */
  subLabel?: string;
  disabled?: boolean;
}

export interface TabProps {
  variant?: "underline" | "round" | "toggle";
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** round 전용 — 상단 sticky (HES isSticky) */
  isSticky?: boolean;
  "aria-label": string;
  className?: string;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Tab({
  variant = "underline",
  items,
  value,
  onChange,
  isSticky = false,
  className,
  ...aria
}: TabProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const scrollable = variant === "underline" && items.length > 4;

  // 좌우 방향키 이동 (roving tabindex)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === value);
    const next =
      enabled[
        (idx + (e.key === "ArrowRight" ? 1 : enabled.length - 1)) % enabled.length
      ];
    if (next) {
      onChange(next.value);
      listRef.current
        ?.querySelector<HTMLElement>(`[data-value="${next.value}"]`)
        ?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={aria["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn(
        variant === "underline" &&
          cn(
            "flex border-b border-[var(--hes-border-base)]",
            scrollable && "overflow-x-auto [scrollbar-width:none]"
          ),
        variant === "round" &&
          cn("flex flex-wrap gap-2", isSticky && "sticky top-0 z-10"),
        variant === "toggle" &&
          "grid grid-cols-2 gap-px overflow-hidden rounded-[var(--hes-radius-sm)] border border-[var(--hes-border-base)] bg-[var(--hes-border-base)]",
        className
      )}
    >
      {items.map((item) => {
        const selected = item.value === value;
        const base =
          "transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--hes-focus-ring)] " +
          "disabled:opacity-40 disabled:pointer-events-none select-none";
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-value={item.value}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            ref={(node) => {
              if (selected && scrollable)
                node?.scrollIntoView({ block: "nearest", inline: "nearest" });
            }}
            className={cn(
              base,
              variant === "underline" &&
                cn(
                  "relative px-4 py-3.5 text-base whitespace-nowrap",
                  scrollable ? "shrink-0" : "flex-1",
                  selected
                    ? "font-bold text-[var(--hes-fg-base)] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[var(--hes-fg-base)]"
                    : "text-[var(--hes-fg-muted)]"
                ),
              variant === "round" &&
                cn(
                  "rounded-[var(--hes-radius-full)] px-4 py-2 text-sm whitespace-nowrap",
                  selected
                    ? "bg-[var(--hes-brand-default)] font-bold text-[var(--hes-fg-on-brand)]"
                    : cn(
                        "text-[var(--hes-fg-muted)]",
                        // sticky 로 뜰 때 미선택 필은 배경 없음 (HES 규칙)
                        isSticky ? "bg-transparent" : "bg-[var(--hes-bg-subtle)]"
                      )
                ),
              variant === "toggle" &&
                cn(
                  "flex flex-col items-center justify-center px-3 py-2.5 text-sm",
                  selected
                    ? "bg-[var(--hes-bg-base)] font-bold text-[var(--hes-fg-base)] outline outline-1 -outline-offset-1 outline-[var(--hes-border-strong)]"
                    : "bg-[var(--hes-bg-subtle)] text-[var(--hes-fg-muted)]"
                )
            )}
          >
            {item.label}
            {variant === "toggle" && item.subLabel && (
              <span className="mt-0.5 text-xs font-normal text-[var(--hes-fg-muted)]">
                {item.subLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
