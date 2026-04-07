import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertBooking, bookings } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

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
