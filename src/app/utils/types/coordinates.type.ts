export type GeoAPICoordinatesFormat = [lng: number, lat:number];
export type LeafetCoordinatesFormat = [lat: number, lng:number];

export type Coordinates = {
    entrepot?: LeafetCoordinatesFormat;
    list: LeafetCoordinatesFormat[];
};