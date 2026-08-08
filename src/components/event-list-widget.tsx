"use client";

import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, Clock, Plus, User } from "lucide-react";

import { Button } from "@codewavebr/wavekit/ui";
import { cn } from "@codewavebr/wavekit/utils";
import { useCalendar } from "../scheduler-context";
import { AddEventDialog, EventDetailsDialog } from "../dialogs";

import type { IEvent, IUser } from "../scheduler-interfaces";

export interface EventListWidgetProps {
  title?: string;
  maxItems?: number;
  addEventButton?: boolean;
  events?: IEvent[];
  users?: IUser[];
  selectedDate?: Date;
}

const eventColorClasses = {
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  gray: "bg-neutral-400",
};

export function EventListWidget({
  title = "Seus Agendamentos",
  maxItems = 5,
  addEventButton = false,
  events: propEvents,
  users: propUsers,
  selectedDate: propSelectedDate,
}: EventListWidgetProps) {
  let calendarContext: ReturnType<typeof useCalendar> | null = null;

  try {
    calendarContext = useCalendar();
  } catch {
    calendarContext = null;
  }

  const events = propEvents || calendarContext?.events || [];
  const users = propUsers || calendarContext?.users || [];
  const selectedDate = propSelectedDate || calendarContext?.selectedDate || new Date();
  const now = new Date();

  const dayEvents = events
    .filter((event) => isSameDay(parseISO(event.startDate), selectedDate))
    .sort(
      (a, b) =>
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
    )
    .slice(0, maxItems);

  function isHappeningNow(event: { startDate: string; endDate: string }) {
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);
    return isBefore(start, now) && isAfter(end, now);
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {addEventButton && (
          <AddEventDialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              title="Adicionar novo agendamento"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </AddEventDialog>
        )}
      </div>

      {dayEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum agendamento para este dia.
        </p>
      ) : (
        <ul className="space-y-3">
          {dayEvents.map((event) => {
            const user = users.find((item) => item.id === event.user.id);
            const happeningNow = isHappeningNow(event);

            return (
              <li key={event.id} className="flex items-center gap-4">
                <EventDetailsDialog event={event}>
                  <button
                    type="button"
                    className={cn(
                      "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-mainColor text-white",
                      eventColorClasses[event.color],
                    )}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </EventDetailsDialog>

                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  {happeningNow && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-green-400" />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Acontecendo agora
                      </span>
                    </div>
                  )}
                  {user && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="size-3.5" />
                      <span className="text-xs text-muted-foreground">
                        {user.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarIcon className="size-3.5" />
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(event.startDate), "dd 'de' MMMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(event.startDate), "HH:mm")} -{" "}
                      {format(parseISO(event.endDate), "HH:mm")}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
