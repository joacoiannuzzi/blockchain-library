"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { greeterAbi } from "@/app/abi/greeter";
import { envClientSchema } from "@/envVars";

const useGreeting = ({
  newGreeting = "",
  onSetGreetingSuccess,
}: {
  newGreeting?: string;
  onSetGreetingSuccess?: () => void;
}) => {
  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState<{
    address: string | undefined;
    greeting: string | undefined;
    getGreetingLoading: boolean;
    getGreetingError: boolean;
    setGreeting: (() => void) | undefined;
    setGreetingLoading: boolean;
    prepareSetGreetingError: boolean;
    setGreetingError: boolean;
  }>({
    address: undefined,
    greeting: ``,
    getGreetingLoading: true,
    getGreetingError: false,
    setGreeting: undefined,
    setGreetingLoading: false,
    prepareSetGreetingError: false,
    setGreetingError: false,
  });

  const { address } = useAccount();

  // Otherwise we'd just return these values directly
  const {
    data: greeting,
    isLoading: getGreetingLoading,
    isError: getGreetingError,
  } = useContractRead({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_GREETER_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: greeterAbi,
    functionName: "getGreeting",
    watch: true,
  });

  const { config, isError: prepareSetGreetingError } = usePrepareContractWrite({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_GREETER_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: greeterAbi,
    functionName: "setGreeting",
    args: [newGreeting],
  });

  const {
    data,
    write: setGreeting,
    isLoading: setGreetingLoading,
    isError: setGreetingError,
  } = useContractWrite(config);

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (onSetGreetingSuccess) {
        onSetGreetingSuccess();
      }
    },
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      address,
      greeting,
      getGreetingLoading,
      getGreetingError,
      setGreeting,
      setGreetingLoading: setGreetingLoading || txLoading,
      prepareSetGreetingError,
      setGreetingError,
    });
  }, [
    address,
    greeting,
    getGreetingLoading,
    getGreetingError,
    setGreeting,
    setGreetingLoading,
    prepareSetGreetingError,
    setGreetingError,
    txLoading,
  ]);

  return state;
};

export { useGreeting };
