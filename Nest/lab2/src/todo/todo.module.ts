import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  // register the Todo repository for this module
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // log only the CreateTodo POST /todo request
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'todo', method: RequestMethod.POST });
  }
}
