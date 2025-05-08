"use client";
import { Wallet } from "@/components/sol/wallet";
import { Button } from "@/components/ui/button";
import { fetchWalletAssets } from "@/lib/assets/helius/wallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export default function Home() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [assets, setAssets] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching || !publicKey) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
        owner: publicKey,
        connection,
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, publicKey, connection]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  return (
    <Wallet
      address={publicKey}
      assets={[]}
      trigger={<Button>Show Wallet</Button>}
    />
  );
}
