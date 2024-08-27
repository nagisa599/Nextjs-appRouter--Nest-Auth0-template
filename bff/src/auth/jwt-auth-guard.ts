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
  private client = jwksClient({
    jwksUri: `${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`,
  });

  canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgs()[2]; // GraphQL context
    const request = ctx.req; // Direct access to GraphQL request object
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    // テストトークンのチェック(本番環境消す)
    if (token === 'test') {
      // テストトークンの場合、いくつかのハードコードされたユーザー情報を設定する
      request.user = { userId: 'test-user' };
      return Promise.resolve(true);
    }

    return this.validateToken(token)
      .then((decoded) => {
        const userId = decoded.sub;
        request.user = { userId };
        return true;
      })
      .catch(() => {
        // トークンの検証でエラーが発生した場合
        throw new UnauthorizedException('Invalid token');
      });
  }

  private async validateToken(token: string): Promise<any> {
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded) throw new UnauthorizedException('Invalid token');
    const kid = decoded.header.kid;
    const key = await this.client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    try {
      jwt.verify(token, signingKey, {
        algorithms: ['RS256'],
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `${process.env.AUTH0_ISSUER_URL}/`,
      });
      return decoded.payload; // Return the decoded payload
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
