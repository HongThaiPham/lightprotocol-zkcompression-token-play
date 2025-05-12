import { useLightProtocol } from "@/components/providers/LightProtocolProvider";
import { PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

const useMintToToken = (mintAddress: string) => {
  const { mintTokens } = useLightProtocol();

  return useMutation({
    mutationKey: ["mintTo", mintAddress],
    mutationFn: async (payload: { to: string; amount: number }) =>
      mintTokens({
        mint: new PublicKey(mintAddress),
        amount: payload.amount,
        to: new PublicKey(payload.to),
      }),
  });
};

export default useMintToToken;
