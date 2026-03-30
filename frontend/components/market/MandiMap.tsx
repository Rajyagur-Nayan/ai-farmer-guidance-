"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MandiMapProps {
  userCoords: { lat: number; lng: number };
  facilities: Array<{ id: string; lat: number; lng: number }>;
  onFacilityClick: (facility: any) => void;
  routeData: [number, number][];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MandiMap({ userCoords, facilities, onFacilityClick, routeData }: MandiMapProps) {
  return (
    <MapContainer 
      center={[userCoords.lat, userCoords.lng]} 
      zoom={13} 
      className="h-full w-full z-10"
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* User Marker */}
      <Marker position={[userCoords.lat, userCoords.lng]} />
      
      {/* Facility Markers */}
      {facilities.map((f) => (
        <Marker 
          key={f.id} 
          position={[f.lat, f.lng]}
          eventHandlers={{ click: () => onFacilityClick(f) }}
        />
      ))}

      {/* Route Data */}
      {routeData.length > 0 && (
        <Polyline positions={routeData} color="#1e293b" weight={4} opacity={0.6} />
      )}

      <MapUpdater center={[userCoords.lat, userCoords.lng]} />
    </MapContainer>
  );
}
