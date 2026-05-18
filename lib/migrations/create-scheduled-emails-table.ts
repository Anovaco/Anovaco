import { sql } from "../db";

async function createScheduledEmailsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS scheduled_emails (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      email_type TEXT NOT NULL,
      recipient_email TEXT NOT NULL,
      scheduled_for TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("Scheduled emails table created successfully");
}

createScheduledEmailsTable().catch(console.error);
