import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertBooking, bookings } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _migrated = false;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Ensure the bookings table and trip_days enum exist.
 * Safe to call multiple times — uses IF NOT EXISTS.
 */
export async function runAutoMigration() {
  if (_migrated) return;
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Skipping migration: no database connection");
    return;
  }

  try {
    // Create enum type if not exists
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE trip_days AS ENUM ('3d2n', '4d3n');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create bookings table if not exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(200) NOT NULL DEFAULT '',
        trip_days trip_days NOT NULL DEFAULT '3d2n',
        trip_date VARCHAR(20),
        group_size INTEGER NOT NULL DEFAULT 2,
        total_amount INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Add email column if it doesn't exist (for existing tables)
    await db.execute(sql`
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email VARCHAR(200) NOT NULL DEFAULT '';
    `);

    _migrated = true;
    console.log("[Database] Auto-migration completed: bookings table ready");
  } catch (error) {
    console.error("[Database] Auto-migration failed:", error);
  }
}

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function getBookings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}
