"use server";

import { fetchAssets } from "@/lib/assets/helius/fetch";
import { FetchAssetsArgs } from "@/lib/types";

export const fetchAssetsAction = async ({
  addresses,
  owner,
  combineNativeBalance = true,
}: FetchAssetsArgs) => {
  return fetchAssets({
    addresses,
    owner,
    combineNativeBalance,
  });
};
