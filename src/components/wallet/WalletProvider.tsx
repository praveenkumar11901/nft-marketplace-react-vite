import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { aptosConfig } from "./WalletConstants";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const wallets = [new PetraWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={aptosConfig}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
