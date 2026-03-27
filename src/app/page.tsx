"use client";

import { useState } from "react";
import { CareerFlow } from "@/components/career/career-flow";

export default function HomePage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <section className="intro-shell">
        <div className="intro-panel">
          <p className="intro-tag">AILA</p>
          <h1>Seu próximo passo para uma carreira internacional</h1>
          <p>
            Descubra carreiras, países e um plano de estudos realista com base
            no seu perfil.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setStarted(true)}
          >
            Iniciar diagnóstico
          </button>
        </div>
      </section>
    );
  }

  return <CareerFlow initialStarted />;
}
