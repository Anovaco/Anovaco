import { NextResponse } from "next/server";
import { bookedSlotsForDate, parseISODate } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/availability?date=YYYY-MM-DD
// Returns the 30-minute Toronto-local slot starts ("HH:mm") that are already
// booked on the given day, based on Google Calendar freebusy.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  if (!dateParam) {
    return NextResponse.json(
      { success: false, error: "Missing 'date' query param (YYYY-MM-DD)" },
      { status: 400 },
    );
  }
  const parsed = parseISODate(dateParam);
  if (!parsed) {
    return NextResponse.json(
      { success: false, error: "Invalid 'date' — expected YYYY-MM-DD" },
      { status: 400 },
    );
  }
  try {
    const bookedSlots = await bookedSlotsForDate(parsed.y, parsed.mo, parsed.d);
    return NextResponse.json(
      { success: true, date: dateParam, bookedSlots },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[availability] freebusy error:", err);
    // Fail-open: if Google is unavailable, don't break the booking page.
    // Returning an empty array means slots show as available; the POST /book
    // pre-flight check is the authoritative line of defence.
    return NextResponse.json(
      { success: true, date: dateParam, bookedSlots: [], degraded: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
