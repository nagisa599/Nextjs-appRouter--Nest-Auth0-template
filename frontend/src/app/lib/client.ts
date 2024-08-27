import { cache } from "react";
import {
  fetchExchange,
  ssrExchange,
  cacheExchange,
  SSRExchange,
  SSRData,
  Client,
} from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import { getAccessToken } from "@auth0/nextjs-auth0";

export const serverSsrExchange = cache(() => {
  return ssrExchange({ isClient: false });
});

export const serverUrqlClient = cache(() => {
  return createUrqlClient(serverSsrExchange());
});

export function clientUrqlClient(initialState: SSRData) {
  console.log("create UrqlClient with initialState: ", initialState);
  return createUrqlClient(ssrExchange({ isClient: true, initialState }));
}

export async function createUrqlClient(ssrCache: SSRExchange) {
  const { accessToken } = await getAccessToken();
  console.log("accessToken: ", accessToken);
  return new Client({
    url: "localhost:3001/graphql",
    exchanges: [devtoolsExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
    },
  });
}
