import { fetchAssetsAction } from "@/app/_actions/asset.action";
import { SolAsset } from "@/lib/types";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const useAssets = ({
  addresses,
  owner,
}: {
  addresses: PublicKey[];
  owner?: PublicKey;
}) => {
  return useQuery<SolAsset[]>({
    queryKey: ["fetchAssets"],
    queryFn: async () => {
      return fetchAssetsAction({
        addresses: addresses.map((address) => address.toString()),
        owner: owner ? owner.toString() : undefined,
      });

    },
  });
};

export default useAssets;
