"use client";
import CreateMintButton from "@/components/CreateMintButton";
import MintToButton from "@/components/MintToButton";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export default function Home() {
  const { connected } = useWallet();
  if (!connected) {
    return null;
  }
  return (
    <div>
      <CreateMintButton />
      <MintToButton />
    </div>
  );
}
