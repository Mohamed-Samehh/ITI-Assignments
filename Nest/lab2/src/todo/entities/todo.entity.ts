import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// status is restricted to these three values
export enum TodoStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done',
}

@Entity('todos') // maps to the "todos" table in Postgres
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.Todo,
  })
  status: TodoStatus;
}
