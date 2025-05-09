"use server";

import { fetchAssets } from "@/lib/assets/helius/fetch";
import { fetchWalletCompressedTokens } from "@/lib/assets/helius/wallet";
import { FetchAssetsArgs, FetchWalletCompressedTokensArgs } from "@/lib/types";

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


export const fetchComporessedTokenByOwnerAction = async ({
  owner,
  mint,
  limit = 20,
}: FetchWalletCompressedTokensArgs) => {
  return fetchWalletCompressedTokens({
    owner,
    mint,
    limit
  });
};