import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useCalendar } from "../scheduler-context";

export function TodayButton() {
  const { setSelectedDate } = useCalendar();
  const today = new Date();

  return (
    <button
      className="flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onClick={() => setSelectedDate(today)}
      title="Ir para hoje"
      aria-label="Ir para hoje"
      type="button"
    >
      <p className="flex h-6 w-full items-center justify-center bg-mainColor text-center text-xs font-semibold text-white">
        {format(today, "MMM", { locale: ptBR }).toUpperCase()}
      </p>
      <p className="flex w-full items-center justify-center text-lg font-bold">
        {today.getDate()}
      </p>
    </button>
  );
}
