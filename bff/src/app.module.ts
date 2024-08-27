import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';
import { TodosModule } from './todos/todos.module';
// import { AuthzModule } from './auth/auth.module';
import * as passport from 'passport';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // スキーマのパス
      typePaths: ['./**/*.graphql'],
      playground: true,
      // schemaから型を自動で作ってくれる
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.schema.ts'),
        outputAs: 'class',
      },
      context: ({ req }) => ({ user: req.user }), // コンテキストにユーザー情報を含める
      // context: ({ req, res }) => ({ req, res }), // req
    }),
    TodosModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(passport.initialize()).forRoutes('*'); // Apply for all routes or specify routes
  }
}
