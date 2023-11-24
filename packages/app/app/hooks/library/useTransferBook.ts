import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useTransferBook = ({
  bookId,
  onTransferBookSuccess = () => {},
  canGet,
}: {
  bookId: bigint;
  onTransferBookSuccess?: () => void;
  canGet: boolean;
}) => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    transferBook: (() => void) | undefined;
    transferBookLoading: boolean;
    transferBookError: boolean;
    prepareTransferBookError: boolean;
  }>({
    transferBook: undefined,
    transferBookLoading: false,
    transferBookError: false,
    prepareTransferBookError: false,
  });

  const { config, isError: prepareTransferBookError } = usePrepareContractWrite(
    {
      address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
      chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
      abi: libraryAbi,
      functionName: "transferBook",
      args: [bookId],
      enabled: canGet,
    }
  );

  const {
    data,
    write: transferBook,
    isLoading: transferBookLoading,
    isError: transferBookError,
  } = useContractWrite(config);

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (onTransferBookSuccess) {
        onTransferBookSuccess();
      }
    },
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      transferBook,
      transferBookLoading: transferBookLoading || txLoading,
      transferBookError,
      prepareTransferBookError,
    });
  }, [
    transferBook,
    transferBookLoading,
    transferBookError,
    txLoading,
    prepareTransferBookError,
  ]);

  return state;
};
