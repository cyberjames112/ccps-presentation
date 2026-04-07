import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// 行程天數枚舉
export const tripDaysEnum = pgEnum("trip_days", ["3d2n", "4d3n"]);

// 報名紀錄資料表
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  tripDays: tripDaysEnum("trip_days").default("3d2n").notNull(),
  tripDate: varchar("trip_date", { length: 20 }),
  groupSize: integer("group_size").default(2).notNull(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
