import { EtatDeTournee } from "../enums/etat-de-tournee.enum";
import { Camion } from "./camion.type";
import { Journee } from "./journee.type";
import { Livraison } from "./livraison.type";

export type Tournee = {
    reference: string;
    etat: EtatDeTournee;
    date?: Date;
    distance: number;
    livraisons: Livraison[];
    journee?: Journee,
    camion?: Camion
}