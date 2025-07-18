import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RegisterComponent } from './register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
];