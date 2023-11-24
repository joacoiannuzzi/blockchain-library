import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useMakeBookAvailable = ({
  bookId,
  onMakeBookAvailableSuccess = () => {},
  canMakeAvailable,
}: {
  bookId: bigint;
  onMakeBookAvailableSuccess?: () => void;
  canMakeAvailable: boolean;
}) => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    makeBookAvailable: (() => void) | undefined;
    makeBookAvailableLoading: boolean;
    makeBookAvailableError: boolean;
    prepareMakeBookAvailableError: boolean;
  }>({
    makeBookAvailable: undefined,
    makeBookAvailableLoading: false,
    makeBookAvailableError: false,
    prepareMakeBookAvailableError: false,
  });

  const { config, isError: prepareMakeBookAvailableError } =
    usePrepareContractWrite({
      address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
      chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
      abi: libraryAbi,
      functionName: "makeBookAvailable",
      args: [bookId],
      enabled: canMakeAvailable,
    });

  const {
    data,
    write: makeBookAvailable,
    isLoading: makeBookAvailableLoading,
    isError: makeBookAvailableError,
  } = useContractWrite(config);

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (onMakeBookAvailableSuccess) {
        onMakeBookAvailableSuccess();
      }
    },
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      makeBookAvailable,
      makeBookAvailableLoading: makeBookAvailableLoading || txLoading,
      makeBookAvailableError,
      prepareMakeBookAvailableError,
    });
  }, [
    makeBookAvailable,
    makeBookAvailableLoading,
    makeBookAvailableError,
    prepareMakeBookAvailableError,
    txLoading,
  ]);

  return state;
};
