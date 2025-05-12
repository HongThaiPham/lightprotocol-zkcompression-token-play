import "server-only";
import axios from "axios";
const HELIO_API_URL = process.env.NEXT_PUBLIC_HELIO_API_URL as string;
const HELIO_API_KEY = process.env.HELIO_PUBLIC_API_KEY as string;
const HELIO_API_SECRET = process.env.HELIO_SECRET_API_KEY as string;
const WALLET_ID = process.env.NEXT_PUBLIC_HELIO_WALLET_ID as string;

export async function createChargeLink() {
  try {
    const result = await axios.post(
      `${HELIO_API_URL}/charge/api-key`,
      {
        paymentRequestId: "6821acd5d9e277a086f75800",
        requestAmount: "0.002",
        prepareRequestBody: {
          customerDetails: {
            additionalJSON: JSON.stringify({
              name: "John Doe",
              email: "john@gmail.com",
            }),
          },
        },
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
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
