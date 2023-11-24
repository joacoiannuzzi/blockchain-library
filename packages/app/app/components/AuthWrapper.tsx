"use client";

import { ReactNode, useEffect, useState } from "react";
import { PublicClient, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { GetAccountResult } from "wagmi/actions";

const useSafeAccount = () => {
  const [account, setAccount] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const accountFromHook = useAccount();

  useEffect(() => {
    setAccount(accountFromHook.isConnected);
    setAddress(accountFromHook.address);
  }, [accountFromHook.address, accountFromHook.isConnected]);

  return {
    address,
    account,
  };
};

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { account, address } = useSafeAccount();

  if (account === undefined) {
    return (
      <div className="mx-auto px-6">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-4xl font-bold text-center">
              Blockchain Library
            </h1>
            <h3 className="text-xl font-semibold text-center">
              Loading account...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="mx-auto px-6">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-4xl font-bold text-center">
              Blockchain Library
            </h1>
            <h3 className="text-xl font-semibold text-center">
              Please connect your wallet to continue
            </h3>
            <div>
              <ConnectButton
                showBalance={false}
                accountStatus="address"
                label="Connect"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
