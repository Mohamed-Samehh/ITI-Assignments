import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    // inject the TypeORM repository for the Todo entity
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  // GET /todo  -> return all todos
  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  // GET /todo/:id  -> return one todo (or 404)
  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  // POST /todo  -> create a new todo
  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
  }

  // PATCH /todo/:id  -> update an existing todo
  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    // preload merges the changes onto the existing row (and returns
    // undefined if the id doesn't exist)
    const todo = await this.todoRepository.preload({ id, ...updateTodoDto });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return this.todoRepository.save(todo);
  }

  // DELETE /todo/:id  -> remove a todo
  async remove(id: number): Promise<Todo> {
    const todo = await this.findOne(id); // reuse the 404 check
    return this.todoRepository.remove(todo);
  }
}

// preload vs update
// save vs create
