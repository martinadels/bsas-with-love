"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Day, Place } from "@/types";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";

// Dynamic imports (client-only)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

function AutoFly({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, [map, center, zoom]);

  return null;
}

export default function MapPanel({
  days,
  placesByDay,
  activeIndex,
}: {
  days: Day[];
  placesByDay: Record<string, Place[]>;
  activeIndex: number;
}) {
  // Fix Leaflet icons (client only)
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (typeof window === "undefined") return;
      const L = (await import("leaflet")).default;

      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      if (mounted) {
        (L.Marker.prototype as any).options.icon = DefaultIcon;
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const [play, setPlay] = useState(false);
  const [playIndex, setPlayIndex] = useState(activeIndex);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) setPlayIndex(activeIndex);
  }, [activeIndex, play]);

  useEffect(() => {
    if (!play) return;

    timerRef.current = window.setInterval(() => {
      setPlayIndex((v) => {
        const nxt = v + 1;
        if (nxt >= days.length) {
          setPlay(false);
          return v;
        }
        return nxt;
      });
    }, 1600);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [play, days.length]);

  const idx = play ? playIndex : activeIndex;
  const day = days[idx];

  const pins = useMemo(() => {
    if (!day) return [];
    return (placesByDay[day.id] || [])
      .filter(p => typeof p.lat === "number" && typeof p.lng === "number")
      .map(p => ({
        lat: p.lat as number,
        lng: p.lng as number,
        name: p.name,
      }));
  }, [day, placesByDay]);

  const polyline = pins.map(p => [p.lat, p.lng]) as [number, number][];
  const fallbackCenter: [number, number] = [-34.6037, -58.3816];
  const center: [number, number] = pins[0]
    ? [pins[0].lat, pins[0].lng]
    : fallbackCenter;

  const zoom =
    pins.length > 3 ? 12 :
    pins.length > 1 ? 13 :
    14;

  return (
    <div className="relative h-[520px] w-full">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-[999] flex items-center gap-2">
        <button
          onClick={() => setPlay(v => !v)}
          className="px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur hover:border-white/40 transition"
        >
          {play ? "⏸ Pause trip" : "▶ Play trip"}
        </button>
        <div className="text-xs text-white/60">
          {days.length ? (play ? `Playing day ${idx + 1}/${days.length}` : "Map") : ""}
        </div>
      </div>

      <MapContainer
        center={fallbackCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <AutoFly center={center} zoom={zoom} />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pins.map((p, i) => (
          <Marker key={p.name + i} position={[p.lat, p.lng]} />
        ))}

        {polyline.length >= 2 && (
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              opacity: 0.6,
              dashArray: "6 10",
            }}
          />
        )}
      </MapContainer>

      {/* Footer info */}
      <div className="absolute bottom-4 left-4 right-4 z-[999] rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/80">
            {day ? `Today: ${day.day_title}` : "Trip map"}
          </div>
          <div className="text-xs text-white/50">
            Pins today: {pins.length}
          </div>
        </div>
      </div>
    </div>
  );
}
