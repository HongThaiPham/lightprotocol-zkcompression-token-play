import { clusterApiUrl, Connection } from "@solana/web3.js";

export const networkConnection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet"),
  {
    commitment: "confirmed",
  }
);
