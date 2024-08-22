import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BookId, bookIdSchema, books } from "@/lib/db/schema/books";

export const getBooks = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(books).where(eq(books.userId, session?.user.id!));
  const b = rows
  return { books: b };
};

export const getBookById = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const [row] = await db.select().from(books).where(and(eq(books.id, bookId), eq(books.userId, session?.user.id!)));
  if (row === undefined) return {};
  const b = row;
  return { book: b };
};


