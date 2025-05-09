"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div>
      <h2>sdfjhsdkfhl</h2>

      <div>{publicKey?.toBase58()}</div>
    </div>
  );
}
