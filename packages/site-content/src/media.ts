import { z } from 'zod';

export const mediaRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type MediaRef = z.infer<typeof mediaRefSchema>;
