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
