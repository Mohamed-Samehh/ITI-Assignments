import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

// Shape + validation rules for PATCH /todo/:id
// Both fields are optional, but any field that IS sent must be valid.
export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  task?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
