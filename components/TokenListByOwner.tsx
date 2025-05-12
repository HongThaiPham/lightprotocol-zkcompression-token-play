"use client";
import useCompressedTokens from "@/hooks/useCompressedTokens";
import React from "react";
import { TokenList } from "./sol/token-list";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const TokenListByOwner = ({ wallet }: { wallet: string }) => {
  const { data, isPending } = useCompressedTokens(wallet);
  if (!data || isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-2">
        <Loader2Icon className="size-6 animate-spin" />
        <div className="text-2xl font-bold">Loading compressed tokens...</div>
      </div>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Compressed Tokens</CardTitle>
        <CardDescription>
          This is a list of compressed tokens owned by{" "}
          <span className="text-primary">{wallet}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TokenList assets={data} isLoading={isPending} />
      </CardContent>
    </Card>
  );
};

export default TokenListByOwner;
