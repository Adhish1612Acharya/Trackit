import { z } from "zod";

const filterSearchScheme = z.object({
  paidToId: z.string().min(1),
  paymentModeId: z.string().min(1),
  projectId: z.string().min(1),
});

export const projectExpenseFilterSearchScheme = z.object({
  paidToId: z.string().min(1),
  paymentModeId: z.string().min(1),
  date: z.date().optional(),
});

export default filterSearchScheme;
