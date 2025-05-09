"use client";
import React from "react";
import { useLightProtocol } from "./providers/LightProtocolProvider";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

const MintToButton = () => {
  const { mintTokens } = useLightProtocol();
  const { mutate, isPending } = useMutation({
    mutationKey: ["mintTo"],
    mutationFn: () =>
      mintTokens({
        mint: new PublicKey("krdKYLLN9iU3RjxaGTT2vNfAEMhJyU6aVsVx4Lh4kgg"),
        amount: 10000000000,
        to: new PublicKey("7opYA2gqvNL1TqANcBuy9PeEG8znzzHfdf4m3kME5qr8"),
      }),
  });
  const handleClick = async () => {
    mutate();
  };
  return (
    <div>
      CreateMintButton
      <Button onClick={handleClick}>
        {isPending ? <Loader2Icon className="animate-spin mr-2" /> : null}
        Mint Tokens
      </Button>
    </div>
  );
};

export default MintToButton;
