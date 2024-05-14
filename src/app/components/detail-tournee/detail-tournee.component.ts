import { Component, OnInit, computed, signal } from '@angular/core';
import { CartoComponent } from '../carto/carto.component';
import {MatTabsModule} from '@angular/material/tabs';
import { Tournee } from '../../utils/types/tournee.type';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TourneeService } from '../../services/tournee.service';
import { HttpClientModule } from '@angular/common/http';
import { Commande } from '../../utils/types/commande.type';
import { Coordinates, LeafetCoordinatesFormat } from '../../utils/types/coordinates.type';
import { LocalStorageService } from '../../services/local-storage.service';
import { PreviousStep } from '../../utils/types/previous-step.type';
import { EtatDetails } from '../../utils/shared/etat-details.shared';
import { EtatDetails as EtatDetailsType } from '../../utils/types/etat-details.type';
import { EtatDeLivraison } from '../../utils/enums/etat-de-livraison.enum';
import { JourneeService } from '../../services/journee.service';
import { EtatDeTournee } from '../../utils/enums/etat-de-tournee.enum';
import { EtatDeJournee } from '../../utils/enums/etat-de-journee.enum';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detail-tournee',
  standalone: true,
  imports: [
    CartoComponent, MatTabsModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    HttpClientModule
  ],
  providers: [
    TourneeService,
    LocalStorageService,
    JourneeService
  ],
  templateUrl: './detail-tournee.component.html',
  styleUrl: './detail-tournee.component.scss'
})
export class DetailTourneeComponent implements OnInit {
  readonly sigTournee = signal<Partial<Tournee>>({});
  readonly sigCoordinates = signal<Coordinates>({list: []});
  readonly sigTourneeEtat= signal<EtatDetailsType>({});
  readonly sigIsEnded = computed<boolean>(() => {
    let isEnded = false;
    if (this.sigTournee().livraisons != undefined) {
      isEnded = this.sigTournee().livraisons!.at(-1)!.etat == EtatDeLivraison.EFFECTUEE 
              ? true
              : false;
    }
    return false;
  });

  private readonly reload$ = new Subject();
  private readonly _reload = this.reload$.subscribe(_ =>
    this.loadTourneeDetails(this.sigTournee().reference!).then()
  )

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tourneeService: TourneeService,
    private readonly localStorageService: LocalStorageService,
    private readonly journeeService: JourneeService
  ) {}

  ngOnInit(): void {
    const paramReferenceTournee = this.route.snapshot.paramMap.get('referenceTournee');

    if (!paramReferenceTournee) {
      this.router.navigate(['/','home' , 'tournees']);
    }
    
    this.loadTourneeDetails(paramReferenceTournee!).then(_ => {
      if (!paramReferenceTournee || !this.sigTournee().reference) {
        this.router.navigate(['/','home' , 'tournees']);
      }
      this.loadCoordinates();
    });
    
  }

  async loadTourneeDetails(referenceTournee: string): Promise<void> {
    const tournee = await this.tourneeService.getTournee(referenceTournee);
    tournee.livraisons = tournee.livraisons.map(livraison => {
      return {
        ...livraison,
        commandes: this.sortCommandes(livraison.commandes as Commande[])
      }
    }).sort((a, b) => a.ordre - b.ordre);

    this.sigTournee.set({...tournee});

    const etatDetails = EtatDetails.find(x => x.etat == tournee.etat.toString());
    this.sigTourneeEtat.set({
      label: etatDetails!.label,
      color: etatDetails!.color
    });
  }

  sortCommandes(commandes: Commande[]): Commande[] {
    return commandes.sort((a, b) => 
      new Date(a.dateDeCreation).getTime() - new Date(b.dateDeCreation).getTime()
    );
  }

  loadCoordinates(): void {
    const {latitude, longitude} = this.sigTournee().journee!.entrepot!;

    const coords = this.sigTournee().livraisons!.map(livraison => [
      livraison.commandes![0].client!.latitude!,
      livraison.commandes![0].client!.longitude!
    ] as LeafetCoordinatesFormat);

    this.sigCoordinates.set({
      entrepot: [latitude, longitude],
      list: coords
    });
  }

  navigateTo(livraisonReference: string): void {
    this.definePreviousStep(livraisonReference);
    this.localStoreTournee();
    this.router.navigate(['../../../livraison', livraisonReference], {relativeTo: this.route});
  }

  definePreviousStep(livraisonReference: string) {
    const livraisonIndex = this.sigTournee().livraisons?.findIndex(livraison => livraison.reference == livraisonReference);
    let previousStep: Partial<PreviousStep> = {};
    if (livraisonIndex == 0) {
      previousStep = {
        latitude: this.sigTournee().journee?.entrepot.latitude!,
        longitude: this.sigTournee().journee?.entrepot.longitude!,
        isEntrepot:true,
        adresse: this.sigTournee().journee?.entrepot.adresse,
        codePostal: this.sigTournee().journee?.entrepot.codePostal,
        ville: this.sigTournee().journee?.entrepot.ville
      } 
    } else {
      const previousLivraison = this.sigTournee().livraisons![livraisonIndex!-1];
      previousStep = {
        latitude: previousLivraison!.commandes![0].client!.latitude!,
        longitude: previousLivraison!.commandes![0].client!.longitude!,
        isEntrepot: false,
        adresse: previousLivraison!.commandes![0].client?.adresse,
        codePostal: previousLivraison!.commandes![0].client?.codePostal,
        ville: previousLivraison!.commandes![0].client?.ville,
        etat: previousLivraison!.etat
      }
    }

    this.localStorageService.setItem("previous-step", JSON.stringify(previousStep));
  }

  localStoreTournee() {
    this.localStorageService.setItem("tournee", JSON.stringify({
      reference: this.sigTournee().reference,
      etat: this.sigTournee().etat,
      livraisons: this.sigTournee().livraisons
    }));
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

  async updateTourneeEtat(etat: string) {
    await this.tourneeService.updateTourneeEtat(this.sigTournee().reference!, etat as EtatDeTournee);

    if (etat == EtatDeTournee.ENCHARGEMENT) {
      await this.journeeService.updateJourneeEtat(this.sigTournee().journee?.reference!, EtatDeJournee.ENCOURS)
    }
    this.reload$.next(1);
  }
}
