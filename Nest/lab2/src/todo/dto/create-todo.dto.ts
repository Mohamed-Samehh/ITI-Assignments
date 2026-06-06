import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

// Shape + validation rules for POST /todo
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  // optional; if provided it must be one of the TodoStatus values
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
