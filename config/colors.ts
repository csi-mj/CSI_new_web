export const iconColors = {
  blue: "text-blue-500",
  green: "text-green-500",
  purple: "text-purple-500",
  orange: "text-orange-500",
  indigo: "text-indigo-500",
  yellow: "text-yellow-500",
  teal: "text-teal-500",
  pink: "text-pink-500",
  rose: "text-rose-500",
  cyan: "text-cyan-500",
  red: "text-red-700",
} as const;

export type IconColor = keyof typeof iconColors;

export const bgColors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
  yellow: "bg-yellow-500",
  teal: "bg-teal-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
  red: "bg-red-800"
} as const;

export const translucentBgColors = {
  blue: "bg-blue-500/30",
  green: "bg-green-500/30",
  purple: "bg-purple-500/30",
  orange: "bg-orange-500/30",
  indigo: "bg-indigo-500/30",
  yellow: "bg-yellow-500/20",
  teal: "bg-teal-500/30",
  pink: "bg-pink-500/30",
  rose: "bg-rose-500/30",
  cyan: "bg-cyan-500/30",
  red: "bg-red-800/30"
} as const;

export const afterBgColors = {
  blue: "after:bg-blue-500",
  green: "after:bg-green-500",
  purple: "after:bg-purple-500",
  orange: "after:bg-orange-500",
  indigo: "after:bg-indigo-500",
  yellow: "after:bg-yellow-500",
  teal: "after:bg-teal-500",
  pink: "after:bg-pink-500",
  rose: "after:bg-rose-500",
  cyan: "after:bg-cyan-500",
  red: "after:bg-red-800"
} as const;

export const borderColors = {
  blue: "border-blue-500/30",
  green: "border-green-500/30",
  purple: "border-purple-500/30",
  orange: "border-orange-500/30",
  indigo: "border-indigo-500/30",
  yellow: "border-yellow-500/30",
  teal: "border-teal-500/30",
  pink: "border-pink-500/30",
  rose: "border-rose-500/30",
  cyan: "border-cyan-500/30",
  red: "border-red-800/30"
} as const;
