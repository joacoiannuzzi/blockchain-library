"use client";

import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const account = useAccount();

  if (!account.isConnected) {
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
