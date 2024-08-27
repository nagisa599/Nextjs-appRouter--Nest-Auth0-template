// graphqlで使うとエラが出る
//Passportは最も人気のあるnode.jsの認証ライブラリ;
// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { passportJwtSecret } from 'jwks-rsa';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import * as dotenv from 'dotenv';

// dotenv.config();

// @Injectable()
// export class GqlJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     console.log('Initializing GqlJwtStrategy');
//     console.log(process.env.AUTH0_ISSUER_URL);
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKeyProvider: passportJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`,
//       }),
//       audience: process.env.AUTH0_AUDIENCE,
//       issuer: process.env.AUTH0_ISSUER_URL,
//       algorithms: ['RS256'],
//     });
//     console.log('GqlJwtStrategy initialized');
//   }

//   validate(payload: any): any {
//     return payload;
//   }

//   getRequest(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     const { req } = ctx.getContext();
//     if (!req) {
//       console.error('Request object is undefined in GraphQL context');
//       return null; // Or handle this scenario as appropriate for your application
//     }
//     console.log(req); // Debug log to see what the request object contains
//     return req;
//   }
// }
