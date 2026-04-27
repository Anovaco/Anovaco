import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type EmailType = "reminder24h" | "reminder1h" | "followUp";

export type ScheduledEmail = {
  scheduledFor: string; // ISO timestamp
  sent: boolean;
};

export type Booking = {
  id: string;
  clientName: string;       // first name only — used in templates
  clientEmail: string;
  businessName: string;
  date: string;             // human-readable, e.g. "Monday, June 2 2025"
  time: string;             // human-readable, e.g. "10:00 AM"
  meetLink: string;
  bookingDateTime: string;  // ISO timestamp of the call start
  scheduledEmails: {
    reminder24h: ScheduledEmail;
    reminder1h: ScheduledEmail;
    followUp: ScheduledEmail;
  };
};

export type DueEmail = {
  booking: Booking;
  emailType: EmailType;
};

const DATA_DIR = join(process.cwd(), "data");
const STORE_PATH = join(DATA_DIR, "bookings.json");

function ensureStore() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, "[]", "utf8");
}

function readAll(): Booking[] {
  ensureStore();
  try {
    const raw = readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeAll(bookings: Booking[]) {
  ensureStore();
  writeFileSync(STORE_PATH, JSON.stringify(bookings, null, 2), "utf8");
}

export function addBooking(booking: Booking): void {
  const all = readAll();
  all.push(booking);
  writeAll(all);
}

export function getPendingEmails(now: Date = new Date()): DueEmail[] {
  const all = readAll();
  const due: DueEmail[] = [];
  const types: EmailType[] = ["reminder24h", "reminder1h", "followUp"];
  for (const booking of all) {
    for (const type of types) {
      const slot = booking.scheduledEmails[type];
      if (!slot.sent && new Date(slot.scheduledFor).getTime() <= now.getTime()) {
        due.push({ booking, emailType: type });
      }
    }
  }
  return due;
}

export function markEmailSent(bookingId: string, emailType: EmailType): void {
  const all = readAll();
  const idx = all.findIndex((b) => b.id === bookingId);
  if (idx === -1) return;
  all[idx].scheduledEmails[emailType].sent = true;
  writeAll(all);
}
