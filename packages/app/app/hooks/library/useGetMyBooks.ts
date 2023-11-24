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

export const useGetMyBooks = () => {
  const account = useAccount();

  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    books: BookArray;
    getAllBooksLoading: boolean;
    getAllBooksError: boolean;
    address: string | undefined;
  }>({
    books: [] as BookArray,
    getAllBooksLoading: true,
    getAllBooksError: false,
    address: undefined,
  });

  const {
    data: books,
    isLoading: getAllBooksLoading,
    isError: getAllBooksError,
  } = useContractRead({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: libraryAbi,
    functionName: "getBooksByOwner",
    watch: true,
    args: [account.address ?? "0x"],
    enabled: !!account.address,
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      books: books ?? [],
      getAllBooksLoading,
      getAllBooksError,
      address: account.address,
    });
  }, [account.address, books, getAllBooksLoading, getAllBooksError]);

  return state;
};
