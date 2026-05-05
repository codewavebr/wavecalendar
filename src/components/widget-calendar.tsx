"use client";

import { useState } from "react";
import {
  addMonths,
  addWeeks,
  addYears,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import { WidgetCalendarHeader, type WidgetCalendarView } from "./widget-calendar-header";
import { WidgetWeekView } from "./widget-week-view";
import { WidgetYearView } from "./widget-year-view";
import { YearViewMonth } from "./year-view-month";

import type { IEvent } from "../scheduler-interfaces";

export interface WidgetCalendarProps {
  events?: IEvent[];
  initialView?: WidgetCalendarView;
  onDateSelect?: (date: Date) => void;
}

export function WidgetCalendar({
  events = [],
  initialView = "month",
  onDateSelect,
}: WidgetCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<WidgetCalendarView>(initialView);

  const handlePrevious = () => {
    switch (view) {
      case "month":
        setCurrentMonth((previousDate) => subMonths(previousDate, 1));
        break;
      case "week":
        setCurrentMonth((previousDate) => subWeeks(previousDate, 1));
        break;
      case "year":
        setCurrentMonth((previousDate) => subYears(previousDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "month":
        setCurrentMonth((previousDate) => addMonths(previousDate, 1));
        break;
      case "week":
        setCurrentMonth((previousDate) => addWeeks(previousDate, 1));
        break;
      case "year":
        setCurrentMonth((previousDate) => addYears(previousDate, 1));
        break;
    }
  };

  const handleMonthClick = (date: Date) => {
    setCurrentMonth(date);
    setView("month");
  };

  const handleDateChange = (date: Date) => {
    setCurrentMonth(date);
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
      <WidgetCalendarHeader
        currentDate={currentMonth}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={setView}
        onDateChange={handleDateChange}
      />
      <div className="mt-4">
        {view === "month" && (
          <YearViewMonth
            month={currentMonth}
            isWidget={true}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              onDateSelect?.(date);
            }}
            onViewChange={(nextView) => setView(nextView as WidgetCalendarView)}
          />
        )}
        {view === "week" && (
          <WidgetWeekView
            currentDate={currentMonth}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              onDateSelect?.(date);
            }}
            onViewChange={(nextView) => setView(nextView as WidgetCalendarView)}
          />
        )}
        {view === "year" && (
          <WidgetYearView
            currentDate={currentMonth}
            onMonthClick={handleMonthClick}
          />
        )}
      </div>
    </div>
  );
}
