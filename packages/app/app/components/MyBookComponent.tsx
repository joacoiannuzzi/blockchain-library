"use client";

import { toast } from "react-toastify";
import { Book } from "../hooks/library/useGetAllBooks";
import { useMakeBookAvailable } from "../hooks/library/useMakeBookAvailable";
import { useMakeBookUnavailable } from "../hooks/library/useMakeBookUnavailable";

export const MyBookComponent = ({ book }: { book: Book }) => {
  const { makeBookAvailable, makeBookAvailableLoading } = useMakeBookAvailable({
    bookId: book.id,
    onMakeBookAvailableSuccess: () => {
      toast.success(`Successfully made book available`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
        className: "text-sm",
      });
    },
    canMakeAvailable: !book.available,
  });

  const { makeBookUnavailable, makeBookUnavailableLoading } =
    useMakeBookUnavailable({
      bookId: book.id,
      onMakeBookUnavailableSuccess: () => {
        toast.success(`Successfully made book unavailable`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "light",
          className: "text-sm",
        });
      },
      canMakeUnavailable: book.available,
    });

  return (
    <div className="flex flex-col gap-1 border-2 border-gray-200 rounded-md p-2">
      <div className="text-base">
        <span>Title: </span>
        <span className="font-semibold">{book.title}</span>
      </div>
      <div className="text-base">
        <span>Author: </span>
        <span className="font-semibold">{book.author}</span>
      </div>
      <div className="text-base">
        <span>Genre: </span>
        <span className="font-semibold">{book.genre}</span>
      </div>
      <div>
        {book.available ? (
          <span className="text-green-500">Available</span>
        ) : (
          <span className="text-red-500">Unavailable</span>
        )}
      </div>

      <div>
        {book.available ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 px-5 rounded-md"
            onClick={makeBookUnavailable}
            disabled={makeBookUnavailableLoading}
          >
            Make Unavailable
          </button>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 px-5 rounded-md"
            onClick={makeBookAvailable}
            disabled={makeBookAvailableLoading}
          >
            Make Available
          </button>
        )}
      </div>
    </div>
  );
};
