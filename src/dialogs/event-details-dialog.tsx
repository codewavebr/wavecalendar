"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@codewavebr/wavekit/ui";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Text, Trash2, User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { useWaveCalendarDeleteEvent } from "../scheduler-mutations";
import { EditEventDialog } from "./edit-event-dialog";

import type { IEvent } from "../scheduler-interfaces";

export interface EventDetailsDialogProps {
  event: IEvent;
  children: ReactNode;
}

const capitalizeLongWords = (value: string) =>
  value
    .split(" ")
    .map((word) =>
      word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

export function EventDetailsDialog({ event, children }: EventDetailsDialogProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const [open, setOpen] = useState(false);
  const { deleteEvent, loading, error } = useWaveCalendarDeleteEvent();

  const handleDelete = async () => {
    const success = await deleteEvent(event);
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <DetailRow icon={<User className="mt-1 size-4 shrink-0" />} label="Responsavel">
            {event.user.name}
          </DetailRow>
          <DetailRow icon={<Calendar className="mt-1 size-4 shrink-0" />} label="Inicio">
            {capitalizeLongWords(
              format(startDate, "dd 'de' MMMM yyyy 'as' HH:mm", {
                locale: ptBR,
              }),
            )}
          </DetailRow>
          <DetailRow icon={<Clock className="mt-1 size-4 shrink-0" />} label="Termino">
            {capitalizeLongWords(
              format(endDate, "dd 'de' MMMM yyyy 'as' HH:mm", {
                locale: ptBR,
              }),
            )}
          </DetailRow>
          <DetailRow icon={<Text className="mt-1 size-4 shrink-0" />} label="Descricao">
            {event.description}
          </DetailRow>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <EditEventDialog event={event}>
            <Button type="button" variant="outline">
              Editar
            </Button>
          </EditEventDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size="sm">
                <Trash2 className="mr-2 size-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este evento? Esta acao nao pode
                  ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loading ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
