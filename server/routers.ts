import { publicProcedure, router } from "./_core/trpc";
import { createBooking, getBookings, createTripTemplate, listTripTemplates, getTripTemplateBySlug, updateTripTemplate, deleteTripTemplate } from "./db";
import { sendBookingNotification } from "./email";
import { z } from "zod";

// Helper: generate slug like "20260429-001"
function generateSlug(tripDate: string): string {
  // Extract date digits from tripDate (e.g. "4/29(四)-5/3(一)" → "20260429")
  const match = tripDate.match(/(\d{1,2})\/(\d{1,2})/);
  if (match) {
    const month = match[1].padStart(2, "0");
    const day = match[2].padStart(2, "0");
    const year = new Date().getFullYear();
    const dateStr = `${year}${month}${day}`;
    const rand = Math.random().toString(36).substring(2, 6);
    return `${dateStr}-${rand}`;
  }
  // Fallback: timestamp-based
  return `${Date.now().toString(36)}`;
}

export const appRouter = router({
  tripTemplate: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "方案名稱為必填"),
          description: z.string().optional(),
          tripDate: z.string().min(1, "出團日期為必填"),
          isStandard: z.boolean().default(false),
          showDaySelector: z.boolean().default(false),
          customDate: z.boolean().default(false),
          hasChildPrice: z.boolean().default(true),
          adultPrice: z.number().int().min(0),
          childPrice: z.number().int().min(0),
          adultPrice4d: z.number().int().min(0).optional(),
          childPrice4d: z.number().int().min(0).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const slug = generateSlug(input.tripDate);
        const template = await createTripTemplate({
          slug,
          name: input.name,
          description: input.description ?? null,
          tripDate: input.tripDate,
          isStandard: input.isStandard,
          showDaySelector: input.showDaySelector,
          customDate: input.customDate,
          hasChildPrice: input.hasChildPrice,
          adultPrice: input.adultPrice,
          childPrice: input.hasChildPrice ? input.childPrice : 0,
          adultPrice4d: input.adultPrice4d ?? null,
          childPrice4d: input.childPrice4d ?? null,
        });
        return template;
      }),

    list: publicProcedure.query(async () => {
      return listTripTemplates();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const template = await getTripTemplateBySlug(input.slug);
        if (!template) throw new Error("方案不存在");
        return template;
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          tripDate: z.string().optional(),
          isStandard: z.boolean().optional(),
          showDaySelector: z.boolean().optional(),
          customDate: z.boolean().optional(),
          hasChildPrice: z.boolean().optional(),
          adultPrice: z.number().int().min(0).optional(),
          childPrice: z.number().int().min(0).optional(),
          adultPrice4d: z.number().int().min(0).nullable().optional(),
          childPrice4d: z.number().int().min(0).nullable().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTripTemplate(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTripTemplate(input.id);
        return { success: true };
      }),
  }),

  booking: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "姓名為必填"),
          phone: z.string().min(1, "電話為必填"),
          email: z.string().email("請輸入有效的 Email"),
          tripDays: z.enum(["3d2n", "4d3n"]),
          tripDate: z.string().optional(),
          groupSize: z.number().int().min(1).max(20),
          totalAmount: z.number().int().min(0),
          templateSlug: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createBooking({
          name: input.name,
          phone: input.phone,
          email: input.email,
          tripDays: input.tripDays,
          tripDate: input.tripDate ?? null,
          groupSize: input.groupSize,
          totalAmount: input.totalAmount,
        });

        // 非同步發送 Email，不阻塞回應
        sendBookingNotification({
          name: input.name,
          phone: input.phone,
          email: input.email,
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
