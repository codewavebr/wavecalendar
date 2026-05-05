import type { TEventColor } from "../scheduler-types";

const eventBulletColorClasses: Record<TEventColor, string> = {
  blue: "bg-blue-400 dark:bg-blue-500",
  green: "bg-green-400 dark:bg-green-500",
  red: "bg-red-400 dark:bg-red-500",
  yellow: "bg-yellow-400 dark:bg-yellow-500",
  purple: "bg-purple-400 dark:bg-purple-500",
  gray: "bg-neutral-400 dark:bg-neutral-500",
  orange: "bg-orange-400 dark:bg-orange-500",
};

export function EventBullet({
  color,
  className,
}: {
  color: TEventColor;
  className?: string;
}) {
  return (
    <div
      className={[
        "size-2 rounded-full",
        eventBulletColorClasses[color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
