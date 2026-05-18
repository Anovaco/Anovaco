import { sql } from "../db";

async function createBookingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      business_name TEXT,
      city TEXT,
      industry TEXT,
      role TEXT,
      interests TEXT[],
      challenge TEXT,
      referral TEXT,
      referral_other TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      meet_link TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("Bookings table created successfully");
}

createBookingsTable().catch(console.error);
