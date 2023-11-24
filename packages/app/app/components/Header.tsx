"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wrapper } from "@/app/components/Wrapper";
import { useAccount } from "wagmi";
import { useGetTokenAmount } from "../hooks/library/useGetTokenAmount";
import Link from "next/link";

const Header = () => {
  const account = useAccount();

  const { tokens, tokensLoading } = useGetTokenAmount();

  return (
    <header className="py-4 border-b bg-white">
      <Wrapper>
        <div className="flex justify-between">
          <Link href="/">
            <h1 className="text-lg md:text-2xl font-bold">
              Blockchain Library
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            {!tokensLoading && account?.address ? (
              <p className="text-sm text-gray-500">
                Tokens: {tokens?.toString()}
              </p>
            ) : null}

            <ConnectButton
              showBalance={false}
              accountStatus="address"
              label="Connect"
            />
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export { Header };
