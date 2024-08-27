"use client";

import { clientUrqlClient } from "@/app/lib/client";
import { useMemo } from "react";
import { Provider, SSRData } from "urql";

export function UrqlClientProvider(props: {
  ssrData: SSRData;
  children: React.ReactNode;
}) {
  const client = useMemo(() => {
    return clientUrqlClient(props.ssrData);
  }, [props.ssrData]);

  return <Provider value={client}>{props.children}</Provider>;
}
