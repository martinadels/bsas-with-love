"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import type { Day, Place } from "@/types";
import DayCard from "@/components/DayCard";
import CinematicBackground from "@/components/CinematicBackground";


export default function HomePage() {
  const [days, setDays] = useState<Day[]>([]);
  const [placesByDay, setPlacesByDay] = useState<Record<string, Place[]>>({});
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: daysData } = await supabase.from("days").select("*").order("date", { ascending: true });
      setDays(daysData ?? []);

      const { data: placesData } = await supabase.from("places").select("*").order("sort_order", { ascending: true });
      const grouped: Record<string, Place[]> = {};
      (placesData ?? []).forEach((p) => {
        grouped[p.day_id] = grouped[p.day_id] ? [...grouped[p.day_id], p] : [p];
      });
      setPlacesByDay(grouped);
    };
    load();
  }, []);

  const currentDay = days[idx];
  const theme = currentDay?.theme_color || "#0b0f14";
  const hero = currentDay?.hero_image_url || "/bsas-hero.jpg";

  const currentPlaces = useMemo(() => (currentDay ? placesByDay[currentDay.id] || [] : []), [currentDay, placesByDay]);

  const prev = () => setIdx((v) => Math.max(0, v - 1));
  const next = () => setIdx((v) => Math.min(days.length - 1, v + 1));

  return (
    <div className="min-h-screen text-white">
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-white/10">
        <img src={hero} alt="Buenos Aires" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.25em] text-white/70">BUENOS AIRES · WITH LOVE</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-light">
            {currentDay ? "Day by day journey" : "Create your first day in /admin"}
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">Minimal, cinematic, editable. A living plan.</p>
        </div>
      </div>

<div className="w-full max-w-7xl mx-auto px-6 py-20">

        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} disabled={idx === 0} className="px-4 py-2 rounded-full border border-white/20 disabled:opacity-30 hover:border-white/40 transition">
              ← Prev
            </button>

            <div className="text-sm text-white/70">{days.length ? `Day ${idx + 1} / ${days.length}` : ""}</div>

            <button onClick={next} disabled={idx >= days.length - 1} className="px-4 py-2 rounded-full border border-white/20 disabled:opacity-30 hover:border-white/40 transition">
              Next →
            </button>
          </div>

          {currentDay ? (
            <DayCard day={currentDay} places={currentPlaces} />
          ) : (
            <div className="rounded-3xl border border-white/10 p-8 text-white/60 bg-white/5">
              Go to <span className="underline">/admin</span> to create days.
            </div>
          )}

          <div className="mt-6 text-xs text-white/50">
            Admin: <span className="underline">/admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
