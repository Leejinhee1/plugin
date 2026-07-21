import * as React from "react";

/**
 * HES Checkbox — 레퍼런스 구현.
 *
 * HES(🧱 Template/checkbox) 매핑: all=checkAll/chkL · basic=check/chkM · sub=checkSub/chkS
 * · round=checkRound · button=chkBtn. 아이콘 24×24, 라벨 간격 8px.
 * 스타일은 semantic 토큰 CSS 변수(--hes-*)만 참조합니다.
 * 네이티브 input 을 sr-only 로 유지해 키보드/스크린리더 동작을 그대로 확보합니다.
 */

type Variant = "all" | "basic" | "sub" | "round" | "button";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  variant?: Variant;
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
    <path
      d="M6 12.5l4 4 8-9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 원형(채움/라인) 24×24 컨트롤 — all/basic/round 공용. input(peer)의 형제로 렌더해야 함. */
function CircleControl({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
        "border-[var(--hes-border-strong)] bg-[var(--hes-bg-base)]",
        "transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)]",
        "[&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100",
        "peer-checked:border-[var(--hes-brand-default)]",
        filled
          ? "peer-checked:bg-[var(--hes-brand-default)] text-[var(--hes-fg-on-brand)]"
          : "text-[var(--hes-brand-default)]",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--hes-focus-ring)] peer-focus-visible:ring-offset-2"
      )}
    >
      <CheckIcon className="h-4 w-4 transition-opacity" />
    </span>
  );
}

const labelTypo: Record<Variant, string> = {
  all: "text-lg font-bold",
  basic: "text-base",
  sub: "text-sm",
  round: "text-sm",
  button: "text-sm",
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { variant = "basic", disabled, className, children, ...props },
    ref
  ) {
    const isChip = variant === "round" || variant === "button";

    return (
      <label
        className={cn(
          "inline-flex select-none items-center gap-2",
          labelTypo[variant],
          "text-[var(--hes-fg-base)]",
          disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
          isChip &&
            "border transition-colors duration-[var(--hes-duration-fast)] ease-[var(--hes-ease-standard)] " +
              "border-[var(--hes-border-base)] bg-[var(--hes-bg-base)] " +
              "has-[:checked]:border-[var(--hes-brand-default)] has-[:checked]:text-[var(--hes-brand-default)] " +
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--hes-focus-ring)]",
          variant === "round" && "rounded-[var(--hes-radius-full)] px-4 py-2",
          variant === "button" && "rounded-[var(--hes-radius-sm)] px-4 py-2.5",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {variant === "all" && <CircleControl filled />}
        {variant === "basic" && <CircleControl filled={false} />}
        {(variant === "sub" || variant === "button") && (
          <CheckIcon
            className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              "text-[var(--hes-border-strong)] peer-checked:text-[var(--hes-brand-default)]",
              variant === "button" && "hidden peer-checked:block"
            )}
          />
        )}
        {children}
        {variant === "round" && <CircleControl filled={false} />}
      </label>
    );
  }
);
