import assert from "node:assert/strict";
import test from "node:test";
import { navigateDate, rangeText } from "../src/scheduler-helpers.js";

test("navigates month view forward and backward", () => {
  const base = new Date("2026-08-15T12:00:00Z");

  assert.equal(navigateDate(base, "month", "next").getUTCMonth(), 8);
  assert.equal(navigateDate(base, "month", "previous").getUTCMonth(), 6);
});

test("formats day view range text", () => {
  const text = rangeText("day", new Date("2026-08-15T12:00:00Z"));
  assert.match(text, /Aug 15, 2026/);
});
