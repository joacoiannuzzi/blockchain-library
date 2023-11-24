"use client";

import { toast } from "react-toastify";
import { Book } from "../hooks/library/useGetAllBooks";
import { useTransferBook } from "../hooks/library/useTransferBook";

export const BookComponent = ({
  book,
  canGet,
}: {
  book: Book;
  canGet: boolean;
}) => {
  const onTransferBookSuccess = () => {
    toast.success(`Successfully got book`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "light",
      className: "text-sm",
    });
  };
  const { transferBook } = useTransferBook({
    bookId: book.id,
    onTransferBookSuccess,
    canGet,
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
        {book.available && canGet && transferBook !== undefined ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 px-5 rounded-md"
            onClick={transferBook}
          >
            Get
          </button>
        ) : (
          <button
            disabled
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 px-5 rounded-md"
          >
            Get
          </button>
        )}
      </div>
    </div>
  );
};
