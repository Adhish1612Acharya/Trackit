import { z } from "zod";

const signUpFormSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(5, { message: "username must be at least 5 letters long" }),
  contactNo: z
    .union([z.string(), z.number()])
    .refine((value) => /^(?:(?:\+91|91|0)?[6-9]\d{9})$/.test(value.toString())),
  password: z
    .string()
    .min(8, {
      message: "password must be at leat 8 characters long",
    })
    .trim()
    .refine((value) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        value.toString()
      )
    ),
});

export default signUpFormSchema;
