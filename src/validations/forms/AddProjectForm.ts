import { z } from "zod";

const addProjectFormSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  budget: z.string().refine((value) => /^(?!0+$)\d+$/.test(value), {
    message: "Enter budget",
  }),
});

export default addProjectFormSchema;
