"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import { useGetTodosQuery } from "../../../graphql/dist/graphql";

const Page = () => {
  const [result] = useGetTodosQuery();
  console.log("result: ", result.data);
  console.log("error", result.error);

  const { user } = useUser();
  return (
    <div>
      <div>これはログイン後のページだよ</div>
      <div>ユーザー名: {user?.name}</div>
    </div>
  );
};

export default Page;
