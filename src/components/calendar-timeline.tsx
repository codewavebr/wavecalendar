"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";

export interface CalendarTimelineProps {
  firstVisibleHour: number;
  lastVisibleHour: number;
}

export function CalendarTimeline({
  firstVisibleHour,
  lastVisibleHour,
}: CalendarTimelineProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  if (currentHour < firstVisibleHour || currentHour >= lastVisibleHour) {
    return null;
  }

  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const visibleStartMinutes = firstVisibleHour * 60;
  const visibleEndMinutes = lastVisibleHour * 60;
  const top =
    ((minutes - visibleStartMinutes) /
      (visibleEndMinutes - visibleStartMinutes)) *
    100;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-50 border-t border-primary"
      style={{ top: `${top}%` }}
    >
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-1 text-xs text-white">
        {format(currentTime, "HH:mm", { locale: ptBR })}
      </div>
    </div>
  );
}
