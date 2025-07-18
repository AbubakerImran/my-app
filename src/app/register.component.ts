import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  number = '';
  email = '';
  password = '';
  loading = signal(false);

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {}

  async register() {
    if (!this.name || !this.number || !this.email || !this.password) {
      alert('Please enter all details!');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (this.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

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
