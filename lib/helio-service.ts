import "server-only";
import axios from "axios";
const HELIO_API_URL = process.env.NEXT_PUBLIC_HELIO_API_URL as string;
const HELIO_API_KEY = process.env.HELIO_PUBLIC_API_KEY as string;
const HELIO_API_SECRET = process.env.HELIO_SECRET_API_KEY as string;
const WALLET_ID = process.env.NEXT_PUBLIC_HELIO_WALLET_ID as string;

export async function createPayLink() {
  try {
    const result = await axios.post(
      `${HELIO_API_URL}/paylink/create/api-key`,
      {
        template: "SUBSCRIPTION", // Important that this is capitalized
        name: "Create cToken Paylink",
        price:
          "1000000000" /* price is int64 represented by the base units of each currency, e.g. "price": "1000000" = 1 USDC*/,
        pricingCurrency: "63430c8348c610068bcdc474", // To get currency IDs, see the /get-currencies endpoint
        features: {
          isSubscription: true,
          enableCountdown: true,
          shouldRedirectOnSuccess: true,
        },
        recipients: [
          {
            walletId: WALLET_ID, // Change this to your wallet id
            currencyId: "63430c8348c610068bcdc474", // To get currency IDs, see the /get-currencies endpoint
          },
        ],
        subscriptionDetails: {
          renewalReminders: 3 /* number of daily renewal reminders before subscription cancellation */,
          gracePeriod: 2 /* grace period (in days) after subscription expiry */,
          annualDiscountBps: 10 /* discount in basis points if the subscription is annual */,
          interval: "MONTH" /* set the subscription interval: MONTH or YEAR */,
        },
        // redirectUrl:
        //   "https://localhost:3000/link/" /* set a URL to redirect users to after a successful transaction on your pay link */,
        // redirectQueryParams: [
        //   { wallet: "xxasdjasvdksv-da" },
        // ] /* set redirect query param */,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `${error.response?.data?.code} ${error.response?.data?.message}`
    );

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
