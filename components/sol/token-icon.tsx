"use client";

import React from "react";

import Image from "next/image";
import { SolAsset } from "@/lib/types";
import { Avatar } from "./avatar";

type IconProps = {
  asset: SolAsset | null;
  size?: number;
};

const TokenIcon = ({ asset, size = 24 }: IconProps) => {
  return (
    <div
      className="relative shrink-0 rounded-full border border-border bg-background p-0"
      style={{
        width: size + 2,
        height: size + 2,
      }}
    >
      {/* <Image
        src="/token-icons/placeholder.jpg"
        alt={asset?.symbol ?? asset?.mint.toBase58() ?? ""}
        width={size}
        height={size}
        className="absolute inset-0 rounded-full"
      /> */}
      {asset?.mint ? (
        <Avatar
          address={asset?.mint}
          size={size}
          className="absolute inset-0 rounded-full"
        />
      ) : null}
      {asset?.image ? (
        <Image
          src={asset?.image ?? ""}
          alt={asset?.symbol ?? asset?.mint ?? ""}
          width={size}
          height={size}
          className="absolute inset-0 rounded-full"
          style={{
            width: size,
            height: size,
          }}
        />
      ) : null}
    </div>
  );
};

export { TokenIcon };
