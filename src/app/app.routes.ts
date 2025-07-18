import { Routes } from "@angular/router";
import { Register } from "./register";
import { Dashboard } from "./dashboard";
import { AuthGuard } from "./auth.guard";

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
];