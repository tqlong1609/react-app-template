import { z } from "zod";

const updateAccountResponseSchema = z.object({
  message: z.string()
});
export type UpdateAccountData = z.infer<typeof updateAccountResponseSchema>;

export { updateAccountResponseSchema };
