import { Component, OnInit, signal } from '@angular/core';
import { Tournee } from '../../utils/types/tournee.type';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TourneeService } from '../../services/tournee.service';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-tournees',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    HttpClientModule
  ],
  providers: [
    TourneeService, LocalStorageService
  ],
  templateUrl: './tournees.component.html',
  styleUrl: './tournees.component.scss'
})
export class TourneesComponent implements OnInit {

  constructor(
    private router: Router,
    private readonly tourneeService: TourneeService,
    private readonly localStorageService: LocalStorageService
  ) {}

  readonly sigTournees = signal<Tournee[]>([]);
  readonly sigTourneeNotAvailable = signal<boolean>(false);

  ngOnInit(): void {
      this.loadTournees().then();
  }

  getDate(reference: string): Date {
    const date = new Date(`${(new Date()).getFullYear()}-01-01`);
    const dayNo = +reference.slice(1, 4);
    
    date.setDate(date.getDate() + dayNo);
    return date;
  }

  async loadTournees() {
    // TODO: lister par email du livreur
    const userEmail = this.localStorageService.getItem("user");
    const tournees = (await this.tourneeService.
      listTournees(userEmail!))
        .map(tournee => ({...tournee, date: new Date(tournee.journee?.date!)}));

    const tourneeToDay = tournees.find(tournee => {
      const date = new Date();
      
      return tournee.date.getFullYear() == date.getFullYear() &&
             tournee.date.getMonth() == date.getMonth() &&
             tournee.date.getDate() == date.getDate()
    });

    if (tourneeToDay) {
      this.router.navigate(['/', 'home', 'tournees', 'details', tourneeToDay.reference]);
    } else {
      this.sigTourneeNotAvailable.set(true);
    }
  }

}
