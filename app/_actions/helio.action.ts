"use server";

import { createChargeLink, createPayLink } from "@/lib/helio-service";

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
}> {
  const result = await createChargeLink();
  if (!result) {
    throw new Error("Failed to create charge link");
  }
  return result;
}
