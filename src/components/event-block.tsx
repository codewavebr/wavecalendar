import { cva, type VariantProps } from "class-variance-authority";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { DraggableEvent } from "../dnd";
import { useCalendar } from "../scheduler-context";
import { useCalendarSlots } from "../scheduler-slots";

import type { HTMLAttributes } from "react";
import type { IEvent } from "../scheduler-interfaces";

const eventBlockVariants = cva(
  "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      color: {
        blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-400",
        green:
          "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-400",
        red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-400",
        yellow:
          "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-400",
        purple:
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-400",
        orange:
          "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-400",
        gray: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-400",
        "blue-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-400",
        "green-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-400",
        "red-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-400",
        "orange-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-400",
        "purple-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-400",
        "yellow-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-400",
        "gray-dot":
          "bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-400",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  },
);

export interface EventBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof eventBlockVariants>, "color"> {
  event: IEvent;
}

export function EventBlock({ event, className }: EventBlockProps) {
  const { badgeVariant } = useCalendar();
  const { renderEventDetails } = useCalendarSlots();

  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightInPixels = (durationInMinutes / 60) * 96 - 8;
  const color = (
    badgeVariant === "dot" ? `${event.color}-dot` : event.color
  ) as VariantProps<typeof eventBlockVariants>["color"];

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (event.currentTarget instanceof HTMLElement) event.currentTarget.click();
    }
  };

  const trigger = (
    <div
      role="button"
      tabIndex={0}
      className={eventBlockVariants({
        color,
        className: [className, durationInMinutes < 35 && "py-0 justify-center"]
          .filter(Boolean)
          .join(" "),
      })}
      style={{ height: `${heightInPixels}px` }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-1.5 truncate">
        {["mixed", "dot"].includes(badgeVariant) && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            className="event-dot shrink-0"
          >
            <circle cx="4" cy="4" r="4" />
          </svg>
        )}

        <p className="truncate font-semibold">{event.title}</p>
      </div>

      {durationInMinutes > 25 && (
        <p>
          {format(start, "HH:mm", { locale: ptBR })} -{" "}
          {format(end, "HH:mm", { locale: ptBR })}
        </p>
      )}
    </div>
  );

  return (
    <DraggableEvent event={event}>
      {renderEventDetails(event, trigger)}
    </DraggableEvent>
  );
}
