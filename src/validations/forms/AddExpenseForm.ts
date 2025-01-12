import { z } from "zod";

const addExpenseFormSchema = z.object({
  date: z.date(),
  amount: z.string().refine((value) => /^(?!0+$)\d+$/.test(value), {
    message: "Enter amount",
  }),
  reason: z.string().min(5, { message: "Enter the description" }),
  file: z .union([
    z.undefined(),
    z.custom<File>((value) => value instanceof File, { message: "Must be a valid file" })
      .refine((file) => file.size > 0, { message: "File must not be empty" })
      .refine(
        (file) => ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
        { message: "Invalid file type" }
      )
      .refine((file) => file.size <= 5 * 1024 * 1024, { message: "File must be less than 5MB" }), // Limit size
  ]),
  paidTo: z.string().min(1, { message: "Enter the paid to" }),
  miscellaneousPaidToName: z
    .string()
    .refine((value) => /^(?!\s*$).+/.test(value), {
      message: "Enter name",
    })
    .optional(),
  miscellaneousPaidToRole: z
    .string()
    .refine((value) => /^(?!\s*$).+/.test(value), {
      message: "Enter role",
    })
    .optional(),
  paymentMode: z.string().min(1, { message: "Enter payment mode" }),
  project: z.string().min(1, { message: "Enter the project" }),
});

export default addExpenseFormSchema;
