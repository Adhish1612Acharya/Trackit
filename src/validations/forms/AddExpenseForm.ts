import { z } from "zod";

const addExpenseFormSchema = z.object({
  date: z.date(),
  amount: z.string().refine((value) => /^(?!0+$)\d+$/.test(value), {
    message: "Enter amount",
  }),
  reason: z.string().min(5, { message: "Enter the description" }),
  paidTo: z.string().min(1, { message: "Enter the paid to" }),
  miscellaneousPaidToName: z
    .string()
    .refine((value) => /^(?!\s*$).+/.test(value), {
      message: "Enter amount",
    })
    .optional(),
  miscellaneousPaidToRole: z
    .string()
    .refine((value) => /^(?!\s*$).+/.test(value), {
      message: "Enter amount",
    })
    .optional(),
  paymentMode: z.string().min(1, { message: "Enter payment mode" }),
  project: z.string().min(1, { message: "Enter the project" }),
});

export default addExpenseFormSchema;
