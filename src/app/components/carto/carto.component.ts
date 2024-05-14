import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Signal, computed, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  LatLng, Layer, TileLayer, tileLayer, polyline,
  Map as LeafletMap,
  Marker as LeafletMarker,
  Polyline as LeafletPolyline,
} from 'leaflet';
import { Subscription } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { GeoapiService } from '../../services/geoapi.service';
import { getObsResize } from './utils/rxjs';
import { HttpClientModule } from '@angular/common/http';
import { getMarker } from './utils/marker';
import { toObservable } from "@angular/core/rxjs-interop";
import { TourneeService } from '../../services/tournee.service';
import { LeafletColors } from './utils/colors';
import { Coordinates, GeoAPICoordinatesFormat } from '../../utils/types/coordinates.type';

@Component({
  selector: 'app-carto',
  standalone: true,
  providers: [ GeoapiService, TourneeService ],
  imports: [
    CommonModule, LeafletModule,
    MatGridListModule, MatListModule,
    HttpClientModule,
  ],
  templateUrl: './carto.component.html',
  styleUrl: './carto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartoComponent implements OnDestroy {
  readonly center = signal<LatLng>(new LatLng(45.166672, 5.71667));
  readonly zoom = signal<number>(11);
  private readonly tileLayer = signal<TileLayer>(tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }))
  private readonly leafletMap = signal<LeafletMap | undefined>(undefined);
  private readonly tournees = signal<(LeafletPolyline | LeafletMarker)[]>([]);

  private readonly sigCoordinates = signal<Coordinates>({list: []});
  private readonly coordinates$ = toObservable(this.sigCoordinates);

  private _loadTournee = this.coordinates$.subscribe(response => {
    if (this.sigCoordinates().list.length >0 && this.sigCoordinates().list.length <= 2) {
      const startCoord = this.sigCoordinates().entrepot || this.sigCoordinates().list[0];
      
      this.center.set(new LatLng(startCoord[0], startCoord[1]));
    }
    
    if (response.list.length != 0) {
      this.displayMarkers();
      this.displayPolylines().then();
    }

  });

  @Input({required:true})
  get coordinates(): Coordinates { return this.sigCoordinates()}
  set coordinates(coordinates: Coordinates) {
    this.sigCoordinates.set(coordinates);
  }

  readonly layers: Signal<Layer[]> = computed(() => [
    this.tileLayer(),
    ...this.tournees(),
  ]);

  private subResize?: Subscription;

  registerLeafletMap(m: LeafletMap, divMap: HTMLDivElement): void {
    this.leafletMap.set(m);
    this.subResize = getObsResize(divMap).subscribe(() => {
      m.invalidateSize({ animate: false })
      m.setView(this.center(), this.zoom());
    });
  }

  constructor(private geoAPI: GeoapiService) {}

  displayMarkers(): void {
    
    const coords =  this.sigCoordinates().list.map(coord => {
        const [lat, lng] = coord
        return new LatLng(lat, lng);
      })

    const markers = coords.map(x => getMarker(x, LeafletColors[0], ''));

    if (this.sigCoordinates().entrepot) {
      markers.push(getMarker({
        lat: this.sigCoordinates().entrepot![0],
        lng: this.sigCoordinates().entrepot![1]
      } as LatLng, 'gold', "Entrepôt"));
    } else if (coords.length == 2) {
      markers[1] = getMarker(coords[1], LeafletColors[1], '');
    }
    
    this.tournees.update(u => [...u, ...markers]);
  }

  async displayPolylines(): Promise<void> {
    let coords: GeoAPICoordinatesFormat[] =  this.sigCoordinates().list.map(coord => {
        const [lat, lng] = coord;
        return [lng, lat];
    });

    if (this.sigCoordinates().entrepot) {
      const [lat, lng] = this.sigCoordinates().entrepot!;
      coords = [[lng, lat], ...coords];
    }

    const directions = await this.geoAPI.getDirections([...coords]);
    
    const polylines = polyline(directions, {color: LeafletColors[0]});
    this.tournees.update(u => [...u, polylines]);
  }

  ngOnDestroy(): void {
    this.subResize?.unsubscribe();
  }
}
