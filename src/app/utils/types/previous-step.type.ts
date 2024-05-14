import { EtatDeLivraison } from "../enums/etat-de-livraison.enum";

export type PreviousStep = {
    latitude: number;
    longitude: number;
    isEntrepot: boolean;
    adresse?: string;
    codePostal?: string;
    ville: string;
    etat: EtatDeLivraison;
}