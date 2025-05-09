"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import React, { PropsWithChildren, useMemo } from "react";
import AppThemeProvider from "./AppThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lightConnection } from "@/lib/light-protocol";
import { LightProtocolProvider } from "./LightProtocolProvider";
import { Toaster } from "../ui/sonner";
import { TxnToaster } from "../sol/txn-toast";
const queryClient = new QueryClient();
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const endpoint = useMemo(() => lightConnection.rpcEndpoint, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <AppThemeProvider>
            <LightProtocolProvider>{children}</LightProtocolProvider>
            <Toaster />
            <TxnToaster />
          </AppThemeProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
