"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { CopyIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { formatNumber, formatUsd, shortAddress } from "@/lib/utils";
import { SolAsset } from "@/lib/types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar } from "@/components/sol/avatar";
import { TokenIcon } from "@/components/sol/token-icon";

type UserDropdownProps = {
  address: PublicKey | null;
  assets?: SolAsset[];
  size?: number;
  isLoading?: boolean;
};

const UserDropdown = ({
  address,
  assets = [],
  size = 42,
  isLoading,
}: UserDropdownProps) => {
  const { connected, disconnect } = useWallet();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const totalBalance = React.useMemo(() => {
    return assets.reduce(
      (acc, asset) =>
        acc + (asset.userTokenAccount?.amount || 0) * (asset.price || 0),
      0
    );
  }, [assets]);

  if (!address) {
    return (
      <Skeleton
        className="h-full w-full rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar address={address} size={size} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-1">
            <dt>Address</dt>
            <dd className="flex justify-end">
              <CopyToClipboard
                text={address.toBase58()}
                onCopy={() => {
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
              >
                {isCopied ? (
                  <div className="flex items-center justify-end gap-1 self-end">
                    Copied <CheckIcon size={16} />
                  </div>
                ) : (
                  <button className="flex items-center justify-end gap-1 self-end">
                    {shortAddress(address)}
                    <CopyIcon size={16} />
                  </button>
                )}
              </CopyToClipboard>
            </dd>

            <dt>Balance</dt>
            <dd className="flex justify-end">{formatUsd(totalBalance)}</dd>
          </dl>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2Icon className="animate-spin" />
              <p>Loading tokens...</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {assets.map((asset) => (
                <li key={asset.mint} className="flex items-center gap-2">
                  <TokenIcon asset={asset} />
                  <span>{asset.symbol}</span>
                  <span className="ml-auto flex flex-col text-right">
                    {asset.userTokenAccount?.amount ? (
                      <>
                        {formatNumber(asset.userTokenAccount.amount)}
                        {asset.price && (
                          <span className="text-xs text-muted-foreground">
                            {formatUsd(
                              asset.userTokenAccount.amount * asset.price
                            )}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        0
                        <span className="text-xs text-muted-foreground">
                          $0.00
                        </span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {connected && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { UserDropdown };
