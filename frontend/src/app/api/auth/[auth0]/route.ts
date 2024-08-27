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
