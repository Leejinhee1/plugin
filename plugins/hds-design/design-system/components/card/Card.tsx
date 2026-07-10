import * as React from "react";

/**
 * HDS Card — 레퍼런스 구현.
 *
 * 스타일은 semantic 토큰에서 생성된 CSS 변수(--hds-*)만 참조합니다.
 * 색/간격을 절대 하드코딩하지 않습니다. 토큰 변경은 tokens/ 에서 하고
 * `/hds-publish:token-export` 로 tokens.css 를 재생성하세요.
 *
 * cn() 은 프로젝트의 className 병합 유틸(clsx+tailwind-merge)로 대체하세요.
 *
 * 구성: Card > (CardHeader, CardBody, CardFooter). CardTitle 은 CardHeader 안에서 사용.
 */

type Variant = "default" | "elevated";
type Padding = "sm" | "md" | "lg";
type HeadingLevel = "h2" | "h3" | "h4";

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const paddingClass: Record<Padding, string> = {
  sm: "p-[var(--hds-space-inset-sm)]",
  md: "p-[var(--hds-space-inset-md)]",
  lg: "p-[var(--hds-space-inset-lg)]",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { variant = "default", padding = "md", className, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-[var(--hds-space-stack-md)] rounded-[var(--hds-radius-lg)] " +
            "bg-[var(--hds-bg-base)] border border-[var(--hds-border-base)]",
          variant === "elevated" &&
            "shadow-[0_4px_16px_-4px_var(--hds-border-base)]",
          paddingClass[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between gap-[var(--hds-space-stack-sm)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ as = "h3", className, children, ...props }, ref) {
    const Tag = as;
    return (
      <Tag
        ref={ref}
        className={cn(
          "text-base font-semibold leading-snug text-[var(--hds-fg-base)]",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "text-sm leading-relaxed text-[var(--hds-fg-base)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-end gap-[var(--hds-space-stack-sm)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
