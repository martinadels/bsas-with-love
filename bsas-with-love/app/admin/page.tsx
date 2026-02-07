"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Day } from "@/types";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [days, setDays] = useState<Day[]>([]);
  const [form, setForm] = useState<Partial<Day>>({
    date: "",
    day_title: "",
    activities: "",
    transport: "",
    mood: "",
    theme_color: "#0b0f14",
    hero_image_url: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadDays = async () => {
    const { data, error } = await supabase
      .from("days")
      .select("*")
      .order("date", { ascending: true });

    if (error) alert(error.message);
    setDays(data ?? []);
  };

  useEffect(() => {
    if (userEmail) loadDays();
  }, [userEmail]);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) alert(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const saveDay = async () => {
    if (!form.date || !form.day_title || !form.activities) {
      alert("Please fill: date, title, activities");
      return;
    }

    const payload = {
      date: form.date,
      day_title: form.day_title,
      activities: form.activities,
      transport: form.transport,
      mood: form.mood,
      theme_color: form.theme_color,
      hero_image_url: form.hero_image_url,
    };

    const { error } = await supabase.from("days").insert(payload);
    if (error) alert(error.message);

    setForm({
      date: "",
      day_title: "",
      activities: "",
      transport: "",
      mood: "",
      theme_color: "#0b0f14",
      hero_image_url: "",
    });

    loadDays();
  };

  const deleteDay = async (id: string) => {
    if (!confirm("Delete this day?")) return;
    const { error } = await supabase.from("days").delete().eq("id", id);
    if (error) alert(error.message);
    loadDays();
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 p-8 bg-white/5">
          <h1 className="text-2xl font-light">Admin Login</h1>
          <p className="mt-2 text-white/60 text-sm">Only you can edit the trip.</p>

          <input
            className="mt-6 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none"
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={signIn}
            className="mt-5 w-full rounded-xl border border-white/20 p-3 hover:border-white/40 transition"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light">Admin</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition"
          >
            Sign out ({userEmail})
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
            <h2 className="text-xl font-light">Create day</h2>

            <label className="block mt-4 text-xs text-white/60">Date</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              type="date"
              value={form.date || ""}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <label className="block mt-4 text-xs text-white/60">Title</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.day_title || ""}
              onChange={(e) => setForm({ ...form, day_title: e.target.value })}
              placeholder="San Telmo Soul"
            />

            <label className="block mt-4 text-xs text-white/60">Activities</label>
            <textarea
              className="w-full h-32 rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.activities || ""}
              onChange={(e) => setForm({ ...form, activities: e.target.value })}
              placeholder={"Morning: ...\nAfternoon: ...\nEvening: ...\nBudget: $$"}
            />

            <label className="block mt-4 text-xs text-white/60">Transport</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.transport || ""}
              onChange={(e) => setForm({ ...form, transport: e.target.value })}
              placeholder="Subway + walk / Uber"
            />

            <label className="block mt-4 text-xs text-white/60">Mood</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.mood || ""}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
              placeholder="🌃 City night"
            />

            <label className="block mt-4 text-xs text-white/60">Theme color</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.theme_color || ""}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
              placeholder="#0b0f14"
            />

            <label className="block mt-4 text-xs text-white/60">Hero image URL (optional)</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3"
              value={form.hero_image_url || ""}
              onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
              placeholder="https://..."
            />

            <button
              onClick={saveDay}
              className="mt-5 w-full rounded-xl border border-white/20 p-3 hover:border-white/40 transition"
            >
              Save day
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
            <h2 className="text-xl font-light">Days</h2>
            <p className="text-sm text-white/60 mt-2">
              Create days now. Next we add places editor.
            </p>

            <div className="mt-4 space-y-3">
              {days.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-white/10 p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-xs text-white/50">{d.date}</div>
                    <div className="text-white/90">{d.day_title}</div>
                  </div>
                  <button
                    onClick={() => deleteDay(d.id)}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={loadDays}
              className="mt-5 w-full rounded-xl border border-white/20 p-3 hover:border-white/40 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
