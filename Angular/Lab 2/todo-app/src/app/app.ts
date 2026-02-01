import { Component } from '@angular/core';
import { TodoInput } from './todo-input/todo-input';
import { TodoList } from './todo-list/todo-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoInput, TodoList],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  todos: { text: string; completed: boolean }[] = [];

  addTodo(todo: string) {
    this.todos.push({ text: todo, completed: false });
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
