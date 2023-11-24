import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";

export type Book = {
  id: bigint;
  owner: `0x${string}`;
  title: string;
  author: string;
  genre: string;
  available: boolean;
};

export type BookArray = readonly Book[];

export const useGetAllBooks = () => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState({
    books: [] as BookArray,
    getAllBooksLoading: true,
    getAllBooksError: false,
  });

  const {
    data: books,
    isLoading: getAllBooksLoading,
    isError: getAllBooksError,
  } = useContractRead({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: libraryAbi,
    functionName: "getAllBooks",
    watch: true,
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      books: books ?? [],
      getAllBooksLoading,
      getAllBooksError,
    });
  }, [books, getAllBooksLoading, getAllBooksError]);

  return state;
};
