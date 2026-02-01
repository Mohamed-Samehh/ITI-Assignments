import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersComponent {
  searchEmail = '';

  allUsers = [
    {
      id: 1,
      username: 'john_admin',
      email: 'john@example.com',
      phone: '+1234567890',
      birthdate: '1990-01-15',
      role: 'admin',
    },
    {
      id: 2,
      username: 'jane_user',
      email: 'jane@example.com',
      phone: '+1234567891',
      birthdate: '1992-05-20',
      role: 'user',
    },
    {
      id: 3,
      username: 'bob_moderator',
      email: 'bob@example.com',
      phone: '+1234567892',
      birthdate: '1988-08-10',
      role: 'moderator',
    },
    {
      id: 4,
      username: 'alice_user',
      email: 'alice@example.com',
      phone: '+1234567893',
      birthdate: '1995-03-25',
      role: 'user',
    },
  ];

  users = [...this.allUsers];

  onSearch() {
    if (!this.searchEmail) {
      this.users = [...this.allUsers];
    } else {
      this.users = this.allUsers.filter((user) =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase()),
      );
    }
  }

  getRoleColor(role: string) {
    if (role === 'admin') return '#ef4444';
    if (role === 'user') return '#22c55e';
    if (role === 'moderator') return '#fbbf24';
    return '#6b7280';
  }
}
