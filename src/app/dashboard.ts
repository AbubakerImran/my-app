import { Component, inject, signal } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './register.css'
})
export class Dashboard {

  private auth = inject(Auth);
  private router = inject(Router);

  constructor(private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user?.email) {
        const userRef = doc(this.firestore, 'employees', user?.email);
        const userData = (await getDoc(userRef)).data();
        if (userData) {
          this.name.set(userData['name']);
          this.number.set(userData['number']);
          this.email.set(userData['email']);
        }
      }
    })
  }

  name = signal('');
  number = signal('');
  email = signal('');

  async signout() {
    await signOut(this.auth);
    this.router.navigate(['/dashboard']);
  }
  
}
