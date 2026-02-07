"use client";
import type { Day, Place } from "@/types";

export default function DayCard({ day, places }: { day: Day; places: Place[] }) {
  return (
    <div className="w-full rounded-3xl border border-white/10 p-10 sm:p-14 backdrop-blur-xl bg-white/5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.25em] text-white/60">
            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-light">{day.day_title}</h2>
        </div>

        <div className="text-right">
          <div className="text-base text-white/80">{day.mood || ""}</div>
          <div className="text-sm text-white/50 mt-1">{day.transport || ""}</div>
        </div>
      </div>

      <div className="mt-8 text-white/80 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
        {day.activities}
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <p className="text-xs tracking-[0.25em] text-white/50">PLACES</p>

        {places.length ? (
          <ul className="mt-4 space-y-3">
            {places.map((p) => (
              <li key={p.id} className="text-base text-white/75">
                <span className="text-white/90">{p.name}</span>
                {p.address ? <span className="text-white/40"> — {p.address}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-base text-white/40">No places added yet.</p>
        )}
      </div>
    </div>
  );
}
