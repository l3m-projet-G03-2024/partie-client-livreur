import { EtatDeCommande } from "../enums/etat-de-commande.enum"
import { Client } from "./client.type";

type Produit = {
    reference: string;
    aoptionMontage: boolean;
}

type Ligne = {
    quantite: string,
    produit: Produit
}

export type Commande = {
    reference: string,
    etat: EtatDeCommande,
    dateDeCreation: string,
    client: Partial<Client>
    lignes: Ligne[]
}