import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Journee } from '../utils/types/journee.type';
import { EtatDeJournee } from '../utils/enums/etat-de-journee.enum';

@Injectable({
  providedIn: 'root'
})
export class JourneeService {

  private readonly MAIN_SERVER_BASE_PATH = `${environment.mainServer}/api/v1`;

  constructor(private httpClient: HttpClient) { }
  
  getJournee(referenceJournee: string): Promise<Journee> {
    return firstValueFrom(this.httpClient.get<Journee>(
      `${this.MAIN_SERVER_BASE_PATH}/journees/${referenceJournee}`,
      {
        headers: { Accept: 'application/json' }
      }
    )
  ); 
  }

  updateJourneeEtat(referenceJournee: string, etat: EtatDeJournee): Promise<Journee> {
    return firstValueFrom(this.httpClient.patch<Journee>(
      `${this.MAIN_SERVER_BASE_PATH}/journees/${referenceJournee}`,
      {
        etat
      },
      {
        headers: { Accept: 'application/json' }
      }
    )
  ); 
  }
}
