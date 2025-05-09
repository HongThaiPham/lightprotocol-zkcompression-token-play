import TokenListByOwner from "@/components/TokenListByOwner";
import React from "react";
type Props = {
  params: Promise<{
    wallet: string;
  }>;
};
const CTokenOfWallet: React.FC<Props> = async ({ params }) => {
  const { wallet } = await params;
  return <TokenListByOwner wallet={wallet} />;
};

export default CTokenOfWallet;
