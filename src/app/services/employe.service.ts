import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom, map } from 'rxjs';
import { Tournee } from '../utils/types/tournee.type';
import { Employe } from '../utils/types/employe.type';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private readonly MAIN_SERVER_BASE_PATH = `${environment.mainServer}/api/v1`;

  constructor(private httpClient: HttpClient) { }


  getEmploye(emailEmploye: string): Promise<Employe> {
    return firstValueFrom(this.httpClient.get<Employe>(
        `${this.MAIN_SERVER_BASE_PATH}/employes/${emailEmploye}`,
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
}
