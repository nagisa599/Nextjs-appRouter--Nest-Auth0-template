"use client";
import React, { PropsWithChildren } from "react";
import { PageLayout } from "@/components/PageLayout";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ApolloWrapper } from "@/provider/WithApollo";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ApolloWrapper>
            {/* <UrqlProvider client={client} ssr={ssr}> */}
            <PageLayout>{children}</PageLayout>
            {/* </UrqlProvider> */}
          </ApolloWrapper>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
