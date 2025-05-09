import { Connection, PublicKey } from "@solana/web3.js";

export type SolAsset = {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  price: number;
  userTokenAccount?: {
    address: string;
    amount: number;
  };
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
