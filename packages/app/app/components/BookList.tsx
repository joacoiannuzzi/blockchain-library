"use client";

import { useAccount } from "wagmi";
import { useGetAllBooks } from "../hooks/library/useGetAllBooks";
import { useGetTokenAmount } from "../hooks/library/useGetTokenAmount";
import { BookComponent } from "./BookComponent";

export const BooksList = () => {
  const { books, getAllBooksLoading, getAllBooksError } = useGetAllBooks();

  const { tokens } = useGetTokenAmount();

  const account = useAccount();

  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <p className="text-xl text-gray-500">Books:</p>
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
                  <BookComponent
                    key={book.id.toString()}
                    book={book}
                    canGet={
                      tokens && tokens >= 10 && account?.address !== book.owner
                        ? true
                        : false
                    }
                  />
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
