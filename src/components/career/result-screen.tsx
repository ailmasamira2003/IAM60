"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { buildMockChatReply } from "@/services/career-result-service";
import { exportCareerResultPdf } from "@/services/pdf-service";
import { useCareerStore } from "@/store/career-store";
import type { CareerFormValues, CareerResult } from "@/types/career";

interface ResultScreenProps {
  values: CareerFormValues;
  result: CareerResult;
  onRestart: () => void;
}

export function ResultScreen({ values, result, onRestart }: ResultScreenProps) {
  const { chatMessages, addChatMessage, clearChat } = useCareerStore();

  const [input, setInput] = useState("");

  useEffect(() => {
    if (chatMessages.length > 0) {
      return;
    }

    addChatMessage({
      role: "assistant",
      text: `Análise concluída. Seu foco inicial deve ser ${result.suggestedCareers[0]} e preparação para ${result.recommendedCountries[0]}.`,
    });
  }, [
    addChatMessage,
    chatMessages.length,
    result.recommendedCountries,
    result.suggestedCareers,
  ]);

  const whatsappLink = useMemo(() => {
    const message = [
      "Recebi meu plano de carreira internacional no AI CAREER SYSTEM.",
      `Objetivo: ${values.mainGoal}`,
      `Prontidão atual: ${result.readinessLevel}%`,
      `Países recomendados: ${result.recommendedCountries.join(", ")}`,
      `Carreira em destaque: ${result.suggestedCareers[0]}`,
    ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [
    result.readinessLevel,
    result.recommendedCountries,
    result.suggestedCareers,
    values.mainGoal,
  ]);

  function handleExportPdf() {
    exportCareerResultPdf(values, result);
  }

  function handleSubmitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    addChatMessage({ role: "user", text: trimmed });
    setInput("");

    window.setTimeout(() => {
      addChatMessage({
        role: "assistant",
        text: buildMockChatReply(trimmed, result),
      });
    }, 300);
  }

  function handleRestart() {
    clearChat();
    onRestart();
  }

  return (
    <section className="result-shell">
      <div className="result-header">
        <h2>Resultado personalizado</h2>
        <p>{result.summary}</p>
      </div>

      <div className="result-grid">
        <article className="result-card chart-card">
          <h3>Perfil de decisão</h3>
          <p className="result-card-note">
            Este gráfico resume seus padrões de tomada de decisão e destaca os
            pontos que mais favorecem sua estratégia internacional no curto e no
            médio prazo.
          </p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.profileChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {result.profileChart.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="result-card">
          <h3>Carreiras sugeridas</h3>
          <ul>
            {result.suggestedCareers.map((career) => (
              <li key={career}>{career}</li>
            ))}
          </ul>
        </article>

        <article className="result-card">
          <h3>Países recomendados</h3>
          <ul>
            {result.recommendedCountries.map((country) => (
              <li key={country}>{country}</li>
            ))}
          </ul>
        </article>

        <article className="result-card">
          <h3>Plano de ação</h3>
          <ol>
            {result.roadmap.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="result-card">
          <h3>Principais lacunas</h3>
          <ul>
            {result.topGaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </article>

        <article className="result-card readiness-card">
          <h3>Nível de prontidão</h3>
          <strong>{result.readinessLevel}%</strong>
          <div className="readiness-track" aria-hidden>
            <div
              className="readiness-fill"
              style={{ width: `${result.readinessLevel}%` }}
            />
          </div>
          <p>
            Quanto maior esse indicador, maior a probabilidade de executar seu plano
            com estabilidade.
          </p>
        </article>

        <article className="result-card">
          <h3>Universidades e programas</h3>
          <ul>
            {result.universities.map((item) => (
              <li key={`${item.university}-${item.program}`}>
                <strong>{item.university}</strong>
                <span>
                  {item.program} | {item.country} | {item.duration}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="result-card">
          <h3>Bolsas compatíveis</h3>
          <ul>
            {result.scholarships.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>
                  {item.country} | {item.coverage} | {item.fitReason}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="actions-row">
        <button type="button" className="primary-btn" onClick={handleExportPdf}>
          Exportar PDF
        </button>

        <a
          className="ghost-btn"
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          Enviar por WhatsApp
        </a>

        <button type="button" className="ghost-btn" onClick={handleRestart}>
          Refazer formulário
        </button>
      </div>

      <section className="chat-shell">
        <h3>Chat com IA (simulado)</h3>

        <div className="chat-messages">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.role === "user" ? "from-user" : "from-assistant"}`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmitChat}>
          <input
            type="text"
            placeholder="Exemplo: Quais bolsas combinam mais com meu perfil?"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="primary-btn">
            Enviar
          </button>
        </form>
      </section>
    </section>
  );
}
