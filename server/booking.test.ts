import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createBooking: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  getBookings: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "王醫師",
      phone: "0912345678",
      tripDays: "3d2n",
      tripDate: "2026-05-01",
      groupSize: 2,
      totalAmount: 39800,
      createdAt: new Date(),
    },
  ]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("booking.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking with valid 3d2n two-person input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.create({
      name: "王醫師",
      phone: "0912345678",
      tripDays: "3d2n",
      tripDate: "2026-05-01",
      groupSize: 2,
      totalAmount: 39800,
    });

    expect(result).toEqual({ success: true });
  });

  it("creates a booking with 4d3n solo input (higher price)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.create({
      name: "李醫師",
      phone: "0987654321",
      tripDays: "4d3n",
      groupSize: 1,
      totalAmount: 29900,
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects booking with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        name: "",
        phone: "0912345678",
        tripDays: "3d2n",
        groupSize: 2,
        totalAmount: 39800,
      })
    ).rejects.toThrow();
  });

  it("rejects booking with empty phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        name: "王醫師",
        phone: "",
        tripDays: "3d2n",
        groupSize: 2,
        totalAmount: 39800,
      })
    ).rejects.toThrow();
  });

  it("rejects booking with invalid groupSize (0)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        name: "王醫師",
        phone: "0912345678",
        tripDays: "3d2n",
        groupSize: 0,
        totalAmount: 39800,
      })
    ).rejects.toThrow();
  });

  it("rejects booking with groupSize exceeding 20", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        name: "王醫師",
        phone: "0912345678",
        tripDays: "3d2n",
        groupSize: 21,
        totalAmount: 39800,
      })
    ).rejects.toThrow();
  });
});

describe("booking.list", () => {
  it("returns a list of bookings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name", "王醫師");
    expect(result[0]).toHaveProperty("phone", "0912345678");
    expect(result[0]).toHaveProperty("totalAmount", 39800);
  });
});
