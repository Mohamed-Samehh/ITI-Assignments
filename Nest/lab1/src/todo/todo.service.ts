import { Injectable, NotFoundException } from '@nestjs/common';

// status is restricted to these three values
export enum TodoStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done',
}

@Injectable()
export class TodoService {
  // Our "database": a simple array kept in memory.
  private todos = [{ id: 1, task: 'Learn NestJS', status: TodoStatus.Todo }];
  private nextId = 2; // id for the next created todo

  // GET /todo  -> return all todos
  findAll() {
    return this.todos;
  }

  // GET /todo/:id  -> return one todo (or 404)
  findOne(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  // POST /todo  -> create a new todo
  create(task: string, status: TodoStatus = TodoStatus.Todo) {
    const todo = { id: this.nextId++, task, status };
    this.todos.push(todo);
    return todo;
  }

  // PATCH /todo/:id  -> update an existing todo
  update(id: number, data: { task?: string; status?: TodoStatus }) {
    const todo = this.findOne(id); // reuse the 404 check
    Object.assign(todo, data); // copy only the given fields
    return todo;
  }

  // DELETE /todo/:id  -> remove a todo
  remove(id: number) {
    const todo = this.findOne(id); // reuse the 404 check
    this.todos = this.todos.filter((t) => t.id !== id);
    return todo;
  }
}
