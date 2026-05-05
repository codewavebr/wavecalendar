import { z } from "zod";

export const waveCalendarTimeSchema = z.object({
  hour: z.number(),
  minute: z.number(),
});

export const waveCalendarEventFormSchema = z.object({
  user: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: waveCalendarTimeSchema,
  endDate: z.date({ required_error: "End date is required" }),
  endTime: waveCalendarTimeSchema,
  color: z.enum(
    ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
    { required_error: "Color is required" },
  ),
});

export type WaveCalendarEventFormSchemaValues = z.infer<
  typeof waveCalendarEventFormSchema
>;
