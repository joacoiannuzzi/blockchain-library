import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useMakeBookUnavailable = ({
  bookId,
  onMakeBookUnavailableSuccess = () => {},
  canMakeUnavailable,
}: {
  bookId: bigint;
  onMakeBookUnavailableSuccess?: () => void;
  canMakeUnavailable: boolean;
}) => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    makeBookUnavailable: (() => void) | undefined;
    makeBookUnavailableLoading: boolean;
    makeBookUnavailableError: boolean;
    prepareMakeBookUnavailableError: boolean;
  }>({
    makeBookUnavailable: undefined,
    makeBookUnavailableLoading: false,
    makeBookUnavailableError: false,
    prepareMakeBookUnavailableError: false,
  });

  const { config, isError: prepareMakeBookUnavailableError } =
    usePrepareContractWrite({
      address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
      chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
      abi: libraryAbi,
      functionName: "makeBookUnavailable",
      args: [bookId],
      enabled: canMakeUnavailable,
    });

  const {
    data,
    write: makeBookUnavailable,
    isLoading: makeBookUnavailableLoading,
    isError: makeBookUnavailableError,
  } = useContractWrite(config);

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (onMakeBookUnavailableSuccess) {
        onMakeBookUnavailableSuccess();
      }
    },
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      makeBookUnavailable,
      makeBookUnavailableLoading: makeBookUnavailableLoading || txLoading,
      makeBookUnavailableError,
      prepareMakeBookUnavailableError,
    });
  }, [
    makeBookUnavailable,
    makeBookUnavailableLoading,
    makeBookUnavailableError,
    prepareMakeBookUnavailableError,
    txLoading,
  ]);

  return state;
};
