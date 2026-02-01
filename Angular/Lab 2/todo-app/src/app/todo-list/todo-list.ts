import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css'],
})
export class TodoList {
  @Input() todos: { text: string; completed: boolean }[] = [];
  @Output() deleteTodo = new EventEmitter<number>();

  delete(index: number) {
    this.deleteTodo.emit(index);
  }
}
