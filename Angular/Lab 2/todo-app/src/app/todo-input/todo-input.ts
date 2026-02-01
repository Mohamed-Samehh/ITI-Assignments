import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-input.html',
  styleUrls: ['./todo-input.css'],
})
export class TodoInput {
  task = '';

  @Output() addTodo = new EventEmitter<string>();

  add() {
    if (this.task.trim()) {
      this.addTodo.emit(this.task);
      this.task = '';
    }
  }
}
