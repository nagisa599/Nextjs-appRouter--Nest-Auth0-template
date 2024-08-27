import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
// sessionからロウインしているかの確認をすることができる
export default withMiddlewareAuthRequired();
// matherはどのページに適用するかを指定することができる。この場合は、/profileと/protectのページに適用される。
// nextjsのmiddlrewareの基本的な使い方。
export const config = {
  matcher: ["/profile", "/protect"],
};
