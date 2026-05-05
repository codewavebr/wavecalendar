import {
  CalendarRange,
  Columns,
  Grid2x2,
  Grid3x3,
  List,
  Plus,
} from "lucide-react";

import { useCalendar } from "../scheduler-context";
import { useCalendarSlots } from "../scheduler-slots";
import { DateNavigator } from "./date-navigator";
import { TodayButton } from "./today-button";
import { UserSelect } from "./user-select";

import type { IEvent } from "../scheduler-interfaces";
import type { TCalendarView } from "../scheduler-types";

const viewOptions: Array<{
  view: TCalendarView;
  label: string;
  icon: typeof List;
}> = [
  { view: "day", label: "Visualizar por dia", icon: List },
  { view: "week", label: "Visualizar por semana", icon: Columns },
  { view: "month", label: "Visualizar por mes", icon: Grid2x2 },
  { view: "year", label: "Visualizar por ano", icon: Grid3x3 },
  { view: "agenda", label: "Visualizar por agenda", icon: CalendarRange },
];

export interface CalendarHeaderProps {
  events: IEvent[];
}

export function CalendarHeader({ events }: CalendarHeaderProps) {
  const { view, setView } = useCalendar();
  const { renderAddEvent } = useCalendarSlots();

  const addButton = (
    <button
      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      type="button"
    >
      <Plus className="-ms-1 mr-2 size-4 opacity-60" aria-hidden="true" />
      Novo Agendamento
    </button>
  );

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator events={events} />
      </div>

      <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center gap-1.5">
          <div className="inline-flex">
            {viewOptions.map((option, index) => {
              const Icon = option.icon;
              const first = index === 0;
              const last = index === viewOptions.length - 1;

              return (
                <button
                  key={option.view}
                  aria-label={option.label}
                  type="button"
                  className={[
                    "inline-flex size-10 items-center justify-center border text-sm font-medium hover:bg-accent",
                    view === option.view
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background",
                    first && "rounded-l-md",
                    last && "rounded-r-md",
                    !first && "-ml-px",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setView(option.view)}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </button>
              );
            })}
          </div>

          <UserSelect />
        </div>

        {renderAddEvent({}, addButton)}
      </div>
    </div>
  );
}
