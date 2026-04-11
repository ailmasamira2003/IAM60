"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  buildDevelopmentSkills,
  buildReportMetrics,
  buildScholarshipSuggestions,
  buildStudyPlan,
  getFirstName,
  getFocusAreaLabel,
  getLeadCountry,
  type PlusSubscriber,
} from "@/lib/plus-content";
import { exportCareerResultPdf } from "@/services/pdf-service";
import type { CareerFormValues, CareerResult } from "@/types/career";

type PlusExperienceProps = {
  values: CareerFormValues;
  result: CareerResult;
  onBack: () => void;
};

type PlusTab = "plan" | "report" | "chat" | "scholarships";
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const TAB_ITEMS: Array<{ id: PlusTab; label: string }> = [
  { id: "plan", label: "Plano detalhado" },
  { id: "report", label: "Relatorio completo" },
  { id: "chat", label: "AILA" },
  { id: "scholarships", label: "Bolsas" },
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasFullName(value: string): boolean {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length >= 2;
}

function buildAssistantReply(
  input: string,
  values: CareerFormValues,
  result: CareerResult,
  subscriber: PlusSubscriber,
  leadCountry: string,
  focusArea: string,
  firstScholarshipName: string
): string {
  const normalized = normalizeText(input);
  const firstName = getFirstName(subscriber.fullName);

  if (normalized.includes("bolsa") || normalized.includes("scholar")) {
    return `${firstName}, eu priorizaria primeiro ${firstScholarshipName} e depois as opcoes de ${leadCountry}. O objetivo e aplicar onde seu perfil ja tem encaixe claro e custo mais controlado.`;
  }

  if (
    normalized.includes("ingles") ||
    normalized.includes("idioma") ||
    normalized.includes("toefl") ||
    normalized.includes("ielts")
  ) {
    return `Seu nivel atual de ingles e ${values.englishLevel || "inicial"}. Para ganhar competitividade, eu focaria em estudo aplicado ao contexto academico e profissional da sua area antes de marcar provas.`;
  }

  if (
    normalized.includes("curriculo") ||
    normalized.includes("cv") ||
    normalized.includes("linkedin") ||
    normalized.includes("portfolio")
  ) {
    return `Monte uma narrativa curta: quem voce e hoje, por que ${focusArea} faz sentido e qual impacto voce quer gerar em ${leadCountry}. Depois transforme isso em CV, LinkedIn e portfolio com provas concretas.`;
  }

  if (
    normalized.includes("pais") ||
    normalized.includes("país") ||
    normalized.includes("destino") ||
    normalized.includes("canada") ||
    normalized.includes("canad")
  ) {
    return `Seu encaixe principal no momento aponta para ${leadCountry}. Eu usaria esse pais como ancora e manteria mais um ou dois destinos secundarios para comparar custo, idioma e empregabilidade.`;
  }

  if (
    normalized.includes("rotina") ||
    normalized.includes("estudo") ||
    normalized.includes("cronograma") ||
    normalized.includes("dia")
  ) {
    return `Sua prontidao geral esta em ${result.readinessLevel}%, entao o ganho agora vem de uma rotina simples e repetivel. O melhor formato e proteger blocos de estudo pequenos, acompanhar entregas semanais e revisar o plano a cada 15 dias.`;
  }

  return `Eu seguiria por este caminho: objetivo claro em ${leadCountry}, base forte para ${focusArea}, depois candidatura enxuta e consistente. Se quiser, eu posso te orientar por idioma, CV, bolsas ou organizacao do cronograma.`;
}

export function PlusExperience({
  values,
  result,
  onBack,
}: PlusExperienceProps) {
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [subscriber, setSubscriber] = useState<PlusSubscriber | null>(null);
  const [activeTab, setActiveTab] = useState<PlusTab>("plan");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState("");

  const studyPlan = useMemo(() => buildStudyPlan(values, result), [values, result]);
  const reportMetrics = useMemo(
    () => buildReportMetrics(values, result),
    [values, result]
  );
  const developmentSkills = useMemo(
    () => buildDevelopmentSkills(values, result),
    [values, result]
  );
  const scholarships = useMemo(
    () => buildScholarshipSuggestions(values, result),
    [values, result]
  );

  const leadCountry = getLeadCountry(values, result);
  const focusArea = getFocusAreaLabel(values);
  const firstName = getFirstName(subscriber?.fullName ?? draftName);
  const activeScholarship =
    scholarships.find((item) => item.id === selectedScholarshipId) ??
    scholarships[0] ??
    null;
  const firstScholarshipName =
    scholarships[0]?.name ?? "a bolsa demonstrativa mais aderente";

  function handleAccessSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const fullName = draftName.trim();
    const email = draftEmail.trim().toLowerCase();

    if (!hasFullName(fullName)) {
      setFormError("Informe nome e sobrenome para liberar o acesso demonstrativo.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Informe um e-mail valido para continuar.");
      return;
    }

    setFormError("");
    setSubscriber({ fullName, email });
    setActiveTab("plan");
    setSelectedScholarshipId(scholarships[0]?.id ?? "");
    setChatMessages([
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Oi, ${getFirstName(fullName)}! Eu sou a AILA. Organizei um demo com foco em ${focusArea}, usando ${leadCountry} como pais ancora. Pergunte sobre bolsas, cronograma, idioma ou candidatura.`,
      },
    ]);
  }

  function handleSendChatMessage(message: string): void {
    if (!subscriber) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const reply = buildAssistantReply(
      trimmedMessage,
      values,
      result,
      subscriber,
      leadCountry,
      focusArea,
      firstScholarshipName
    );

    setChatMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedMessage,
      },
      {
        id: `assistant-${Date.now() + 1}`,
        role: "assistant",
        content: reply,
      },
    ]);
    setChatInput("");
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    handleSendChatMessage(chatInput);
  }

  function handleDownloadReport(): void {
    exportCareerResultPdf(values, result, subscriber ?? undefined);
  }

  if (!subscriber) {
    return (
      <section className="plus-shell">
        <div className="plus-access-grid">
          <article className="plus-access-copy">
            <p className="result-kicker">Plano Plus</p>
            <h2>Ative sua area premium demonstrativa</h2>
            <p>
              Complete um acesso rapido com nome completo e e-mail para liberar
              um ambiente de assinatura com plano, relatorio, IA demo e bolsas
              relacionadas aos paises escolhidos.
            </p>

            <div className="plus-access-points">
              <div className="plus-access-point">
                <strong>Plano detalhado</strong>
                <span>Cards conectados em uma trilha diaria de aplicacao internacional.</span>
              </div>
              <div className="plus-access-point">
                <strong>Relatorio completo</strong>
                <span>PDF demonstrativo com metricas, respostas e habilidades prioritarias.</span>
              </div>
              <div className="plus-access-point">
                <strong>AILA</strong>
                <span>Interface de chat generativa pronta para apresentacao.</span>
              </div>
              <div className="plus-access-point">
                <strong>Bolsas</strong>
                <span>Lista demonstrativa baseada nos paises mais relevantes do perfil.</span>
              </div>
            </div>
          </article>

          <form className="plus-access-card" onSubmit={handleAccessSubmit}>
            <p className="result-kicker">Login demonstrativo</p>
            <h3>Liberar conteudos da assinatura</h3>
            <p className="result-card-note">
              Este acesso nao cria conta real. Ele so abre a area premium para
              demonstracao do produto.
            </p>

            <label className="plus-field">
              <span>Nome completo</span>
              <input
                type="text"
                className="text-field"
                placeholder="Exemplo: Ana Souza"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="plus-field">
              <span>E-mail</span>
              <input
                type="email"
                className="text-field"
                placeholder="ana@exemplo.com"
                value={draftEmail}
                onChange={(event) => setDraftEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            {formError ? <p className="error-message">{formError}</p> : null}

            <div className="plus-access-actions">
              <button type="button" className="ghost-btn" onClick={onBack}>
                Voltar ao resultado
              </button>
              <button type="submit" className="primary-btn">
                Entrar no Plano Plus
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="plus-shell">
      <div className="plus-topbar">
        <button type="button" className="ghost-btn plus-back-btn" onClick={onBack}>
          Voltar ao resultado
        </button>
        <span className="plus-status">Ambiente demonstrativo ativo</span>
      </div>

      <div className="plus-hero">
        <div className="plus-hero-copy">
          <p className="result-kicker">Plano Plus desbloqueado</p>
          <h2>{firstName}, seu espaco premium esta pronto</h2>
          <p>
            Organizamos um fluxo demonstrativo com foco em {focusArea}, usando{" "}
            {leadCountry} como destino principal e seu nivel de prontidao atual
            como base do plano.
          </p>
        </div>

        <div className="plus-hero-meta">
          <div className="plus-hero-meta-card plus-hero-meta-card-email">
            <span>E-mail</span>
            <strong>{subscriber.email}</strong>
          </div>
          <div className="plus-hero-meta-card plus-hero-meta-card-compact">
            <span>Pais ancora</span>
            <strong>{leadCountry}</strong>
          </div>
          <div className="plus-hero-meta-card plus-hero-meta-card-compact">
            <span>Prontidao atual</span>
            <strong>{result.readinessLevel}%</strong>
          </div>
        </div>
      </div>

      <nav className="plus-nav" aria-label="Conteudos da assinatura">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`plus-nav-btn ${activeTab === tab.id ? "plus-nav-btn-active" : ""}`}
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="plus-panel">
        {activeTab === "plan" ? (
          <>
            <div className="plus-panel-head">
              <div>
                <h3>Plano Detalhado de Estudos</h3>
                <p>
                  Um mapa em cards conectados para sair da estrategia e chegar
                  ate a primeira aplicacao internacional.
                </p>
              </div>
              <span className="plus-panel-badge">{studyPlan.length} dias iniciais</span>
            </div>

            <div className="study-map">
              {studyPlan.map((day) => (
                <article key={day.day} className="study-card">
                  <div className="study-card-head">
                    <span className="study-day-pill">Dia {day.day}</span>
                    <h4>{day.title}</h4>
                  </div>
                  <p className="study-card-focus">{day.focus}</p>
                  <ul className="study-card-tasks">
                    {day.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                  <p className="study-card-outcome">
                    <strong>Entrega:</strong> {day.outcome}
                  </p>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "report" ? (
          <>
            <div className="plus-panel-head">
              <div>
                <h3>Relatorio Completo</h3>
                <p>
                  Visao demonstrativa com percentuais por aspecto avaliado e as
                  habilidades mais importantes para desenvolver agora.
                </p>
              </div>
              <button type="button" className="primary-btn" onClick={handleDownloadReport}>
                Baixar PDF
              </button>
            </div>

            <div className="plus-metric-grid">
              {reportMetrics.map((metric) => (
                <article key={metric.label} className="plus-metric-card">
                  <div className="plus-metric-head">
                    <span>{metric.label}</span>
                    <strong>{metric.value}%</strong>
                  </div>
                  <div className="readiness-track" aria-hidden>
                    <div
                      className="readiness-fill"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <p>{metric.description}</p>
                </article>
              ))}
            </div>

            <div className="plus-skills-grid">
              {developmentSkills.map((skill) => (
                <article key={skill.skill} className="plus-skill-card">
                  <h4>{skill.skill}</h4>
                  <p>{skill.reason}</p>
                  <strong>Proxima acao:</strong>
                  <span>{skill.action}</span>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "chat" ? (
          <div className="plus-chat-layout">
            <aside className="plus-chat-side">
              <p className="result-kicker">AILA</p>
              <h3>Chat demonstrativo de IA</h3>
              <p>
                Sem integracao real, mas com uma interface pronta para vender a
                experiencia de assistente generativa personalizada.
              </p>

              <div className="plus-suggestion-list">
                {[
                  "Qual bolsa devo priorizar primeiro?",
                  "Como melhorar meu ingles para aplicar?",
                  "O que colocar no meu curriculo internacional?",
                  "Qual pais devo usar como ancora?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="ghost-btn plus-suggestion-btn"
                    onClick={() => handleSendChatMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </aside>

            <div className="plus-chat-card">
              <div className="plus-chat-header">
                <strong>AILA</strong>
                <span>Assistente demonstrativa para carreira internacional</span>
              </div>

              <div className="plus-chat-messages">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`plus-chat-bubble ${
                      message.role === "assistant"
                        ? "plus-chat-bubble-assistant"
                        : "plus-chat-bubble-user"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>

              <form className="plus-chat-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  className="text-field"
                  placeholder="Pergunte algo para a AILA..."
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                />
                <button type="submit" className="primary-btn">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {activeTab === "scholarships" ? (
          <>
            <div className="plus-panel-head">
              <div>
                <h3>Bolsas por pais escolhido</h3>
                <p>
                  Exemplos demonstrativos baseados nos destinos do formulario.
                  Ao selecionar uma bolsa, os requisitos principais aparecem ao lado.
                </p>
              </div>
              <span className="plus-panel-badge">{scholarships.length} opcoes demo</span>
            </div>

            <div className="plus-scholarship-grid">
              <div className="plus-scholarship-list">
                {scholarships.map((scholarship) => {
                  const isActive =
                    (selectedScholarshipId || scholarships[0]?.id) === scholarship.id;

                  return (
                    <button
                      key={scholarship.id}
                      type="button"
                      className={`plus-scholarship-item ${
                        isActive ? "plus-scholarship-item-active" : ""
                      }`}
                      onClick={() => setSelectedScholarshipId(scholarship.id)}
                    >
                      <span className="plus-scholarship-country">{scholarship.country}</span>
                      <strong>{scholarship.name}</strong>
                      <span>{scholarship.coverage}</span>
                    </button>
                  );
                })}
              </div>

              {activeScholarship ? (
                <article className="plus-scholarship-detail">
                  <p className="result-kicker">{activeScholarship.country}</p>
                  <h4>{activeScholarship.name}</h4>
                  <p>{activeScholarship.summary}</p>
                  <p className="plus-scholarship-highlight">
                    <strong>Cobertura:</strong> {activeScholarship.coverage}
                  </p>
                  <p className="plus-scholarship-highlight">
                    <strong>Melhor encaixe:</strong> {activeScholarship.idealFor}
                  </p>

                  <div>
                    <strong>Requisitos principais</strong>
                    <ul className="plus-requirements-list">
                      {activeScholarship.requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
