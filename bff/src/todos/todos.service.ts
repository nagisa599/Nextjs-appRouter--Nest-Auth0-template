import { Injectable } from '@nestjs/common';
import { Todo } from 'src/graphql/graphql.schema';

@Injectable()
export class TodosService {
  async getTodos(): Promise<Todo> {
    return { id: 1, title: 'tesdt', is_completed: true };
  }
}
