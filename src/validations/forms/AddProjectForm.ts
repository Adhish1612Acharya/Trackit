import { z } from "zod";

const addProjectFormSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  budget: z.string(),
});

export default addProjectFormSchema;
