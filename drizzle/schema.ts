import {
  boolean,
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
  email: varchar("email", { length: 200 }).notNull(),
  tripDays: tripDaysEnum("trip_days").default("3d2n").notNull(),
  tripDate: varchar("trip_date", { length: 20 }),
  groupSize: integer("group_size").default(2).notNull(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// 行程方案模板
export const tripTemplates = pgTable("trip_templates", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(), // e.g. "20260429-001"
  name: varchar("name", { length: 200 }).notNull(), // 方案名稱
  description: text("description"), // 方案描述
  tripDate: varchar("trip_date", { length: 50 }).notNull(), // 出團日期顯示文字
  adultPrice: integer("adult_price").notNull(), // 成人價格
  childPrice: integer("child_price").notNull(), // 兒童價格
  active: boolean("active").default(true).notNull(), // 是否啟用
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TripTemplate = typeof tripTemplates.$inferSelect;
export type InsertTripTemplate = typeof tripTemplates.$inferInsert;
