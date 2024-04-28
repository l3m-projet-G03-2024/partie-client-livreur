import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'sign-in', title: "Connexion", component: SignInComponent },
    { path: 'home', title: "Livreur", component: HomeComponent },
];
