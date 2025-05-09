import {
  createZKMintIx,
  getTxnForSigning,
  lightConnection,
} from "@/lib/light-protocol";
import { CreateMintArgs, BaseTxnResult } from "@/lib/types";
import { Rpc } from "@lightprotocol/stateless.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createContext, PropsWithChildren, useContext } from "react";

type LightProtocolContextType = {
  connection: Rpc;
  createMint: (
    args?: CreateMintArgs
  ) => Promise<BaseTxnResult & { mint: PublicKey }>;
  // mintTokens: (args: MintCompressedTokenArgs) => Promise<BaseTxnResult>;
  // transferTokens: (args: TransferTokensArgs) => Promise<BaseTxnResult>;
  // compressToken: (args: CompressTokenArgs) => Promise<BaseTxnResult>;
  // descompressToken: (args: DecompressTokenArgs) => Promise<BaseTxnResult>;
  // reclaimRent: (args: {
  //   mint: PublicKey;
  //   owner: PublicKey;
  // }) => Promise<BaseTxnResult>;
  // compressAndReclaimRent: (args: CompressTokenArgs) => Promise<BaseTxnResult>;
};

const LightProtocolContext = createContext<
  LightProtocolContextType | undefined
>(undefined);

export const LightProtocolProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { publicKey: connectedWallet, sendTransaction } = useWallet();

  const createMint = async (
    { authority = connectedWallet as PublicKey, decimals = 9 } = {
      authority: connectedWallet as PublicKey,
      decimals: 9,
    } as CreateMintArgs
  ) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightConnection.getLatestBlockhashAndContext();

    const { instructions, mintKp } = await createZKMintIx({
      creator: connectedWallet,
      authority,
      decimals,
    });

    console.log("Getting txn for signing...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
      [mintKp]
    );

    console.log("sending tx for signing...");
    const txnSignature = await sendTransaction(transaction, lightConnection, {
      signers: [mintKp],
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightConnection.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature: txnSignature,
    });

    console.log("tx confirmed:", txnSignature);
    console.log("new mint:", mintKp.publicKey);
    return { txnSignature, mint: mintKp.publicKey };
  };

  return (
    <LightProtocolContext.Provider
      value={{
        connection: {} as Rpc,
        createMint,
      }}
    >
      {children}
    </LightProtocolContext.Provider>
  );
};

export function useLightProtocol() {
  const context = useContext(LightProtocolContext);
  if (context === undefined) {
    throw new Error(
      "useLightProtocol must be used within a LightProtocolProvider"
    );
  }
  return context;
}
