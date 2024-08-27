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
