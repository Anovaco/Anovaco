import type { SVGProps } from "react";

interface AnovaLogoProps extends SVGProps<SVGSVGElement> {
  variant?: "solid" | "outlined" | "ghost";
  size?: number;
}

export function AnovaLogo({ variant = "solid", size = 30, ...props }: AnovaLogoProps) {
  if (variant === "ghost") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
        <rect width="40" height="40" rx="5" fill="rgba(244,241,237,0.08)" />
        <path d="M20 8 L32 30 H26.5 L20 18 L13.5 30 H8 Z" fill="#F4F1ED" />
        <rect x="14" y="22" width="12" height="2" rx="1" fill="#D4AF37" />
      </svg>
    );
  }
  if (variant === "outlined") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
        <rect width="40" height="40" rx="5" fill="rgba(244,241,237,0.08)" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" stroke="rgba(212,175,55,0.3)" strokeWidth="1" fill="none" />
        <path d="M20 8 L32 30 H26.5 L20 18 L13.5 30 H8 Z" fill="#F4F1ED" />
        <rect x="14" y="22" width="12" height="2" rx="1" fill="#D4AF37" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <rect width="40" height="40" rx="5" fill="#1B2B21" />
      <path d="M20 8 L32 30 H26.5 L20 18 L13.5 30 H8 Z" fill="#F4F1ED" />
      <rect x="14" y="22" width="12" height="2" rx="1" fill="#D4AF37" />
    </svg>
  );
}
