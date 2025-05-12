import {
  createZKMintIx,
  createZKMintToIx,
  getTxnForSigning,
  lightConnection,
} from "@/lib/light-protocol";
import {
  CreateMintArgs,
  BaseTxnResult,
  MintCompressedTokenArgs,
} from "@/lib/types";
import { Rpc } from "@lightprotocol/stateless.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createContext, PropsWithChildren, useContext } from "react";
import { useTxnToast } from "../sol/txn-toast";
import { useQueryClient } from "@tanstack/react-query";

type LightProtocolContextType = {
  connection: Rpc;
  createMint: (
    args?: CreateMintArgs
  ) => Promise<BaseTxnResult & { mint: PublicKey }>;
  mintTokens: (args: MintCompressedTokenArgs) => Promise<BaseTxnResult>;
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
  const { txnToast } = useTxnToast();
  const queryClient = useQueryClient();

  const createMint = async (
    {
      authority = connectedWallet as PublicKey,
      decimals = 9,
      name,
      symbol,
      uri,
      additionalMetadata,
    } = {
      authority: connectedWallet as PublicKey,
      decimals: 9,
    } as CreateMintArgs
  ) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    const signingToast = txnToast(
      "Creating mint...",
      "Please sign the transaction to create new token mint"
    );

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightConnection.getLatestBlockhashAndContext();

    const { instructions, mintKp } = await createZKMintIx({
      creator: connectedWallet,
      authority,
      decimals,
      name,
      symbol,
      uri,
      additionalMetadata,
    });

    console.log("Getting txn for signing...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
      [mintKp]
    );

    try {
      console.log("sending tx for signing...");
      const txnSignature = await sendTransaction(transaction, lightConnection, {
        signers: [mintKp],
        minContextSlot,
      });

      console.log("confirming tx...");
      const confirmation = lightConnection.confirmTransaction({
        blockhash: blockhashCtx.blockhash,
        lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
        signature: txnSignature,
      });

      signingToast.confirm(txnSignature, confirmation);

      console.log("tx confirmed:", txnSignature);
      console.log("new mint:", mintKp.publicKey);
      return { txnSignature, mint: mintKp.publicKey };
    } catch (error) {
      console.error("Error creating mint:", error);
      signingToast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      throw error;
    }
  };

  const mintTokens = async ({
    to,
    amount,
    mint,
    authority = connectedWallet as PublicKey,
  }: MintCompressedTokenArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }
    const signingToast = txnToast(
      "Minting tokens...",
      "Please sign the transaction to mint tokens"
    );

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightConnection.getLatestBlockhashAndContext();

    console.log("creating mint to instructions...");
    const { instructions } = await createZKMintToIx({
      authority,
      mint,
      amount,
      to,
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash
    );

    try {
      console.log("sending tx for signing...");
      const signature = await sendTransaction(transaction, lightConnection, {
        minContextSlot,
      });

      console.log("confirming tx...");

      const confirmation = lightConnection.confirmTransaction({
        blockhash: blockhashCtx.blockhash,
        lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
        signature,
      });
      await signingToast.confirm(signature, confirmation);

      console.log("tx confirmed", signature);

      await queryClient.invalidateQueries({
        queryKey: ["compressedTokens", authority.toString()],
      });
      return { txnSignature: signature };
    } catch (error) {
      console.error("Error minting tokens:", error);
      signingToast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      throw error;
    }
  };

  return (
    <LightProtocolContext.Provider
      value={{
        connection: lightConnection,
        createMint,
        mintTokens,
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
