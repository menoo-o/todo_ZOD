import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  completed: z.boolean(),
  createdAt: z.string()
})

export type Todo = z.infer<typeof TodoSchema>