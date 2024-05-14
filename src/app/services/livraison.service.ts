import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Livraison } from '../utils/types/livraison.type';
import { UpdateLivraison } from '../utils/types/update-livraison.type';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  private readonly MAIN_SERVER_BASE_PATH = `${environment.mainServer}/api/v1`;

  constructor(private httpClient: HttpClient) { }
  
  getLivraison(referenceLivraison: string): Promise<Livraison> {
    return firstValueFrom(this.httpClient.get<Livraison>(
      `${this.MAIN_SERVER_BASE_PATH}/livraisons/${referenceLivraison}`,
      {
        headers: { Accept: 'application/json' }
      }
    )
  ); 
  }

  updateLivraison(referenceLivraison: string, data: UpdateLivraison): Promise<Livraison> {
    return firstValueFrom(this.httpClient.patch<Livraison>(
      `${this.MAIN_SERVER_BASE_PATH}/livraisons/${referenceLivraison}`,
      {
        ...data
      },
      {
        headers: { Accept: 'application/json' }
      }
    )
  ); 
  }
}
