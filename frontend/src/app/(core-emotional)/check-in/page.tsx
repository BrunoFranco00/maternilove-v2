"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCoreStore } from "@/app/(core-emotional)/core.store";
import type { MoodType } from "@/types/dto/checkin.dto";

export const dynamic = "force-dynamic";

const moods: MoodType[] = [
  "HAPPY",
  "CALM",
  "TIRED",
  "ANXIOUS",
  "SAD",
  "OVERWHELMED",
];

export default function CheckInPage() {
  const router = useRouter();
  const checkIn = useCoreStore((s) => s.checkIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async (mood: MoodType) => {
    try {
      setLoading(true);
      setError(null);

      const result = await checkIn({ mood });

      if (result === null) {
        setError("Erro ao registrar check-in");
        return;
      }

      router.push("/relief");
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }

      setError("Erro ao registrar check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Como você está se sentindo?</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleCheckIn(mood)}
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mood}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  );
}
