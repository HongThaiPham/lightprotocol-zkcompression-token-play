"use client";

import React from "react";
import Link from "next/link";
import { EllipsisVerticalIcon, ExternalLinkIcon } from "lucide-react";

import {
  shortAddress,
  formatUsd,
  formatNumberShort,
  cn,
  getExplorerUrl,
} from "@/lib/utils";
import { SolAsset } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { TokenIcon } from "@/components/sol/token-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type TokenListProps = {
  assets: SolAsset[];
  showBalances?: boolean;
  showPrice?: boolean;
  onClick?: (token: SolAsset) => void;
  isLoading?: boolean;
};

const TokenList = ({
  assets,
  showBalances = true,
  showPrice = false,
  onClick,
  isLoading,
}: TokenListProps) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Token</TableHead>
          <TableHead>Mint</TableHead>
          {showPrice && <TableHead>Price</TableHead>}
          {showBalances && <TableHead>Balance</TableHead>}
          {showPrice && <TableHead>Value</TableHead>}
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading || assets.length === 0 ? (
          <>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {[...Array(showBalances ? 5 : 3)].map((_, index) => (
                  <TableCell key={index}>
                    {index === 0 ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-[32px] w-[32px] shrink-0 rounded-full" />
                        <Skeleton className="h-[22px] w-full" />
                      </div>
                    ) : (
                      <Skeleton className="h-[22px] w-full" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : (
          assets.map((asset) => (
            <TableRow
              key={asset.mint}
              className={cn(
                "group odd:bg-muted/25 hover:bg-transparent hover:text-primary hover:odd:bg-muted/25",
                onClick && "cursor-pointer"
              )}
              onClick={() => onClick && onClick(asset)}
            >
              <TableCell>
                <Link href={`/mint/${asset.mint}`}>
                  <div className="flex items-center gap-2 font-medium uppercase">
                    <TokenIcon asset={asset} />
                    {asset.symbol}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={getExplorerUrl(asset.mint, "account")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="border-b border-transparent group-hover:border-border">
                    {shortAddress(asset.mint)}
                  </span>
                  <ExternalLinkIcon size={16} />
                </Link>
              </TableCell>
              {showPrice && (
                <TableCell>{formatUsd(asset.price || 0)}</TableCell>
              )}
              {showBalances && (
                <TableCell>
                  {asset.userTokenAccount?.amount &&
                    formatNumberShort(asset.userTokenAccount.amount)}
                </TableCell>
              )}
              {showPrice && (
                <TableCell>
                  {asset.userTokenAccount?.amount &&
                    formatUsd(
                      asset.userTokenAccount.amount * (asset.price || 0)
                    )}
                </TableCell>
              )}
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant="ghost">
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Token Mint actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Mint to</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Token Account actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Transfer token</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export { TokenList };
