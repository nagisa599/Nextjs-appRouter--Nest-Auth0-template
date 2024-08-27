"use client";

import React, { PropsWithChildren } from "react";
import NavBar from "./NavBar/NavBar";
import Loading from "./Loading/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="page-layout">
        <Loading />
      </div>
    );
  }

  return (
    <div className="page-layout">
      <NavBar />
      <div className="page-layout__content">{children}</div>
    </div>
  );
};
