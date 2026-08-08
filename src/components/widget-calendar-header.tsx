"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@codewave/wavekit/ui";

import type { TCalendarView } from "../scheduler-types";

export type WidgetCalendarView = Extract<TCalendarView, "week" | "month" | "year">;

export interface WidgetCalendarHeaderProps {
  currentDate: Date;
  view: WidgetCalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: WidgetCalendarView) => void;
  onDateChange?: (date: Date) => void;
}

export function WidgetCalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onViewChange,
}: WidgetCalendarHeaderProps) {
  const formatTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }

    if (view === "week") {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return `${format(startOfWeek, "dd", { locale: ptBR })} - ${format(endOfWeek, "dd MMM yyyy", { locale: ptBR })}`;
    }

    return format(currentDate, "yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={view}
        onValueChange={(value: string) =>
          onViewChange(value as WidgetCalendarView)
        }
      >
        <TabsList className="flex h-9 w-full gap-1 rounded-lg bg-background p-0.5">
          <TabsTrigger value="week" className="flex-1 text-xs">
            Semana
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1 rounded-lg text-xs">
            Mes
          </TabsTrigger>
          <TabsTrigger value="year" className="flex-1 rounded-lg text-xs">
            Ano
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="rounded-full p-2 hover:bg-background"
          title="Periodo anterior"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-md font-medium capitalize">{formatTitle()}</h2>
        <button
          onClick={onNext}
          className="rounded-full p-2 hover:bg-background"
          title="Proximo periodo"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
