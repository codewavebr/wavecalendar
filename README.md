# @codewavebr/wavecalendar

Shared calendar and scheduler package for Code Wave products.

WaveCalendar owns the reusable scheduling experience: calendar state, day/week/month/year/agenda views, drag-and-drop helpers, event dialogs, form schema, mutations, and extension slots. Product-specific concerns such as tenant lookup, API routes, billing rules, permissions, and timezone conversion should stay in the consuming app through an adapter.

## Exports

```ts
import { WaveCalendarProvider, createWaveCalendarAdapter } from "@codewavebr/wavecalendar";
import { CalendarClientContainer } from "@codewavebr/wavecalendar/components";
import { AddEventDialog } from "@codewavebr/wavecalendar/dialogs";
import { useWaveCalendarCreateEvent } from "@codewavebr/wavecalendar/mutations";
```

- `@codewavebr/wavecalendar`: provider, adapter factory, context, actions, slots, helpers, form/schema, mutations, DnD, types, and interfaces.
- `@codewavebr/wavecalendar/components`: scheduler UI pieces such as header, views, event blocks, agenda cards, side navigation helpers, and compact widgets.
- `@codewavebr/wavecalendar/dialogs`: reusable add, edit, and details dialogs.
- `@codewavebr/wavecalendar/form`: form values, defaults, color options, and event/form mappers.
- `@codewavebr/wavecalendar/schema`: Zod schema for event forms.
- `@codewavebr/wavecalendar/mutations`: hooks that call injected calendar actions.
- `@codewavebr/wavecalendar/adapter`: `createWaveCalendarAdapter` for app-level integration.
- `@codewavebr/wavecalendar/dnd`: drag-and-drop provider and draggable/droppable calendar primitives.
- `@codewavebr/wavecalendar/helpers`: date, range, grouping, filtering, and layout helpers.
- `@codewavebr/wavecalendar/types` and `@codewavebr/wavecalendar/interfaces`: shared public calendar contracts.

## Data Contracts

```ts
import type { IEvent, IUser } from "@codewavebr/wavecalendar";

const users: IUser[] = [
  {
    id: "teacher-1",
    name: "Teacher",
    picturePath: null,
    type: "teacher",
  },
];

const events: IEvent[] = [
  {
    id: 1,
    title: "Class",
    startDate: "2026-05-04T12:00:00.000Z",
    endDate: "2026-05-04T13:00:00.000Z",
    color: "blue",
    description: "",
    user: users[0],
  },
];
```

## Minimal Usage

```tsx
"use client";

import {
  CalendarClientContainer,
} from "@codewavebr/wavecalendar/components";
import { WaveCalendarProvider } from "@codewavebr/wavecalendar/provider";

export function CalendarPage({ users, events }) {
  return (
    <WaveCalendarProvider users={users} events={events} initialView="week">
      <CalendarClientContainer />
    </WaveCalendarProvider>
  );
}
```

This is useful for previews or read-only screens. Creating events requires `actions.createEvent`; updating and deleting use local state defaults unless custom actions are provided.

## Adapter Pattern

Use one adapter per product/app. The adapter is where tenant, auth, API routes, timezone rules, permissions, and custom dialogs are connected to the reusable package.

```tsx
"use client";

import { useMemo } from "react";
import {
  createWaveCalendarAdapter,
  type WaveCalendarActions,
  type WaveCalendarSlots,
} from "@codewavebr/wavecalendar";
import { AddEventDialog, EventDetailsDialog } from "@codewavebr/wavecalendar/dialogs";

export const AppCalendarAdapter = createWaveCalendarAdapter({
  useActions() {
    return useMemo<WaveCalendarActions>(
      () => ({
        async createEvent(values) {
          await fetch("/api/calendar/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
        },
        async updateEvent(event) {
          await fetch(`/api/calendar/events/${event.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
          });
        },
        async deleteEvent(event) {
          await fetch(`/api/calendar/events/${event.id}`, { method: "DELETE" });
          return true;
        },
      }),
      [],
    );
  },
  useSlots() {
    return useMemo<WaveCalendarSlots>(
      () => ({
        renderAddEvent: (props, trigger) => (
          <AddEventDialog {...props}>{trigger}</AddEventDialog>
        ),
        renderEventDetails: (event, trigger) => (
          <EventDetailsDialog event={event}>{trigger}</EventDetailsDialog>
        ),
      }),
      [],
    );
  },
});
```

Then use the adapter around the package components:

```tsx
import { CalendarClientContainer } from "@codewavebr/wavecalendar/components";

export function CalendarPage({ users, events }) {
  return (
    <AppCalendarAdapter users={users} events={events} initialView="week">
      <CalendarClientContainer />
    </AppCalendarAdapter>
  );
}
```

Props passed directly to `AppCalendarAdapter`, such as `actions` or `slots`, override the defaults configured in `createWaveCalendarAdapter`. That makes it easy to customize a single screen without forking the product adapter.

## Package Boundaries

- Keep reusable scheduling UI, state, helpers, dialogs, form schema, and mutation hooks in `@codewavebr/wavecalendar`.
- Keep generic UI primitives, theme tokens, shell, tables, and charts in `@codewavebr/wavekit`.
- Keep auth, tenant, billing, shared config, and infrastructure contracts in `@codewavebr/wavecore`.
- Keep app-specific adapters inside each application.

## Publish

Publishing happens automatically when a GitHub Release is published.
The workflow syncs `package.json` version from the release tag (e.g. `v0.1.0`)
and publishes `@codewavebr/wavecalendar` to GitHub Packages.
Consumers should authenticate to `https://npm.pkg.github.com`.

## Scripts

```bash
bun install
bun run test
bun run typecheck
bun run build
```

When developing next to a local `wavekit` checkout:

```bash
cd ../wavekit && bun install && bun run build
cd ../wavecalendar && bun install && bun run link:wavekit
```
