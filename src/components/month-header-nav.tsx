import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MonthHeaderNavProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function MonthHeaderNav({
  currentMonth,
  onPrevious,
  onNext,
}: MonthHeaderNavProps) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <button
        onClick={onPrevious}
        className="rounded-full p-2 hover:bg-background"
        aria-label="Mes anterior"
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-md font-medium capitalize">
        {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
      </span>
      <button
        onClick={onNext}
        className="rounded-full p-2 hover:bg-background"
        aria-label="Proximo mes"
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
