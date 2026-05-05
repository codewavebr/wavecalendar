"use client";

import { useState } from "react";

import { useCalendarActions } from "./scheduler-actions";

import type { IEvent } from "./scheduler-interfaces";
import type { WaveCalendarEventFormValues } from "./scheduler-form";

export function useWaveCalendarCreateEvent() {
  const { createEvent } = useCalendarActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = async (eventData: WaveCalendarEventFormValues) => {
    setLoading(true);
    setError(null);

    try {
      return await createEvent(eventData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEvent, loading, error };
}

export function useWaveCalendarUpdateEvent() {
  const { updateEvent } = useCalendarActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (event: IEvent) => {
    setLoading(true);
    setError(null);

    try {
      return await updateEvent(event);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateEvent: update, loading, error };
}

export function useWaveCalendarDeleteEvent() {
  const { deleteEvent } = useCalendarActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeEvent = async (event: IEvent) => {
    setLoading(true);
    setError(null);

    try {
      return Boolean(await deleteEvent(event));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEvent: removeEvent, loading, error };
}
