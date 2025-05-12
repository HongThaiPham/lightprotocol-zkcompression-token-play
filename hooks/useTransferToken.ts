import { useLightProtocol } from "@/components/providers/LightProtocolProvider";
import { PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

const useTransferToken = (mintAddress: string) => {
  const { transferTokens } = useLightProtocol();

  return useMutation({
    mutationKey: ["mintTo", mintAddress],
    mutationFn: async (payload: { to: string; amount: number }) =>
      transferTokens({
        mint: new PublicKey(mintAddress),
        amount: payload.amount,
        to: new PublicKey(payload.to),
      }),
  });
};

export default useTransferToken;
