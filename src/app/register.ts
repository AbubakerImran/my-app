import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loading = signal(false);

  constructor(private firestore: Firestore) {}

  name = '';
  number = '';
  email = '';
  password = '';

  async register() {
    if (!this.name || !this.number || !this.email || !this.password) {
      alert('Please enter all details!');
    } else {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        alert("Please enter a valid email address.");
      } else {
        if (this.password.length < 8) {
          alert('Password must be at least 8 characters long.');
        } else {
          const data = {
            name: this.name,
            number: this.number,
            email: this.email,
          };
          try {
            this.loading.set(true);
            await createUserWithEmailAndPassword(this.auth, this.email, this.password);
            await setDoc(doc(this.firestore, 'employees', this.email), data);
            this.loading.set(false);
            alert('Registered successfully!');
            this.router.navigate(['/dashboard']);
          } catch (err) {
            this.loading.set(false);
            if (this.auth.currentUser) {
              await deleteUser(this.auth.currentUser);
            }
            alert((err as Error).message);
          }
        }
      }
    }
  }
  
}
