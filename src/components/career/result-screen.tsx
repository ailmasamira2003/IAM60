"use client";

import { useState } from "react";
import { PlusExperience } from "@/components/career/plus-experience";
import { exportCareerResultPdf } from "@/services/pdf-service";
import type { CareerFormValues, CareerResult } from "@/types/career";

interface ResultScreenProps {
  values: CareerFormValues;
  result: CareerResult;
}

function getReadinessLevelLabel(level: number): string {
  if (level >= 80) {
    return "Alta";
  }

  if (level >= 60) {
    return "Boa";
  }

  if (level >= 45) {
    return "Moderada";
  }

  return "Inicial";
}

function getReadinessMessage(level: number): string {
  if (level >= 80) {
    return "Voce ja tem uma base solida para avancar com consistencia no plano internacional.";
  }

  if (level >= 60) {
    return "Seu cenario e positivo, com alguns ajustes pontuais para acelerar resultados.";
  }

  if (level >= 45) {
    return "Existe potencial real, mas vale fortalecer rotina, idioma e execucao nas proximas semanas.";
  }

  return "Seu comeco pede estrutura e foco em fundamentos antes de acelerar candidaturas.";
}

export function ResultScreen({ values, result }: ResultScreenProps) {
  const [showPlusExperience, setShowPlusExperience] = useState(false);

  function handleBuyPdfReport(): void {
    exportCareerResultPdf(values, result);
  }

  if (showPlusExperience) {
    return (
      <PlusExperience
        values={values}
        result={result}
        onBack={() => setShowPlusExperience(false)}
      />
    );
  }

  return (
    <section className="result-shell">
      <div className="result-header">
        <h2>Resultado personalizado</h2>
        <p>{result.summary}</p>
      </div>

      <div className="result-grid result-grid-compact">
        <article className="result-card personality-card">
          <p className="result-kicker">Perfil de personalidade</p>
          <h3>
            {result.personalityProfile.title}
            <span className="profile-code">{result.personalityProfile.code}</span>
          </h3>
          <p className="result-card-note">{result.personalityProfile.description}</p>
          <ul>
            {result.personalityProfile.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </article>

        <article className="result-card readiness-card">
          <h3>Nivel de prontidao</h3>
          <strong>{result.readinessLevel}%</strong>
          <div className="readiness-track" aria-hidden>
            <div
              className="readiness-fill"
              style={{ width: `${result.readinessLevel}%` }}
            />
          </div>
          <p>
            Classificacao: <strong>{getReadinessLevelLabel(result.readinessLevel)}</strong>
          </p>
          <p>{getReadinessMessage(result.readinessLevel)}</p>
        </article>

        <article className="result-card countries-match-card">
          <h3>Paises que mais combinam com seu estilo</h3>
          <p className="result-card-note">
            Compatibilidade estimada com base no seu perfil e na lista de paises
            escolhida por voce.
          </p>
          <ul className="country-match-list">
            {result.countryMatches.map((match) => (
              <li key={match.country}>
                <span className="country-match-head">
                  <strong>{match.country}</strong>
                  <span>{match.compatibility}%</span>
                </span>
                <span>{match.reason}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="result-card plus-card">
          <p className="result-kicker">Plano Plus</p>
          <h3>O que voce desbloqueia na assinatura</h3>
          <ul>
            <li>Plano detalhado de estudos e de carreira</li>
            <li>Relatorio completo</li>
            <li>IA personalizada</li>
            <li>Bolsas de estudos e para viagens</li>
          </ul>
          <p className="plus-price">R$ 49,00/mes</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setShowPlusExperience(true)}
          >
            Inscreva-se
          </button>
        </article>

        <article className="result-card pdf-card">
          <p className="result-kicker">Relatorio Avulso</p>
          <h3>Relatorio completo em PDF</h3>
          <p className="result-card-note">
            Documento completo com analise de perfil, prontidao, compatibilidade
            de paises e respostas do formulario.
          </p>
          <p className="plus-price">R$ 15,90</p>
          <button type="button" className="primary-btn" onClick={handleBuyPdfReport}>
            Adquira Ja!
          </button>
        </article>
      </div>
    </section>
  );
}
