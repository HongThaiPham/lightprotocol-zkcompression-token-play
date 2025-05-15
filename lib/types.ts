import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

export type SolAsset = {
  mint: string;
  name: string;
  symbol: string;
  image?: string;
  decimals: number;
  price?: number;
  userTokenAccount?: {
    address: string;
    amount: number;
  };
  authority?: string;
};

export type FetchAssetsArgs = {
  addresses: string[];
  owner?: string;
  connection?: Connection;
  combineNativeBalance?: boolean;
};

export type FetchWalletArgs = {
  owner: PublicKey;
  limit?: number;
  connection?: Connection;
  combineNativeBalance?: boolean;
};

export type FetchWalletCompressedTokensArgs = {
  owner: string;
  mint?: string;
  limit?: number;
};

export type SearchAssetsArgs = {
  query: string;
  owner?: PublicKey;
  connection?: Connection;
  combineNativeBalance?: boolean;
};

export type TrendingAssetsArgs = {
  owner?: PublicKey;
  limit?: number;
};

export type CreateMintArgs = {
  authority?: PublicKey;
  decimals?: number;
  name: string;
  symbol: string;
  uri: string;
  additionalMetadata?: (readonly [string, string])[];
};

export type MintCompressedTokenArgs = {
  to: PublicKey;
  amount: number;
  mint: PublicKey;
  authority?: PublicKey;
};

export type CompressTokenArgs = {
  mint: PublicKey;
  amount: number;
};

export type DecompressTokenArgs = {
  mint: PublicKey;
  amount: number;
};

export type BaseTxnResult = {
  txnSignature: string;
};

export type TransferTokensArgs = {
  to: PublicKey;
  amount: number;
  mint: PublicKey;
};

export type CompressedTokenInfo = {
  mint: string;
  balance: number;
  compressed: boolean;
};

export type BaseIxResponse = {
  instructions: TransactionInstruction[];
};

export type CreateZKMintIxArgs = {
  creator: PublicKey;
  authority?: PublicKey;
  decimals?: number;
  name: string;
  symbol: string;
  uri: string;
  additionalMetadata?: (readonly [string, string])[];
};

export type CreateZKMintToIxArgs = {
  authority: PublicKey;
  mint: PublicKey;
  amount: number;
  to: PublicKey;
};

export type CreateZKTransferIxArgs = {
  owner: PublicKey;
  mint: PublicKey;
  amount: number;
  to: PublicKey;
};

export type CreateZKCompressIxArgs = {
  receiver: PublicKey;
  mint: PublicKey;
  amount: number;
  payer?: PublicKey;
};

export type CreateZKDecompressIxArgs = {
  owner: PublicKey;
  mint: PublicKey;
  amount: number;
};

export type CompressedTokenDetails = {
  account: {
    hash?: string;
    lamports?: number;
    leafIndex?: number;
    owner?: string;
    seq?: number;
    slotCreated?: number;
    tree?: string;
    decimals?: number;
    balance?: number;
    data?: {
      data: string;
      dataHash: string;
      discriminator: number;
    };
  };
  token: {
    mint: PublicKey;
    decimals: number;
    mintAuthority?: PublicKey | null;
    freezeAuthority?: PublicKey | null;
  };
};

export type TokenAccount = {
  address: string;
  amount: number;
  delegated_amount: number;
  frozen: boolean;
  mint: string;
  owner: string;
};

export type CheckHelioChargeIdResponse = {
  id: string;
  token: string;
  paylink: {
    id: string;
  };
  paylinkTx?: {
    id: string;
    paylinkId: string;
    meta: {
      id: string;
      amount: string;
      senderPK: string;
      recipientPK: string;
      transactionSignature: string;
      transactionStatus: string;
    };
  };
  pricingCurrencyRequestAmount: string;
};
