'use client';
import React from 'react'
import { useLightProtocol } from './providers/LightProtocolProvider';
import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

const MintToButton = () => {
  const { mintTokens } = useLightProtocol();
  const { mutate, isPending } = useMutation({
    mutationKey: ["mintTo"],
    mutationFn: () =>
      mintTokens({
        mint: new PublicKey('5tVWx4f1ncG394ibkyPgujGK4GCmQYQJ6agbRBt3A5Er'),
        amount: 10000000000,
        to: new PublicKey('7opYA2gqvNL1TqANcBuy9PeEG8znzzHfdf4m3kME5qr8'),
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
}

export default MintToButton