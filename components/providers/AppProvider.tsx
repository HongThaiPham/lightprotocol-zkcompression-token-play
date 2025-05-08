"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import React, { PropsWithChildren } from "react";
import AppThemeProvider from "./AppThemeProvider";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppProvider;
