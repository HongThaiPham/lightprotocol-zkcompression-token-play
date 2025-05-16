"use server";

import {
  checkChargeId,
  createChargeLink,
  createPayLink,
} from "@/lib/helio-service";

export async function createPayLinkAction(): Promise<{
  url: string;
  id: string;
}> {
  const result = await createPayLink();
  if (!result) {
    throw new Error("Failed to create pay link");
  }
  return {
    id: result.id,
    url: `https://app.dev.hel.io/pay/${result.id}`,
  };
}

export async function createChargeLinkAction(): Promise<{
  url: string;
  id: string;
  chargeId: string;
  paymentRequestId: string;
} | null> {
  const response = await createChargeLink();
  if (response) {
    const chargeId = response.url.replace(
      process.env.NEXT_PUBLIC_HELIO_CHARGE_URL as string,
      ""
    );
    return {
      id: response.id,
      chargeId: chargeId,
      url: response.url,
      paymentRequestId: response.paymentRequestId,
    };
  }
  return null;
}

export async function checkChargeLinkAction(
  chargeId?: string,
  metadata?: {
    name: string;
    symbol: string;
    uri: string;
    decimals?: number;
    additionalMetadata?: { trait_type: string; value: string }[];
    initialSupply: number;
  }
) {
  if (!chargeId || !metadata) {
    return null;
  }
  const response = await checkChargeId(chargeId, metadata);
  // console.log("response", response);
  return response;
}
