"use client";

import { useState } from "react";
import { Hero } from "../components/hero";
import { Quiz } from "../components/quiz";

export default function HomePage() {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen bg-[#050507] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {!started ? <Hero onStart={() => setStarted(true)} /> : <Quiz />}
      </div>
    </main>
  );
}