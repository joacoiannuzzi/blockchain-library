"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAddBook } from "../hooks/library/useAddBook";

export const AddBook = () => {
  const [newBookState, setNewBookState] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const onAddBookSuccess = () => {
    toast.success(`Successfully added book, you received 10 tokens`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "light",
      className: "text-sm",
    });

    setNewBookState({
      title: "",
      author: "",
      genre: "",
    });
  };

  const { addBook, addBookLoading, prepareAddBookError } = useAddBook({
    bookData: newBookState,
    onAddBookSuccess,
  });

  return (
    <div className="space-y-8 p-10">
      <div className="flex flex-col space-y-4">
        <p className="text-xl text-gray-500 text-center">
          Add a new book to the library:
        </p>

        <div className="space-y-8">
          <div className="flex flex-col space-y-4">
            <input
              className="border p-4 text-center"
              onChange={(e) => {
                setNewBookState({
                  ...newBookState,
                  title: e.target.value,
                });
              }}
              placeholder="Book title"
              value={newBookState.title}
            />
            <input
              className="border p-4 text-center"
              onChange={(e) => {
                setNewBookState({
                  ...newBookState,
                  author: e.target.value,
                });
              }}
              placeholder="Book Author"
              value={newBookState.author}
            />
            <input
              className="border p-4 text-center"
              onChange={(e) => {
                setNewBookState({
                  ...newBookState,
                  genre: e.target.value,
                });
              }}
              placeholder="Book Genre"
              value={newBookState.genre}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-md"
              onClick={addBook}
              disabled={!newBookState || addBookLoading || prepareAddBookError}
            >
              {!addBookLoading ? `Add Book` : `Adding Book...`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
