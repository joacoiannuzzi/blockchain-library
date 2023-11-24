import { libraryAbi } from "@/app/abi/library";
import { envClientSchema } from "@/envVars";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";

export const useGetTokenAmount = () => {
  const account = useAccount();

  // This pattern prevents Next.js server side hydration mismatch errors
  const [state, setState] = useState({
    tokens: BigInt(0),
    tokensLoading: true,
    tokensError: false,
  });

  const {
    data: tokens,
    isLoading: tokensLoading,
    isError: tokensError,
  } = useContractRead({
    address: envClientSchema.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
    chainId: envClientSchema.NEXT_PUBLIC_CHAIN_ID,
    abi: libraryAbi,
    functionName: "userTokens",
    watch: true,
    args: [account.address ?? "0x"],
    enabled: !!account.address,
  });

  // Setting state in useEffect ensures that the state is only updated on the client side
  useEffect(() => {
    setState({
      tokens: tokens ?? BigInt(0),
      tokensLoading,
      tokensError,
    });
  }, [tokens, tokensLoading, tokensError]);

  return state;
};
