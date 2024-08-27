import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
export async function POST(request: NextRequest) {
  // NextRequestは通常のRequestオブジェクトにさまざまな機能を追加したもの
  const res = new NextResponse();
  // cookieからacce
  const { accessToken } = await getAccessToken(request, res);
  // ReadableStream をテキストに変換 (requestbodyを取得するため)
  const requestBody = await request.text();
  // objectに変換
  const { query, variables } = JSON.parse(requestBody) as {
    query: string;
    variables?: any;
  };
  const graphqlResponse = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Bearerトークンとしてアクセストークンを設定
    },
    // bodyは文字列出ないといけないため
    body: JSON.stringify({ query, variables }), // リクエストボディを正しくフォーマット
  });
  const responseBody = await graphqlResponse.text();
  // clientに返すための型に生成し直す。
  return new Response(responseBody, {
    status: graphqlResponse.status,
    statusText: graphqlResponse.statusText,
  });
}
