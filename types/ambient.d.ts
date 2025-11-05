export {};
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@maptiler/sdk' {
  export type LngLatLike = [number, number] | { lng: number; lat: number };
  export type ControlLike = object;
  export interface MapOptions { [key: string]: unknown }
  export class Map {
    constructor(options: MapOptions);
    addControl?: (c: ControlLike, pos?: string) => void;
  }
  export const MapStyle: Record<string, unknown>;
  export interface MarkerOptions { [key: string]: unknown }
  export class Marker {
    constructor(options?: MarkerOptions);
    setLngLat(lnglat: LngLatLike): this;
    addTo(map: Map): this;
  }
}

declare module '@supabase/supabase-js' {
  export interface SupabaseOptions { [key: string]: unknown }
  export function createClient(url: string, key: string, options?: SupabaseOptions): any;
}
