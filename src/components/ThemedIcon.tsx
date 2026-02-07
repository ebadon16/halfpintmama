import type { LucideIcon } from "lucide-react";

const sizeMap = {
  xs: { container: "w-5 h-5", icon: 12 },
  sm: { container: "w-8 h-8", icon: 16 },
  md: { container: "w-12 h-12", icon: 24 },
  lg: { container: "w-16 h-16", icon: 32 },
  xl: { container: "w-20 h-20", icon: 40 },
} as const;

const colorMap = {
  sage: { bg: "bg-sage/15", text: "text-sage" },
  terracotta: { bg: "bg-terracotta/15", text: "text-terracotta" },
  pink: { bg: "bg-soft-pink/20", text: "text-soft-pink" },
  "deep-sage": { bg: "bg-deep-sage/15", text: "text-deep-sage" },
  charcoal: { bg: "bg-charcoal/10", text: "text-charcoal/70" },
  white: { bg: "", text: "text-white" },
} as const;

interface ThemedIconProps {
  icon: LucideIcon;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
  bare?: boolean;
  animate?: string;
  className?: string;
}

export function ThemedIcon({
  icon: Icon,
  size = "md",
  color = "sage",
  bare = false,
  animate,
  className = "",
}: ThemedIconProps) {
  const { container, icon: iconSize } = sizeMap[size];
  const { bg, text } = colorMap[color];

  if (bare) {
    return (
      <Icon
        size={iconSize}
        className={`${text} ${animate ?? ""} ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`${container} ${bg} rounded-full flex items-center justify-center ${animate ?? ""} ${className}`.trim()}
    >
      <Icon size={iconSize} className={text} />
    </div>
  );
}
