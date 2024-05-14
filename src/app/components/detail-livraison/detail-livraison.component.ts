import { Component, OnInit, computed, signal } from '@angular/core';
import { Livraison } from '../../utils/types/livraison.type';
import { LivraisonService } from '../../services/livraison.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Coordinates } from '../../utils/types/coordinates.type';
import { LocalStorageService } from '../../services/local-storage.service';
import { CartoComponent } from '../carto/carto.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { PreviousStep } from '../../utils/types/previous-step.type';
import { Client } from '../../utils/types/client.type';
import { Tournee } from '../../utils/types/tournee.type';
import { EtatDetails as EtatDetailsType } from '../../utils/types/etat-details.type';
import { EtatDetails } from '../../utils/shared/etat-details.shared';
import { EtatDeLivraison } from '../../utils/enums/etat-de-livraison.enum';
import { Subject } from 'rxjs';
import { TourneeService } from '../../services/tournee.service';
import { EtatDeTournee } from '../../utils/enums/etat-de-tournee.enum';
import { EtatDeCommande } from '../../utils/enums/etat-de-commande.enum';
import { Commande } from '../../utils/types/commande.type';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-detail-livraison',
  standalone: true,
  imports: [
    CartoComponent, MatTabsModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    HttpClientModule
  ],
  providers: [
    LivraisonService,
    LocalStorageService,
    TourneeService,
    CommandeService
  ],
  templateUrl: './detail-livraison.component.html',
  styleUrl: './detail-livraison.component.scss'
})
export class DetailLivraisonComponent implements OnInit {
  readonly sigLivraison = signal<Partial<Livraison>>({});
  readonly sigCoordinates = signal<Coordinates>({list: []});
  readonly sigClientAdresse = signal<Partial<Client>>({});
  readonly sigTournee = signal<Partial<Tournee>>({});
  
  readonly sigPreviousStep = computed(() => this.loadPreviousStep());
  readonly sigLivraisonEtat = computed(() => this.defineLivraisonEtat(this.sigLivraison().etat));
  readonly sigLivraisonNextEtat = computed(() => this.defineLivraisonNextEtat());

  private readonly reload$ = new Subject();
  private readonly _reload = this.reload$.subscribe(_ =>
    this.loadLivraison(this.sigLivraison().reference!).then()
  )

  constructor(
    private readonly livraisonService: LivraisonService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly tourneeService: TourneeService,
    private readonly commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const paramReferenceTournee = this.route.snapshot.paramMap.get('referenceLivraison');

    if (!paramReferenceTournee) {
      this.router.navigate(['../../'], {relativeTo: this.route});
    }
    
    this.loadLivraison(paramReferenceTournee!).then(_ => {
      if (!paramReferenceTournee || !this.sigLivraison().reference) {
        this.router.navigate(['../../'], {relativeTo: this.route});
      }
      this.sigClientAdresse.set(this.sigLivraison().commandes![0].client!);
      this.sigTournee.set(this.localStorageService.getTournee());
      this.loadCoordinates();
    });
  }

  async loadLivraison(referenceLivraison: string): Promise<void> {
    const livraison = await this.livraisonService.getLivraison(referenceLivraison);
    const commandes = await Promise.all(
      livraison.commandes!.map(commande => this.commandeService.getCommande(commande.reference!))
    );
    livraison.commandes = livraison.commandes?.map((commande, index) => ({...commande, lignes: commandes[index].lignes}));
    this.sigLivraison.set(livraison);
  }

  loadPreviousStep(): PreviousStep {
    return this.localStorageService.getPreviousStep()
  }

  loadCoordinates(): void {
    const {
      latitude: previousStepLat,
      longitude: previousStepLng,
      isEntrepot
    } = this.sigPreviousStep();

    const {latitude: livraisonLat, longitude: livraisonLng} = this.sigLivraison()!.commandes![0].client!;

    this.sigCoordinates.set({
      entrepot: isEntrepot ?  [previousStepLat!, previousStepLng!] : undefined,
      list: isEntrepot ? [[livraisonLat!, livraisonLng!]] : [
        [previousStepLat!, previousStepLng!],
        [livraisonLat!, livraisonLng!]
      ]
    });
  }

  defineLivraisonNextEtat(): EtatDeLivraison[] {
    const currentEtat = this.sigLivraison().etat;

    switch (currentEtat) {
      case EtatDeLivraison.ENPARCOURS:
        return [EtatDeLivraison.ENDECHARGEMMENT];
      case EtatDeLivraison.ENDECHARGEMMENT:
        return [EtatDeLivraison.ENCLIENTELE];
      case EtatDeLivraison.ENCLIENTELE:
        if (this.hasOptionMontageCommande(this.sigLivraison().commandes!)) {
          return [EtatDeLivraison.ENMONTAGE, EtatDeLivraison.EFFECTUEE]
        }
        return [EtatDeLivraison.EFFECTUEE];
      case EtatDeLivraison.ENMONTAGE:
          return [EtatDeLivraison.ENCLIENTELE];
      default:
        return [EtatDeLivraison.ENPARCOURS];
    }
  }

  defineLivraisonEtat(etat: EtatDeLivraison | undefined): Partial<EtatDetailsType> {
    if (etat) {
      const etatDetails = EtatDetails.find(x => x.etat == etat.toString());
      return {
        label: etatDetails!.label,
        color: etatDetails!.color
      }
    } else {
      return {}
    }
  }

  defineCommandeEtat(etat: EtatDeCommande | undefined): Partial<EtatDetailsType> {
    if (etat) {
      const etatDetails = EtatDetails.find(x => x.etat == etat.toString());
      return {
        label: etatDetails!.label,
        color: etatDetails!.color
      }
    } else {
      return {}
    }
  }

  async changeLivraisonEtat(etat: EtatDeLivraison) {
    await this.livraisonService.updateLivraison(this.sigLivraison().reference!, {
      etat
    });

    if (etat != EtatDeLivraison.EFFECTUEE) {
      this.tourneeService.updateTourneeEtat(this.sigTournee().reference!, etat as unknown as EtatDeTournee);
    }
    if (etat == EtatDeLivraison.EFFECTUEE) {
      const lastLivraison = this.sigTournee().livraisons!.pop()!;
      if (lastLivraison.reference == this.sigLivraison().reference) {
        this.tourneeService.updateTourneeEtat(this.sigTournee().reference!, EtatDeTournee.ENRETOUR);
      }
    }
    this.reload$.next(1);
  }

  async hasOptionMontageLivraison() {
    const commandes = this.sigLivraison().commandes;
  }


  hasOptionMontageCommande(commandes: Partial<Commande>[]) {
    const produits = commandes.flatMap(commande => commande.lignes!.map(ligne => ligne.produit));
    return produits.filter(produit => produit.aoptionMontage).length == 0 
            ? false : true;
  }

  canUpdateEtat() {
    if (this.sigPreviousStep().isEntrepot) {
      return true;
    } else {
      return this.sigPreviousStep().etat == EtatDeLivraison.EFFECTUEE ? true : false;
    }
  }

}
