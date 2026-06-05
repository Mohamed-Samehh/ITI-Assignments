import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
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
