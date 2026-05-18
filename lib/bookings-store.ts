import { sql } from "./db";

export interface Booking {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  city?: string;
  industry?: string;
  role?: string;
  interests?: string[];
  challenge?: string;
  referral?: string;
  referral_other?: string;
  date: string;
  time: string;
  meet_link?: string;
  created_at?: string;
}

export async function addBooking(booking: Booking): Promise<void> {
  await sql`
    INSERT INTO bookings (
      name, email, phone, business_name, city, industry, role,
      interests, challenge, referral, referral_other, date, time, meet_link
    ) VALUES (
      ${booking.name},
      ${booking.email},
      ${booking.phone ?? null},
      ${booking.business_name ?? null},
      ${booking.city ?? null},
      ${booking.industry ?? null},
      ${booking.role ?? null},
      ${booking.interests ?? null},
      ${booking.challenge ?? null},
      ${booking.referral ?? null},
      ${booking.referral_other ?? null},
      ${booking.date},
      ${booking.time},
      ${booking.meet_link ?? null}
    )
  `;
}

export async function getBookings(): Promise<Booking[]> {
  const rows = await sql`
    SELECT * FROM bookings ORDER BY created_at DESC
  `;
  return rows as Booking[];
}

export async function getBookingByDateAndTime(
  date: string,
  time: string
): Promise<Booking | null> {
  const rows = await sql`
    SELECT * FROM bookings WHERE date = ${date} AND time = ${time} LIMIT 1
  `;
  return rows.length > 0 ? (rows[0] as Booking) : null;
}

export type EmailType = "confirmation" | "reminder_24h" | "reminder_1h" | "followup";

export interface ScheduledEmail {
  id?: number;
  booking_id: number;
  email_type: EmailType;
  recipient_email: string;
  scheduled_for: string;
  sent_at?: string | null;
}

export async function scheduleEmails(
  bookingId: number,
  emails: Omit<ScheduledEmail, "booking_id">[]
): Promise<void> {
  for (const email of emails) {
    await sql`
      INSERT INTO scheduled_emails (booking_id, email_type, recipient_email, scheduled_for)
      VALUES (${bookingId}, ${email.email_type}, ${email.recipient_email}, ${email.scheduled_for})
    `;
  }
}

export async function getPendingEmails(): Promise<(ScheduledEmail & { id: number })[]> {
  const rows = await sql`
    SELECT se.*, b.name, b.email, b.date, b.time, b.meet_link, b.business_name
    FROM scheduled_emails se
    JOIN bookings b ON se.booking_id = b.id
    WHERE se.sent_at IS NULL
    AND se.scheduled_for <= NOW()
    ORDER BY se.scheduled_for ASC
    LIMIT 50
  `;
  return rows as (ScheduledEmail & { id: number })[];
}

export async function markEmailSent(emailId: number): Promise<void> {
  await sql`
    UPDATE scheduled_emails SET sent_at = NOW() WHERE id = ${emailId}
  `;
}
