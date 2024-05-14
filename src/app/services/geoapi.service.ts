import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection, Point, Polygon, Position } from 'geojson';
import { LatLng } from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeoDirections } from '../utils/types/geo-directions.type';
import { GeoPoint } from '../utils/types/geo-point.type';
import { GeoAPICoordinatesFormat, LeafetCoordinatesFormat } from '../utils/types/coordinates.type';
 
const urlCommune = 'https://geo.api.gouv.fr/communes'

@Injectable()
export class GeoapiService {

  private openRouteServiceBaseURL = "https://api.openrouteservice.org";

  constructor(private httpClient: HttpClient) { }

  async getCommune(postalCode: string): Promise<[Feature<Polygon, GeoPropertiesForCommune>, Feature<Point, GeoPropertiesForCommune>]> {
    const urlContour = `${urlCommune}?codePostal=${postalCode}&format=geojson&geometry=contour`
    const urlMairie  = `${urlCommune}?codePostal=${postalCode}&format=geojson&geometry=mairie`

    const PC = firstValueFrom( this.httpClient.get<FeatureCollection<Polygon, GeoPropertiesForCommune>>( urlContour ) )
    const PM = firstValueFrom(this.httpClient.get<FeatureCollection<Point, GeoPropertiesForCommune>>(urlMairie))
    
    return Promise.all([
      PC.then(fg => fg.features.length > 0 ? fg.features[0] : Promise.reject(`No commune found for postal code ${postalCode}`)),
      PM.then(fg => fg.features.length > 0 ? fg.features[0] : Promise.reject(`No commune found for postal code ${postalCode}`)),
    ]);
  }

  async getLocationCoords(location: string): Promise<GeoAPICoordinatesFormat> {
    const response = await firstValueFrom(this.httpClient.get<GeoPoint>(
      `${this.openRouteServiceBaseURL}/geocode/search`,
      {
        headers: { Authorization: environment.openRouteService.apiKey },
        params: {
          api_key: environment.openRouteService.apiKey,
          text: location
        }
      }
    ));

    return response.features[0].geometry.coordinates;
  }

  async getDirections(coordinates: [lng: number, lat: number][]): Promise<LeafetCoordinatesFormat[]> {
    const response = await firstValueFrom(this.httpClient.post<GeoDirections>(
      `${this.openRouteServiceBaseURL}/v2/directions/driving-car/geojson`,
      {
        coordinates
      },
      {
        headers: { Authorization: environment.openRouteService.apiKey },
      }
    ));

    return response.features[0].geometry.coordinates.map(x => [x[1], x[0]]); // return [lat, lng]
  }

}

export function PositionToLatLng(p: Position): LatLng {
  return new LatLng(p[1], p[0])
}

export interface GeoPropertiesForCommune {
  readonly code: string;
  readonly codeDepartement: string;
  readonly codeEpci: string;
  readonly codeRegion: string;
  readonly codesPostaux: readonly string[];
  readonly nom: string;
  readonly population: number;
  readonly siren: string;
}
