import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useAddBook = ({
  bookData,
  onAddBookSuccess = () => {},
}: {
  bookData: {
    title: string;
    author: string;
    genre: string;
  };
  onAddBookSuccess?: () => void;
}) => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    addBook: (() => void) | undefined;
    addBookLoading: boolean;
    addBookError: boolean;
    prepareAddBookError: boolean;
  }>({
    addBook: undefined,
    addBookLoading: false,
    addBookError: false,
    prepareAddBookError: false,
  });

  const { config, isError: prepareAddBookError } = usePrepareContractWrite({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: libraryAbi,
    functionName: "listBook",
    args: [bookData.title, bookData.author, bookData.genre],
  });

  const {
    data,
    write: addBook,
    isLoading: addBookLoading,
    isError: addBookError,
  } = useContractWrite(config);

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (onAddBookSuccess) {
        onAddBookSuccess();
      }
    },
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      addBook,
      addBookLoading: addBookLoading || txLoading,
      addBookError,
      prepareAddBookError,
    });
  }, [addBook, addBookLoading, txLoading, addBookError, prepareAddBookError]);

  return state;
};
