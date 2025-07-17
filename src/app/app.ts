import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <p class="heading">Employee Registeration Form</p><br>
      <div class="form-container">
        <label for="name">Name</label><br>
        <input type="text" placeholder="Enter your name"/><br>
        <label for="number">Phone Number</label><br>
        <input type="tel" placeholder="Enter your phone number"/><br>
        <label for="email">Email</label><br>
        <input type="email" placeholder="Enter your email"/><br>
        <label for="password">Password</label><br>
        <input type="password" placeholder="Enter your password"/><br>
        <button>Submit</button>
      </div>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {}
