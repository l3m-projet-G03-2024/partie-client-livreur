import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom, map } from 'rxjs';
import { Commande } from '../utils/types/commande.type';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private readonly MAIN_SERVER_BASE_PATH = `${environment.mainServer}/api/v1`;

  constructor(private httpClient: HttpClient) { }


  getCommande(referenceCommande: string): Promise<Commande> {
    return firstValueFrom(this.httpClient.get<Commande>(
      `${this.MAIN_SERVER_BASE_PATH}/commandes/${referenceCommande}`,
      {
        headers: { Accept: 'application/json' }
      }
    )
  );
  }

}
