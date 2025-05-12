import { useLightProtocol } from "@/components/providers/LightProtocolProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMutation } from "@tanstack/react-query";

const useCreateMint = () => {
  const { createMint, mintTokens } = useLightProtocol();
  const { publicKey } = useWallet();

  return useMutation({
    mutationKey: ["createMint"],
    mutationFn: async (payload: {
      name: string;
      symbol: string;
      uri: string;
      decimals?: number;
      additionalMetadata?: { trait_type: string; value: string }[];
      initialSupply: number;
    }) => {
      if (!publicKey) {
        return Promise.reject("No connected wallet");
      }
      const { mint } = await createMint({
        decimals: payload.decimals || 6,
        name: payload.name,
        symbol: payload.symbol,
        uri: payload.uri,
        additionalMetadata: payload.additionalMetadata?.map(
          (item) => [item.trait_type, item.value] as const
        ),
      });

      if (!mint) {
        return Promise.reject("Mint creation failed");
      }

      // wait for the mint to be created
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return mintTokens({
        mint,
        to: publicKey,
        amount: payload.initialSupply * 10 ** Number(payload.decimals || 6),
      });
    },
  });
};

export default useCreateMint;
