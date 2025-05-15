"use client";
import {
  checkChargeLinkAction,
  createChargeLinkAction,
} from "@/app/_actions/helio.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import SkeletonWapper from "../SkeletonWapper";
import { CheckHelioChargeIdResponse } from "@/lib/types";

const HelioContext = createContext<
  | {
      newChargeLink: () => Promise<{
        url: string;
        id: string;
        chargeId: string;
        paymentRequestId: string;
      } | null>;
      chargeId: string | undefined;
      setChargeId: (chargeId: string | undefined) => void;
      isChecking?: boolean;
      chargeLinkData?: CheckHelioChargeIdResponse | null;
      setMetadata: (metadata: {
        name: string;
        symbol: string;
        uri: string;
        decimals?: number;
        additionalMetadata?: { trait_type: string; value: string }[];
        initialSupply: number;
      }) => void;
    }
  | undefined
>(undefined);

const HelioProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [chargeId, setChargeId] = useState<string | undefined>(undefined);
  const [metadata, setMetadata] = useState<
    | {
        name: string;
        symbol: string;
        uri: string;
        decimals?: number;
        additionalMetadata?: { trait_type: string; value: string }[];
        initialSupply: number;
      }
    | undefined
  >(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const { mutateAsync: newChargeLink, isPending } = useMutation({
    mutationKey: ["create-charge-link"],
    mutationFn: createChargeLinkAction,
  });

  const { data: chargeLinkData } = useQuery({
    queryKey: ["check-charge-link", chargeId],
    queryFn: async () => {
      setIsChecking(true);
      return checkChargeLinkAction(chargeId, metadata);
    },
    enabled: !!chargeId,
    refetchInterval: (query) => {
      console.log("query", query.state.data);
      if (!query || !query.state.data || !query.state.data.paylinkTx) {
        return 3000;
      }
      setIsChecking(false);
      return false;
    },
    refetchIntervalInBackground: true,
  });

  return (
    <HelioContext.Provider
      value={{
        newChargeLink,
        chargeId,
        setChargeId,
        isChecking,
        chargeLinkData,
        setMetadata,
      }}
    >
      <SkeletonWapper isLoading={isChecking || isPending}>
        {children}
      </SkeletonWapper>
    </HelioContext.Provider>
  );
};

export function useHelio() {
  const context = useContext(HelioContext);
  if (context === undefined) {
    throw new Error("useHelio must be used within a HelioProvider");
  }
  return context;
}

export default HelioProvider;
