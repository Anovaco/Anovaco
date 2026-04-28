import { Redis } from "@upstash/redis";

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

const kv = Redis.fromEnv();

// Hash of bookingId → Booking (auto JSON-serialised by @upstash/redis)
const BOOKINGS_KEY = "anova:bookings";
// Sorted set of pending emails: score = ms timestamp, member = `${bookingId}|${emailType}`
const PENDING_KEY = "anova:pending-emails";

const TYPES: EmailType[] = ["reminder24h", "reminder1h", "followUp"];

const memberFor = (id: string, t: EmailType) => `${id}|${t}`;

export async function addBooking(booking: Booking): Promise<void> {
  await kv.hset(BOOKINGS_KEY, { [booking.id]: booking });
  const [first, ...rest] = TYPES.map((t) => ({
    score: new Date(booking.scheduledEmails[t].scheduledFor).getTime(),
    member: memberFor(booking.id, t),
  }));
  await kv.zadd(PENDING_KEY, first, ...rest);
}

export async function getPendingEmails(now: Date = new Date()): Promise<DueEmail[]> {
  const members = (await kv.zrange(PENDING_KEY, 0, now.getTime(), { byScore: true })) as string[];
  if (!members.length) return [];

  const due: DueEmail[] = [];
  for (const raw of members) {
    const sep = raw.lastIndexOf("|");
    if (sep === -1) continue;
    const bookingId = raw.slice(0, sep);
    const emailType = raw.slice(sep + 1) as EmailType;
    const booking = (await kv.hget(BOOKINGS_KEY, bookingId)) as Booking | null;
    if (!booking) {
      // Orphaned member — booking gone. Drop it so it doesn't keep matching.
      await kv.zrem(PENDING_KEY, raw);
      continue;
    }
    due.push({ booking, emailType });
  }
  return due;
}

export async function markEmailSent(bookingId: string, emailType: EmailType): Promise<void> {
  await kv.zrem(PENDING_KEY, memberFor(bookingId, emailType));
}
