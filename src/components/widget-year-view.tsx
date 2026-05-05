"use client";

import { addMonths, format, isSameMonth, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface WidgetYearViewProps {
  currentDate: Date;
  onMonthClick: (date: Date) => void;
}

export function WidgetYearView({
  currentDate,
  onMonthClick,
}: WidgetYearViewProps) {
  const today = new Date();
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, index) =>
    addMonths(yearStart, index),
  );

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {months.map((month) => {
        const isCurrentMonth = isSameMonth(month, today);

        return (
          <button
            key={month.toISOString()}
            onClick={() => onMonthClick(month)}
            type="button"
            className={[
              "rounded-lg p-2 text-center capitalize",
              isCurrentMonth
                ? "border border-mainColor bg-mainColor/20"
                : "bg-background hover:bg-background/80",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {format(month, "MMM", { locale: ptBR })}
          </button>
        );
      })}
    </div>
  );
}
