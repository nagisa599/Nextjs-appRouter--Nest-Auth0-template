import { Module } from '@nestjs/common';
import { TodosResolvers } from './todos.resolver';
import { TodosService } from './todos.service';
// import { AuthzModule } from 'src/auth/auth.module';

@Module({
  imports: [],
  providers: [TodosResolvers, TodosService],
})
export class TodosModule {}
