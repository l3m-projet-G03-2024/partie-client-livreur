import { EtatDeCommande } from "../enums/etat-de-commande.enum";
import { EtatDeLivraison } from "../enums/etat-de-livraison.enum";
import { EtatDeTournee } from "../enums/etat-de-tournee.enum";
import { Tournee } from "../types/tournee.type";

export const tournees: Tournee[] = [
    {
        reference: "t119G-A",
        etat: EtatDeTournee.PLANIFIEE,
        distance: 3000,
        livraisons: [
            {
                reference: "l119G-A1",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 1,
                commandes: [
                    {
                        reference: "c114",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21678,
                            longitude: 5.688157
                        }
                    },
                    {
                        reference: "c115",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21678,
                            longitude: 5.688157
                        }
                    }
                ]
            },
            {
                reference: "l119G-A2",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 2,
                commandes: [
                    {
                        reference: "c009",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.148263,
                            longitude: 5.750864
                        }
                    }
                ]
            }
        ]
    },
    {
        reference: "t120G-B",
        etat: EtatDeTournee.PLANIFIEE,
        distance: 3000,
        livraisons: [
            {
                reference: "l120G-B1",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 1,
                commandes: [
                    {
                        reference: "c346",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21449,
                            longitude: 5.648892
                        }
                    }
                ]
            },
            {
                reference: "l120G-B2",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 2,
                commandes: [
                    {
                        reference: "c164",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.184334,
                            longitude: 5.695172
                        }
                    },
                ]
            }
        ]
    },
    {
        reference: "t121G-B",
        etat: EtatDeTournee.PLANIFIEE,
        distance: 3000,
        livraisons: [
            {
                reference: "l121G-B1",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 1,
                commandes: [
                    {
                        reference: "c346",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21449,
                            longitude: 5.648892
                        }
                    }
                ]
            },
            {
                reference: "l121G-B2",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 2,
                commandes: [
                    {
                        reference: "c164",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.184334,
                            longitude: 5.695172
                        }
                    },
                ]
            }
        ]
    },
    {
        reference: "t122G-A",
        etat: EtatDeTournee.PLANIFIEE,
        distance: 3000,
        livraisons: [
            {
                reference: "l122G-A1",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 1,
                commandes: [
                    {
                        reference: "c346",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21449,
                            longitude: 5.648892
                        }
                    }
                ]
            },
            {
                reference: "l122G-A2",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 2,
                commandes: [
                    {
                        reference: "c164",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.184334,
                            longitude: 5.695172
                        }
                    },
                ]
            }
        ]
    },
    {
        reference: "t123G-C",
        etat: EtatDeTournee.PLANIFIEE,
        distance: 3000,
        livraisons: [
            {
                reference: "l123G-C1",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 1,
                commandes: [
                    {
                        reference: "c346",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.21449,
                            longitude: 5.648892
                        }
                    }
                ]
            },
            {
                reference: "l123G-C2",
                etat: EtatDeLivraison.PLANIFIEE,
                ordre: 2,
                commandes: [
                    {
                        reference: "c164",
                        etat: EtatDeCommande.PLANIFIEE,
                        client: {
                            latitude: 45.184334,
                            longitude: 5.695172
                        }
                    },
                ]
            }
        ]
    }
]