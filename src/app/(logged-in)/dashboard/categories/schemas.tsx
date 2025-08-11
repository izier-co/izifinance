import z from "zod";

export const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  txCategoryName: z.string(),
  txCategoryDescription: z.string(),
});

export type Categories = z.infer<typeof payloadSchema>;
