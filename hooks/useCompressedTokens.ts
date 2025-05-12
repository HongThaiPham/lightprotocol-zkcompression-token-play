import { fetchComporessedTokenByOwnerAction } from "@/app/_actions/asset.action";
import { useQuery } from "@tanstack/react-query";

const useCompressedTokens = (wallet: string, mint?: string) => {
  return useQuery({
    queryKey: ["compressedTokens", wallet],
    queryFn: async () => {
      return fetchComporessedTokenByOwnerAction({
        owner: wallet,
        mint,
      });
    },
  });
};

export default useCompressedTokens;
