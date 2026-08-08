"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ListBox,
  Modal,
  Select,
  SingleDayPicker,
  TextArea,
  useOverlayState,
} from "@codewavebr/wavekit/ui";
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
  const state = useOverlayState({ isOpen: open, onOpenChange: setOpen });

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
    <Modal state={state}>
      <Modal.Trigger>{children}</Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Adicionar novo evento</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-4 text-sm text-muted-foreground">
                Preencha os dados para criar um novo evento.
              </p>

              <Form {...form}>
                <form
                  id="event-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsavel</FormLabel>
                          <FormControl>
                            <Select
                              placeholder="Selecione uma opcao"
                              selectedKey={field.value || undefined}
                              onSelectionChange={(key) =>
                                field.onChange(key ? String(key) : "")
                              }
                            >
                              <Select.Trigger>
                                <Select.Value />
                                <Select.Indicator />
                              </Select.Trigger>
                              <Select.Popover>
                                <ListBox>
                                  {users.length > 0 ? (
                                    users.map((user) => (
                                      <ListBox.Item
                                        key={user.id}
                                        id={user.id}
                                        textValue={user.name}
                                      >
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
                                      </ListBox.Item>
                                    ))
                                  ) : (
                                    <ListBox.Item
                                      id="__empty"
                                      textValue="Nenhum usuario disponivel"
                                      isDisabled
                                    >
                                      <p className="p-2 text-sm text-muted-foreground">
                                        Nenhum usuario disponivel
                                      </p>
                                    </ListBox.Item>
                                  )}
                                </ListBox>
                              </Select.Popover>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                  />

                  <EventTextFields control={form.control} />
                  <EventDateTimeFields control={form.control} />
                  <EventColorField control={form.control} />
                  <EventDescriptionField control={form.control} />
                </form>
              </Form>

              {error && (
                <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                isDisabled={loading}
                onPress={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                form="event-form"
                type="submit"
                isPending={loading}
              >
                {loading ? "Criando..." : "Criar evento"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
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
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel htmlFor="startDate">Data de inicio</FormLabel>
              <FormControl>
                <SingleDayPicker
                  id="startDate"
                  value={field.value}
                  onSelect={(date) => field.onChange(date as Date)}
                  placeholder="Selecione uma data"
                  locale={ptBR}
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
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Data de termino</FormLabel>
              <FormControl>
                <SingleDayPicker
                  value={field.value}
                  onSelect={(date) => field.onChange(date as Date)}
                  placeholder="Selecione uma data"
                  locale={ptBR}
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
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cor</FormLabel>
          <FormControl>
            <Select
              placeholder="Selecione uma opcao"
              selectedKey={field.value || undefined}
              onSelectionChange={(key) =>
                field.onChange(key ? String(key) : "")
              }
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {WAVE_CALENDAR_EVENT_COLOR_OPTIONS.map((option) => (
                    <ListBox.Item
                      key={option.value}
                      id={option.value}
                      textValue={option.label}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-3.5 rounded-full ${option.className}`}
                        />
                        {option.label}
                      </div>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
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
            <TextArea
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
