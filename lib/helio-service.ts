import "server-only";
import axios from "axios";
import { CheckHelioChargeIdResponse } from "./types";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createZKMintIx,
  createZKMintToIx,
  getTxnForSigning,
  lightConnection,
} from "./light-protocol";
import { networkConnection } from "./assets/shared";
import {
  AuthorityType,
  createSetAuthorityInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
const HELIO_API_URL = process.env.NEXT_PUBLIC_HELIO_API_URL as string;
const HELIO_API_KEY = process.env.HELIO_PUBLIC_API_KEY as string;
const HELIO_API_SECRET = process.env.HELIO_SECRET_API_KEY as string;
const WALLET_ID = process.env.NEXT_PUBLIC_HELIO_WALLET_ID as string;
const PAYMENT_REQUEST_ID = process.env
  .NEXT_PUBLIC_HELIO_PAYMENT_REQUEST_ID as string;
const PRIVATE_KEY = process.env.PAY_PRIVATE_KEY as string;

export async function createChargeLink(): Promise<{
  url: string;
  id: string;
  paymentRequestId: string;
} | null> {
  try {
    const result = await axios.post(
      `${HELIO_API_URL}/charge/api-key`,
      {
        paymentRequestId: PAYMENT_REQUEST_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${HELIO_API_SECRET}`,
        },
        params: {
          apiKey: HELIO_API_KEY,
        },
      }
    );
    return {
      id: result.data.id,
      url: result.data.pageUrl,
      paymentRequestId: PAYMENT_REQUEST_ID,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createPayLink() {
  try {
    const result = await axios.post(
      `${HELIO_API_URL}/paylink/create/api-key`,
      {
        template: "SUBSCRIPTION", // Important that this is capitalized
        name: "Create cToken Paylink",
        price:
          "100000000" /* price is int64 represented by the base units of each currency, e.g. "price": "1000000" = 1 USDC*/,
        pricingCurrency: "63430c8348c610068bcdc474", // To get currency IDs, see the /get-currencies endpoint
        features: {
          isSubscription: true,
          // enableCountdown: true,
          shouldRedirectOnSuccess: true,
        },
        recipients: [
          {
            walletId: WALLET_ID, // Change this to your wallet id
            currencyId: "63430c8348c610068bcdc474", // SOL
          },
          {
            walletId: WALLET_ID, // Change this to your wallet id
            currencyId: "66e2b724a88df2dcc5f63fe8", // USDC-main
          },
          {
            walletId: WALLET_ID, // Change this to your wallet id
            currencyId: "63430c8348c610068bcdc482", // USDT-dev
          },
        ],
        subscriptionDetails: {
          renewalReminders: 3 /* number of daily renewal reminders before subscription cancellation */,
          gracePeriod: 2 /* grace period (in days) after subscription expiry */,
          annualDiscountBps: 1000 /* discount in basis points if the subscription is annual */,
          interval: "MONTH" /* set the subscription interval: MONTH or YEAR */,
        },
        redirectUrl:
          "https://www.google.com/process-pay/asdhajklsdhashdasjkd-asdasbdb-11212" /* set a URL to redirect users to after a successful transaction on your pay link */,
        redirectQueryParams: [
          {
            queryParamType: "WALLET_ADDRESS",
          },
        ] /* set redirect query param */,
      },
      {
        headers: {
          Authorization: `Bearer ${HELIO_API_SECRET}`,
        },
        params: {
          apiKey: HELIO_API_KEY,
        },
      }
    );

    console.log("HELIO API result", result);
    return result.data;
  } catch (error) {
    console.error("HELIO API error", error);
    return null;
  }

  // const result = await fetch(
  //   `${HELIO_API_URL}/paylink/create/api-key=${HELIO_API_KEY}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${HELIO_API_SECRET}`,
  //     },
  //     body: JSON.stringify({
  //       template: "OTHER",
  //       name: "Paylink Name Example",
  //       description: "Paylink Description Example",
  //       pricingCurrency: "63430c8348c610068bcdc43c",
  //       currency: "SOL",
  //       recipients: [
  //         {
  //           currencyId: "63430c8348c610068bcdc43c",
  //           walletId: WALLET_ID,
  //         },
  //       ],
  //       price: "1",
  //       features: {},
  //     }),
  //   }
  // );
  // console.log("HELIO API result", result);
}

export async function checkChargeId(
  chargeId: string,
  metadata: {
    name: string;
    symbol: string;
    uri: string;
    decimals?: number;
    additionalMetadata?: { trait_type: string; value: string }[];
    initialSupply: number;
  }
) {
  try {
    const result = await axios.get<CheckHelioChargeIdResponse | null>(
      `${HELIO_API_URL}/charge/${chargeId}`,
      {
        headers: {
          Authorization: `Bearer ${HELIO_API_SECRET}`,
        },
        params: {
          apiKey: HELIO_API_KEY,
        },
      }
    );

    console.log("HELIO API result", result.data?.paylinkTx);

    if (!!result.data?.paylinkTx) {
      const payer = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(PRIVATE_KEY))
      );

      const senderPublicKey = new PublicKey(
        result.data?.paylinkTx?.meta.senderPK
      );

      console.log("senderPublicKey", senderPublicKey.toBase58());

      const { instructions, mintKp } = await createZKMintIx({
        creator: payer.publicKey,
        name: metadata?.name,
        symbol: metadata?.symbol,
        uri: metadata?.uri,
        decimals: metadata?.decimals,
        additionalMetadata: metadata.additionalMetadata?.map(
          (item) => [item.trait_type, item.value] as const
        ),
        authority: senderPublicKey,
      });

      const {
        // context: { slot: minContextSlot },
        value: blockhashCtx,
      } = await lightConnection.getLatestBlockhashAndContext();

      const transaction = getTxnForSigning(
        instructions,
        payer.publicKey,
        blockhashCtx.blockhash,
        [mintKp]
      );

      transaction.sign([payer]);

      const signature = await networkConnection.sendTransaction(transaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      const confirmation = await lightConnection.confirmTransaction({
        blockhash: blockhashCtx.blockhash,
        lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
        signature,
      });
      console.log("confirmation", confirmation);

      const { instructions: mintoItxs } = await createZKMintToIx({
        authority: payer.publicKey,
        mint: mintKp.publicKey,
        amount: metadata.initialSupply,
        to: senderPublicKey,
      });

      const {
        // context: { slot: minContextSlot },
        value: blockhashCtx2,
      } = await lightConnection.getLatestBlockhashAndContext();

      const updateMintAuthorityIx = createSetAuthorityInstruction(
        mintKp.publicKey,
        payer.publicKey,
        AuthorityType.MintTokens,
        senderPublicKey,
        [],
        TOKEN_2022_PROGRAM_ID
      );

      const transaction2 = getTxnForSigning(
        [...mintoItxs, updateMintAuthorityIx],
        payer.publicKey,
        blockhashCtx2.blockhash
      );

      transaction2.sign([payer]);

      const signature2 = await networkConnection.sendTransaction(transaction2, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      const confirmation2 = await lightConnection.confirmTransaction({
        blockhash: blockhashCtx2.blockhash,
        lastValidBlockHeight: blockhashCtx2.lastValidBlockHeight,
        signature: signature2,
      });
      //confirmTransaction(networkConnection, txid);
      console.log("confirmation2", confirmation2);

      return {
        mint: mintKp.publicKey.toBase58(),
        ...result.data,
      };
    }

    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
