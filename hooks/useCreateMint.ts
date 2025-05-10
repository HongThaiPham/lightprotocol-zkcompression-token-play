import { useLightProtocol } from "@/components/providers/LightProtocolProvider";
import { useMutation } from "@tanstack/react-query";

const useCreateMint = () => {
  const { createMint } = useLightProtocol();

  return useMutation({
    mutationKey: ["createMint"],
    mutationFn: (payload: {
      name: string;
      symbol: string;
      uri: string;
      decimals?: number;
      additionalMetadata?: { trait_type: string; value: string }[];
    }) =>
      createMint({
        decimals: payload.decimals || 6,
        name: payload.name,
        symbol: payload.symbol,
        uri: payload.uri,
        additionalMetadata: payload.additionalMetadata?.map(
          (item) => [item.trait_type, item.value] as const
        ),
      }),
  });
};

export default useCreateMint;
