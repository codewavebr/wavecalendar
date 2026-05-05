"use client";

import { WaveCalendarProvider, type WaveCalendarProviderProps } from "./provider";
import type { WaveCalendarActions } from "./scheduler-actions";
import type { WaveCalendarSlots } from "./scheduler-slots";

type ProviderPropsWithoutInjections = Omit<
  WaveCalendarProviderProps,
  "actions" | "slots"
>;

export interface WaveCalendarAdapterProps
  extends ProviderPropsWithoutInjections {
  actions?: WaveCalendarActions;
  slots?: WaveCalendarSlots;
}

export interface CreateWaveCalendarAdapterOptions {
  useActions?: (props: WaveCalendarAdapterProps) => WaveCalendarActions | undefined;
  useSlots?: (props: WaveCalendarAdapterProps) => WaveCalendarSlots | undefined;
}

function mergeActions(
  baseActions?: WaveCalendarActions,
  overrideActions?: WaveCalendarActions,
) {
  if (!baseActions && !overrideActions) return undefined;
  return { ...baseActions, ...overrideActions };
}

function mergeSlots(baseSlots?: WaveCalendarSlots, overrideSlots?: WaveCalendarSlots) {
  if (!baseSlots && !overrideSlots) return undefined;
  return { ...baseSlots, ...overrideSlots };
}

export function createWaveCalendarAdapter({
  useActions = () => undefined,
  useSlots = () => undefined,
}: CreateWaveCalendarAdapterOptions = {}) {
  return function WaveCalendarAdapter({
    actions,
    slots,
    ...providerProps
  }: WaveCalendarAdapterProps) {
    const props = { ...providerProps, actions, slots };
    const configuredActions = useActions(props);
    const configuredSlots = useSlots(props);

    return (
      <WaveCalendarProvider
        {...providerProps}
        actions={mergeActions(configuredActions, actions)}
        slots={mergeSlots(configuredSlots, slots)}
      />
    );
  };
}
