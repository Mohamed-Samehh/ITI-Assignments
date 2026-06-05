import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TodoService, TodoStatus } from './todo.service';

@Controller('todo') // every route below starts with /todo
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // GET /todo
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // GET /todo/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(Number(id));
  }

  // POST /todo   body: { "task": "...", "status"?: "todo" }
  @Post()
  create(@Body() body: { task: string; status?: TodoStatus }) {
    return this.todoService.create(body.task, body.status);
  }

  // PATCH /todo/:id   body: { "task"?: "...", "status"?: "in-progress" }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { task?: string; status?: TodoStatus },
  ) {
    return this.todoService.update(Number(id), body);
  }

  // DELETE /todo/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(Number(id));
  }
}
