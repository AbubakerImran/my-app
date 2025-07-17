import { Component, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, signOut } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <p class="heading">Employee Registeration Form</p><br>
      <div class="form-container">
        <label for="name">Name</label><br>
        <input [(ngModel)]="name" type="text" placeholder="Enter your name" autocapitalize="words"/><br>
        <label for="number">Phone Number</label><br>
        <input [(ngModel)]="number" type="tel" placeholder="Enter your phone number"/><br>
        <label for="email">Email</label><br>
        <input [(ngModel)]="email" type="email" placeholder="Enter your email"/><br>
        <label for="password">Password</label><br>
        <input [(ngModel)]="password" type="password" placeholder="Enter your password"/><br>
        <button (click)="register()" type="button">@if (loading()) {<div class="spinner-border" role="status" style="margin-left: 19px; margin-right: 19px; width: 25px; height: 25px"></div>} @else {Submit}</button>
      </div>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {

  loading = signal(false);

  name = '';
  number =  '';
  email = '';
  password = '';

  constructor(private firestore: Firestore, private auth: Auth) {}
  
  async register() {
    const data = {
      name: this.name,
      number: this.number,
      email: this.email,
    };
    if (!this.name || !this.number || !this.email || !this.password) {
      alert('Please enter all details!');
    } else {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
      if ( !emailPattern.test(this.email) ) {
        alert("Please enter valid email address.");
      } else {
        if ( this.password.length < 8 ) {
          alert('Password must be 8 character long.');
        } else {
          try {
          this.loading.set(true);
          await createUserWithEmailAndPassword(this.auth, this.email, this.password);
          await setDoc(doc(this.firestore, 'employees', this.email), data);
          await signOut(this.auth);
          this.loading.set(false);
          alert('Registered successfully!');
          } catch (err) {
            this.loading.set(false);
            if (this.auth.currentUser) {
              await deleteUser(this.auth.currentUser);
            }
            alert(err);
          }
        }
      }
    } 
  }
}