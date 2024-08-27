# 前提知識

https://zenn.dev/naginagi124/articles/f28fadec5a661d

# 技術選定

今回は、フロントエンドに Nextjs(App router)と backend に Nest(graphql)、認証基盤に Auth0 を採用している。

# github

https://github.com/nagisa599/WebAuth0Template

# 実装

## Auth0 の設定

#### Applicaton を作成

![](https://storage.googleapis.com/zenn-user-upload/c7a004472800-20240506.png)

#### Application の種類を選択

Application の種類は、Regluar Web Application を選択。理由としは、フロントエンドに Nextjs を採用しているため

- フロントエンドに React のみを使用したい場合は、Single Web Page Application を選択すること
  ![](https://storage.googleapis.com/zenn-user-upload/c466e431b7b0-20240506.png)

#### 詳細設定

Application の setting から以下の項目を追加。こちらの url は、フロントエンドで使用する url であるため各自で適時変更をしてほしい。今回は nextjs (app router)のデフォルトの設定で動くようにしているため、初めてこのプロジェクトを作成する際は、このままで良い。
![](https://storage.googleapis.com/zenn-user-upload/827db002949c-20240506.png)

Allow callback url => http://localhost:3000/api/auth/callback
Allowed logtout url => http://localhost:3000

注意する内容としては、開発用の設定（ローカル環境）のため本番環境の時は、適時 url を変更すること

## NextJS を設定

#### プロジェクトの作成

```
npx create-next-app {プロジェクト名} --ts
```

- このコマンドを打つといくつかの選択肢が出てきるが必ず app router を選択すること（page router は選択しないこと）

#### env ファイルの記載

```
AUTH0_SECRET=KEY-VALUE
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://AUTH0-DOMAIN
AUTH0_CLIENT_ID=AUTH0-CLIENT-ID
AUTH0_CLIENT_SECRET=AUTH0-CLIENT-SECRET
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### api の記載

##### auth0 にログイン、サインインするときの api

app/api/auth/[auth0]/route.ts を作成

```
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/profile",
    authorizationParams: {
      audience: "http://localhost:3001",
      // scope: "openid profile email", // 例として scope を追加
    },
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
    },
    returnTo: "/profile",
  }),
});
```

##### backend に叩く際の proxy サーバの実装(api route で実装）

流れとしては、client から送られてきたものを backend に渡せるように request を変換する。今回は cookie から accessToken を取り出して、authorization という header に accessToken を設定して request している。もちろん逆も然りで帰ってきた response は、nextjs の型ではないので NextResponse 型として返すことにしている。app router では next-http-proxy-middleware と対応していなかったため api route に独自の proxy を作成しました。こちらを参考にさせていただきました。
https://zenn.dev/mh4gf/articles/urql-client-working-with-credential-in-nextjs#fn-c960-2
app/api/auth/[auth0]/route.ts

```
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
```

#### ログイン、ログアウトボタンの実装

##### サインインボタンの実装

```
export const SignupButton = () => {
  return (
    <a className="button__sign-up" href="/api/auth/signup">
      Sign Up
    </a>
  );
};
```

##### ログインボタンの実装

```
export const LoginButton = () => {
  return (
    <a className="button__login" href="/api/auth/login">
      Log In
    </a>
  );
};
```

##### ログアウトボタンの実装

```
export const LogoutButton = () => {
  return (
    <a className="button__logout" href="/api/auth/logout">
      Log Out
    </a>
  );
};
```

#### middlreware の設定

middlreware.ts

```
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ["/profile", "/protect"],
};

```

#### UrqlApolloClient を作成

urqlClient の作成
内容は省略しました。多分ほぼこの設定が better なのかなと思います。

```
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
```

## auth0 の設定(API)

###### api を選択

![](https://storage.googleapis.com/zenn-user-upload/6094189c0831-20240523.png)

##### create を選択

![](https://storage.googleapis.com/zenn-user-upload/55b441997e0b-20240523.png)
// 各自説明にしたがって好きな値を入れてください
![](https://storage.googleapis.com/zenn-user-upload/90abe6087fa6-20240523.png)

## Nest の設定

### .env ファイルの設定

AUTH0_AUDIENCE は、AUTH0(API）で設定した Indetifer を設定する
AUTH0_ISSUER_URL

```
AUTH0_ISSUER_URL=***
AUTH0_AUDIENCE=***
```

### jwt-auth-gurad の作成

canActivate は NestJS フレームワークにおいて、特定のルートへのアクセスが許可されているかどうかを判断するためのメソッドを提供する CanActivate インターフェイスの一部です.これによりフロントサイドで送られてきた accessToken を取得します。流れはコメントで書いています。

```
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  // 公開鍵が取得できるurlを指定 (jwtのkeyを渡さないと取得はできない。ユーザ一人に足して一つの公開鍵があるからkeyを渡す必要がある。)
  private client = jwksClient({
    jwksUri: `${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`,
  });
  // canActivateはリクエストが進行する前に特定の条件が満たされているかどうかをチェックするために使用されます。
  canActivate(context: ExecutionContext): Promise<boolean> {
    // contextはリクエストの内容が入っている。
    const ctx = context.getArgs()[2]; // GraphQL context
    const request = ctx.req; // Direct access to GraphQL request object
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');
    // bearという先頭の文字があるためそれを取り除く
    const token = authHeader.split(' ')[1];
    return this.validateToken(token).then((decoded) => {
      // Here you can use the user ID from decoded JWT
      const userId = decoded.sub;
      // You can attach the user ID to the request object if needed
      // requestにrequestのuserIdを追加する
      request.user = { userId };
      return true;
    });
  }

  // トークンの検証を行い、tokenの暗号化を解く
  private async validateToken(token: string): Promise<any> {
    // decodeメソッドを使用してトークンをデコード
    // complete: trueを指定すると、デコードされたトークンにヘッダー情報が含まれる
    // payloadはトークンのペイロード部分
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded) throw new UnauthorizedException('Invalid token');
    const kid = decoded.header.kid;
    // keyIdを渡して自分に対応する公開鍵を取得
    const key = await this.client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    try {
      // tokenが改竄されていないかの確認 jwtと公開鍵、受け取りての確認、発行元の確認をしている
      jwt.verify(token, signingKey, {
        algorithms: ['RS256'],
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `${process.env.AUTH0_ISSUER_URL}/`,
      });
      // payload部分開けを返す。
      return decoded.payload; // Return the decoded payload
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### getUser

accessToken(jwt)をデコードすると得られる uid を resolver で取り扱うためにデコレーターを使用しています。

```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.getArgs()[2]; // GraphQLの実行コンテキスト
    return ctx.req.user; // `AuthGuard`でセットされたuserオブジェクト
  },
);
```

### 2 つの関数の使い方

```
import { Query, Resolver } from '@nestjs/graphql';
import { TodosService } from './todos.service';
import { UseGuards } from '@nestjs/common';

import { Todo } from 'src/graphql/graphql.schema';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from 'src/auth/jwt-auth-guard';
import { GetUser } from 'src/auth/getuser';
@Resolver('Todo')
export class TodosResolvers {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  @UseGuards(AuthGuard) // JWT戦略を使用するよう指定
  async getTodos(@GetUser() user: any): Promise<Todo[]> {
    console.log('getTodos');
    console.log(user);
    // const userId = context.user.userId; // コンテキストからuserIdを取得
    // console.log('こちらリゾルバーです', userId);
    const test = await this.todosService.getTodos();
    return [test];
  }
}

```

# まとめ

個人的には、かなり自信のあるものが作れました。github にも公開しているので template として使ってもらえたら嬉しいですー
https://github.com/nagisa599/WebAuth0Template

# 参考文献

https://developer.auth0.com/resources/guides/web-app/nextjs/basic-authentication

# Nextjs-appRouter--Nest-Auth0-template
