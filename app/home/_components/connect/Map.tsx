'use client';

import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - ambient types provided locally; suppress missing module types during typecheck
import * as maptilersdk from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';

const MapCard: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  const [lng] = useState<number>(78.44297236708948);
  const [lat] = useState<number>(17.428375346402337);
  const [zoom] = useState<number>(15.5);

  const MAPTILER_API_KEY: string = 'ueOCDbDz1XEW7NC0u49F';

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      apiKey: MAPTILER_API_KEY,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    new maptilersdk.Marker({ color: '#3b82f6' })
      .setLngLat([lng, lat])
      .addTo(map.current);

  }, [lng, lat, zoom, MAPTILER_API_KEY]);

  return (
    <div className="pointer-events-auto relative w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative h-64 w-full">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 h-full w-full [&_.maplibregl-ctrl-bottom-left]:hidden [&_.maplibregl-ctrl-bottom-right]:hidden [&_.mapboxgl-ctrl-attrib]:hidden [&_.maplibregl-ctrl-attrib]:hidden"
          />
        </div>
      </div>
    </div>
  );
}

export default MapCard;