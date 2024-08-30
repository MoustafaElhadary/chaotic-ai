import { computersRouter } from './computers'
import { router } from '@/lib/server/trpc'
import { booksRouter } from './books'
import { taskActionsRouter } from './taskActions'

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
  taskActions: taskActionsRouter
})

export type AppRouter = typeof appRouter
