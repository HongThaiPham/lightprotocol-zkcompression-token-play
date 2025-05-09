import TokenListByOwner from "@/components/TokenListByOwner";
import React from "react";
type Props = {
  params: Promise<{
    wallet: string;
  }>;
};
const CTokenOfWallet: React.FC<Props> = async ({ params }) => {
  const { wallet } = await params;
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center p-8">
      <TokenListByOwner wallet={wallet} />
    </div>
  );
};

export default CTokenOfWallet;
