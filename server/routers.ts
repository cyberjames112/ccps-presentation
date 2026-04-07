import { publicProcedure, router } from "./_core/trpc";
import { createBooking, getBookings } from "./db";
import { sendBookingNotification } from "./email";
import { z } from "zod";

export const appRouter = router({
  booking: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "姓名為必填"),
          phone: z.string().min(1, "電話為必填"),
          tripDays: z.enum(["3d2n", "4d3n"]),
          tripDate: z.string().optional(),
          groupSize: z.number().int().min(1).max(20),
          totalAmount: z.number().int().min(0),
        })
      )
      .mutation(async ({ input }) => {
        await createBooking({
          name: input.name,
          phone: input.phone,
          tripDays: input.tripDays,
          tripDate: input.tripDate ?? null,
          groupSize: input.groupSize,
          totalAmount: input.totalAmount,
        });

        // 非同步發送 Email，不阻塞回應
        sendBookingNotification({
          name: input.name,
          phone: input.phone,
          tripDays: input.tripDays,
          tripDate: input.tripDate ?? null,
          groupSize: input.groupSize,
          totalAmount: input.totalAmount,
        }).catch((err) => {
          console.error("[Booking] Email notification failed:", err);
        });

        return { success: true };
      }),

    list: publicProcedure.query(async () => {
      return getBookings();
    }),
  }),
});

export type AppRouter = typeof appRouter;
