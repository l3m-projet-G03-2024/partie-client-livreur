import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Tournee } from '../utils/types/tournee.type';
import { EtatDeTournee } from '../utils/enums/etat-de-tournee.enum';

@Injectable({
  providedIn: 'root'
})
export class TourneeService {

  private readonly MAIN_SERVER_BASE_PATH = `${environment.mainServer}/api/v1`;

  constructor(private httpClient: HttpClient) { }

  listTournees(emailEmploye?: string): Promise<Tournee[]> {
    return firstValueFrom(this.httpClient.get<Tournee[]>(
        `${this.MAIN_SERVER_BASE_PATH}/tournees/employes/${emailEmploye}/`,
        {
          headers: { Accept: 'application/json' }
        }
      )
    ); 
  }

  
  getTournee(referenceTournee: string): Promise<Tournee> {
    return firstValueFrom(this.httpClient.get<Tournee>(
      `${this.MAIN_SERVER_BASE_PATH}/tournees/${referenceTournee}`,
      {
        headers: { Accept: 'application/json' }
      }
    )
  ); 
  }

  updateTourneeEtat(referenceTournee: string, etat: EtatDeTournee) {
    return firstValueFrom(this.httpClient.patch<Tournee>(
      `${this.MAIN_SERVER_BASE_PATH}/tournees/${referenceTournee}`,
      {
        etat
      },
      {
        headers: { Accept: 'application/json' }
      }
    )
  )
  }
}
