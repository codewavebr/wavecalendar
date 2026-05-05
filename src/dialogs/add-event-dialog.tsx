"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SingleDayPicker,
  Textarea,
} from "@codewave/wavekit/ui";
import { ptBR } from "date-fns/locale";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
  createDefaultEventFormValues,
  WAVE_CALENDAR_EVENT_COLOR_OPTIONS,
  type WaveCalendarEventFormValues,
  type WaveCalendarTimeValue,
} from "../scheduler-form";
import { useCalendar } from "../scheduler-context";
import { useWaveCalendarCreateEvent } from "../scheduler-mutations";
import { waveCalendarEventFormSchema } from "../scheduler-schema";

export interface AddEventDialogProps {
  children: ReactNode;
  startDate?: Date;
  startTime?: WaveCalendarTimeValue;
}

export function AddEventDialog({
  children,
  startDate,
  startTime,
}: AddEventDialogProps) {
  const { users } = useCalendar();
  const { addEvent, loading, error } = useWaveCalendarCreateEvent();
  const [open, setOpen] = useState(false);

  const form = useForm<WaveCalendarEventFormValues>({
    resolver: zodResolver(waveCalendarEventFormSchema),
    defaultValues: createDefaultEventFormValues({ startDate, startTime }),
  });

  const onSubmit = async (values: WaveCalendarEventFormValues) => {
    try {
      await addEvent(values);
      setOpen(false);
      form.reset(createDefaultEventFormValues());
    } catch (err) {
      console.error("Erro ao criar evento:", err);
    }
  };

  useEffect(() => {
    form.reset(createDefaultEventFormValues({ startDate, startTime }));
  }, [startDate, startTime, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo evento</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo evento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="user"
              render={({ field, fieldState }) => {
                const selectedUser = users.find(
                  (user) => user.id === field.value,
                );

                return (
                  <FormItem>
                    <FormLabel>Responsavel</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Selecione uma opcao">
                            {selectedUser
                              ? selectedUser.name
                              : "Selecione uma opcao"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-6">
                                    <AvatarImage
                                      src={user.picturePath ?? undefined}
                                      alt={user.name}
                                    />
                                    <AvatarFallback className="text-xxs">
                                      {user.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="truncate text-sm">
                                    {user.name}
                                  </p>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              Nenhum usuario disponivel
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <EventTextFields control={form.control} />
            <EventDateTimeFields control={form.control} />
            <EventColorField control={form.control} />
            <EventDescriptionField control={form.control} />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button form="event-form" type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar evento"}
          </Button>
        </DialogFooter>

        {error && (
          <div className="px-6 pb-4">
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventTextFields({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel htmlFor="title">Titulo</FormLabel>
          <FormControl>
            <Input
              id="title"
              placeholder="Digite um titulo"
              data-invalid={fieldState.invalid}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EventDateTimeFields({ control }: { control: any }) {
  return (
    <>
      <div className="flex items-start gap-2">
        <FormField
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormLabel htmlFor="startDate">Data de inicio</FormLabel>
              <FormControl>
                <SingleDayPicker
                  id="startDate"
                  value={field.value}
                  onSelect={(date) => field.onChange(date as Date)}
                  placeholder="Selecione uma data"
                  locale={ptBR}
                  data-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="startTime"
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormLabel>Hora de inicio</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={
                    field.value
                      ? `${field.value.hour.toString().padStart(2, "0")}:${field.value.minute.toString().padStart(2, "0")}`
                      : ""
                  }
                  onChange={(event) => {
                    const [hour, minute] = event.target.value
                      .split(":")
                      .map(Number);
                    if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
                      field.onChange({ hour, minute });
                    }
                  }}
                  data-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-start gap-2">
        <FormField
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormLabel>Data de termino</FormLabel>
              <FormControl>
                <SingleDayPicker
                  value={field.value}
                  onSelect={(date) => field.onChange(date as Date)}
                  placeholder="Selecione uma data"
                  locale={ptBR}
                  data-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="endTime"
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormLabel>Hora de termino</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={
                    field.value
                      ? `${field.value.hour.toString().padStart(2, "0")}:${field.value.minute.toString().padStart(2, "0")}`
                      : ""
                  }
                  onChange={(event) => {
                    const [hour, minute] = event.target.value
                      .split(":")
                      .map(Number);
                    if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
                      field.onChange({ hour, minute });
                    }
                  }}
                  data-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function EventColorField({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Cor</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger data-invalid={fieldState.invalid}>
                <SelectValue placeholder="Selecione uma opcao" />
              </SelectTrigger>
              <SelectContent>
                {WAVE_CALENDAR_EVENT_COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-3.5 rounded-full ${option.className}`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EventDescriptionField({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Descricao</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              value={field.value}
              data-invalid={fieldState.invalid}
              placeholder="Digite uma descricao"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
