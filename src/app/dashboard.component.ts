import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="dashboard-container">
      <p class="heading">Dashboard</p>
      <p class="details">Name: <span>{{ name }}</span></p>
      <p class="details">Phone: <span>{{ number }}</span></p>
      <p class="details">Email: <span>{{ email }}</span></p>
      <button (click)="signout()" type="button">Sign out</button>
    </div>
  `
})
export class DashboardComponent {
  auth = inject(Auth);

  name = localStorage.getItem('name') ?? '';
  number = localStorage.getItem('number') ?? '';
  email = localStorage.getItem('email') ?? '';

  async signout() {
    await this.auth.signOut();
    localStorage.clear();
    location.href = '/register';
  }
}