import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { TourneesComponent } from './components/tournees/tournees.component';
import { DetailTourneeComponent } from './components/detail-tournee/detail-tournee.component';
import { DetailLivraisonComponent } from './components/detail-livraison/detail-livraison.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'sign-in', title: "Connexion", component: SignInComponent },
    { 
        path: 'home',
        title: "Livreur", 
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'tournees', pathMatch: 'full' },
            { path: 'tournees', title: "Tournées", component: TourneesComponent},
            { path: 'tournees/details/:referenceTournee', title: "Detail tournee", component: DetailTourneeComponent },
            { path: 'livraison/:referenceLivraison', title: "Detail livraison", component: DetailLivraisonComponent}
        ] 
    },
    
];
