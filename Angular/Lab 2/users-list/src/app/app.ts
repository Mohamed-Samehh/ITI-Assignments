import { Component, signal } from '@angular/core';
import { UsersComponent } from './users/users';

@Component({
  selector: 'app-root',
  imports: [UsersComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('users-list');
}
