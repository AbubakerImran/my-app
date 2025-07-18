import { Component, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container" *ngIf="!user(); else dashboard">
      <p class="heading">Employee Registration Form</p><br>
      <div class="form-container">
        <label>Name</label><br>
        <input [(ngModel)]="name" type="text" placeholder="Enter your name" autocapitalize="words"/><br>

        <label>Phone Number</label><br>
        <input [(ngModel)]="number" type="tel" placeholder="Enter your phone number"/><br>

        <label>Email</label><br>
        <input [(ngModel)]="email" type="email" placeholder="Enter your email"/><br>

        <label>Password</label><br>
        <input [(ngModel)]="password" type="password" placeholder="Enter your password"/><br>

        <button (click)="register()" type="button">
          <ng-container *ngIf="loading(); else notLoading">
            <div class="spinner-border" role="status" style="margin-left: 19px; margin-right: 19px; width: 25px; height: 25px"></div>
          </ng-container>
          <ng-template #notLoading>Submit</ng-template>
        </button>
      </div>
    </div>

    <ng-template #dashboard>
      <div class="dashboard-container">
        <p class="heading">Dashboard</p>
        <p class="details">Name: <span>{{ name() }}</span></p>
        <p class="details">Phone: <span>{{ number() }}</span></p>
        <p class="details">Email: <span>{{ email() }}</span></p>
        <button (click)="signout()" type="button">Sign out</button>
      </div>
    </ng-template>
  `,
  styleUrl: './app.css'
})
export class App {

  user = signal<User | null>(null);
  loading = signal(false);

  constructor(private firestore: Firestore, private auth: Auth) {
    onAuthStateChanged(this.auth, async (user) => {
      this.user.set(user);

      if (user?.email) {
        try {
          const userRef = doc(this.firestore, 'employees', user.email);
          const userDoc = await getDoc(userRef);

          const data = userDoc.data();
          if (data) {
            this.name.set(data['name']);
            this.number.set(data['number']);
            this.email.set(data['email']);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    });
  }
  
  name = signal('');
  number = signal('');
  email = signal('');
  password = '';

  async register() {
    if (!this.name || !this.number || !this.email() || !this.password) {
      alert('Please enter all details!');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (this.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    const data = {
      name: this.name(),
      number: this.number(),
      email: this.email(),
    };

    try {
      this.loading.set(true);
      await createUserWithEmailAndPassword(this.auth, this.email(), this.password);
      await setDoc(doc(this.firestore, 'employees', this.email()), data);
      this.loading.set(false);
      alert('Registered successfully!');
    } catch (err) {
      this.loading.set(false);
      if (this.auth.currentUser) {
        await deleteUser(this.auth.currentUser);
      }
      alert((err as Error).message);
    }
  }

  async signout() {
    await signOut(this.auth);
    this.user.set(null);
  }
}
