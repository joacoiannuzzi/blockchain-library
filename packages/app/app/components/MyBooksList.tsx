"use client";

import { useGetMyBooks } from "../hooks/library/useGetMyBooks";
import { MyBookComponent } from "./MyBookComponent";

export const MyBooksList = () => {
  const { books, getAllBooksLoading, getAllBooksError } = useGetMyBooks();

  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <p className="text-xl text-gray-500">My Books:</p>
        {getAllBooksLoading ? (
          <p className="text-lg text-center text-gray-500 italic">Loading...</p>
        ) : (
          <div
            className={
              !getAllBooksError
                ? `text-lg text-center`
                : `text-lg text-center text-red-500`
            }
          >
            {!getAllBooksError ? (
              <div
                className="grid grid-cols-1 gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                }}
              >
                {books.map((book) => (
                  <MyBookComponent key={book.id.toString()} book={book} />
                ))}
              </div>
            ) : (
              `There was an error getting the books`
            )}
          </div>
        )}
      </div>
    </div>
  );
};
