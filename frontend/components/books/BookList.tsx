"use client";
import { CompleteBook } from "@/lib/db/schema/books";
import { trpc } from "@/lib/trpc/client";
import BookModal from "./BookModal";


export default function BookList({ books }: { books: CompleteBook[] }) {
  const { data: b } = trpc.books.getBooks.useQuery(undefined, {
    initialData: { books },
    refetchOnMount: false,
  });

  if (b.books.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {b.books.map((book) => (
        <Book book={book} key={book.id} />
      ))}
    </ul>
  );
}

const Book = ({ book }: { book: CompleteBook }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{book.name}</div>
      </div>
      <BookModal book={book} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No books
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new book.
      </p>
      <div className="mt-6">
        <BookModal emptyState={true} />
      </div>
    </div>
  );
};

