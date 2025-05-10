import "server-only";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  SolAsset,
  FetchWalletArgs,
  FetchWalletCompressedTokensArgs,
} from "@/lib/types";
import { SOL_MINT, WSOL_MINT } from "@/lib/consts";
import { networkConnection } from "../shared";
import {
  getMint,
  getTokenMetadata,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

/**
 * Fetches all token assets for a wallet address from Helius API
 * Includes metadata, balances, and native SOL balance
 * @param args - Object containing fetch parameters
 * @param args.owner - Wallet address to fetch token list for
 * @param args.connection - Optional web3 connection (required if fetching SOL balance)
 * @param args.combineNativeBalance - Optional boolean to combine WSOL and native SOL
 * @returns Array of SolAsset objects containing token data
 * @example
 * const assets = await fetchWalletAssets({
 *   owner: new PublicKey("...")
 * });
 */
const fetchWalletAssets = async ({
  owner,
  connection = networkConnection,
  limit = 20,
  combineNativeBalance = true,
}: FetchWalletArgs & { connection?: Connection }): Promise<SolAsset[]> => {
  const fetchedAssets: SolAsset[] = [];

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_RPC_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "text",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: owner.toString(),
          page: 1,
          limit: 1000,
          options: {
            showFungible: true,
            showNativeBalance: true,
          },
        },
      }),
    });

    const data = await response.json();

    if (!data || !data.result || data.error) {
      console.error("Error fetching assets:", data.error);
      return [];
    }

    let nativeSolBalance = 0;
    let wsolBalance = 0;
    let solPrice = 0;

    // Get native SOL balance from connection if provided
    if (connection) {
      try {
        nativeSolBalance = await connection.getBalance(owner);
        nativeSolBalance = nativeSolBalance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error("Error fetching native SOL balance:", error);
      }
    }

    // Get SOL price from Helius response
    if (data.result.nativeBalance) {
      solPrice = data.result.nativeBalance.price_per_sol;
    }

    for (const asset of data.result.items) {
      if (!asset.token_info) continue;

      // Handle WSOL separately
      if (asset.id === WSOL_MINT.toBase58()) {
        wsolBalance =
          Number(asset.token_info.balance || 0) /
          Math.pow(10, asset.token_info.decimals);
        // Only include WSOL if not combining with native SOL
        if (!combineNativeBalance) {
          fetchedAssets.push({
            mint: WSOL_MINT.toBase58(),
            name: "Wrapped SOL",
            symbol: "WSOL",
            image:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            price: asset.token_info.price_info?.price_per_token,
            decimals: asset.token_info.decimals,
            userTokenAccount: {
              address: WSOL_MINT.toBase58(),
              amount: wsolBalance,
            },
          });
        }
        continue;
      }

      const tokenBalance =
        Number(asset.token_info.balance || 0) /
        Math.pow(10, asset.token_info.decimals);

      fetchedAssets.push({
        mint: asset.id,
        name: asset.content.metadata.name,
        symbol: asset.content.metadata.symbol || asset.token_info.symbol,
        image: asset.content.files?.[0]?.uri,
        price: asset.token_info.price_info?.price_per_token,
        decimals: asset.token_info.decimals,
        userTokenAccount: {
          address: asset.id,
          amount: tokenBalance,
        },
      });
    }

    // Always add native SOL, combine with WSOL if specified
    const totalSolBalance = combineNativeBalance
      ? nativeSolBalance + wsolBalance
      : nativeSolBalance;

    fetchedAssets.push({
      mint: SOL_MINT.toBase58(),
      name: "Solana",
      symbol: "SOL",
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      price: solPrice,
      decimals: 9,
      userTokenAccount: {
        address: SOL_MINT.toBase58(),
        amount: totalSolBalance,
      },
    });

    // Sort assets by USD value
    return fetchedAssets
      .sort((a, b) => {
        const aValue = (a.userTokenAccount?.amount || 0) * (a.price || 0);
        const bValue = (b.userTokenAccount?.amount || 0) * (b.price || 0);
        return bValue - aValue;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching wallet assets:", error);
    return [];
  }
};

const fetchWalletCompressedTokens = async ({
  owner,
  mint,
  limit = 20,
}: FetchWalletCompressedTokensArgs): Promise<SolAsset[]> => {
  const fetchedAssets: SolAsset[] = [];
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_RPC_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "getCompressedTokenBalancesByOwnerV2",
        method: "getCompressedTokenBalancesByOwnerV2",
        params: {
          owner: owner.toString(),
          mint,
          limit,
        },
      }),
    });

    const data = await response.json();

    if (!data || !data.result || data.error) {
      console.error("Error fetching assets:", data.error);
      return [];
    }

    const items = data.result.value.items;

    const mintWithTokenMetdata = await Promise.all(
      items.map(async (item: { mint: string; balance: number | bigint }) => {
        const tokenMetadata = await getTokenMetadata(
          networkConnection,
          new PublicKey(item.mint),
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );
        const mintInfo = await getMint(
          networkConnection,
          new PublicKey(item.mint),
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );
        return {
          ...item,
          tokenMetadata,
          mintInfo,
        };
      })
    );

    for (const asset of mintWithTokenMetdata) {
      if (!asset.mintInfo) continue;
      const tokenBalance =
        Number(asset.balance || 0) / Math.pow(10, asset.mintInfo.decimals);

      fetchedAssets.push({
        mint: asset.mint,
        name: asset.tokenMetadata?.name || "",
        symbol: asset.tokenMetadata?.symbol || "",
        decimals: asset.mintInfo.decimals,
        userTokenAccount: {
          address: asset.mint,
          amount: tokenBalance,
        },
        authority: asset.mintInfo.mintAuthority,
      });
    }

    // Sort assets by USD value
    return fetchedAssets.sort((a, b) => {
      const aValue = (a.userTokenAccount?.amount || 0) * (a.price || 0);
      const bValue = (b.userTokenAccount?.amount || 0) * (b.price || 0);
      return bValue - aValue;
    });
  } catch (error) {
    console.error("Error fetching wallet assets:", error);
    return [];
  }
};

export { fetchWalletAssets, fetchWalletCompressedTokens };
