"use client";
import { createClient, cacheExchange, fetchExchange, Provider } from "urql";

const client = createClient({
  // endpoint
  url: "http://localhost:3000/api/graphql",
  fetchOptions: {
    credentials: "include", // クッキーを使用する場合
  },
  exchanges: [cacheExchange, fetchExchange],
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <Provider value={client}>{children}</Provider>;
}
