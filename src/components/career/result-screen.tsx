"use client";

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
    return "Você já tem uma base sólida para avançar com consistência no plano internacional.";
  }

  if (level >= 60) {
    return "Seu cenário é positivo, com alguns ajustes pontuais para acelerar resultados.";
  }

  if (level >= 45) {
    return "Existe potencial real, mas vale fortalecer rotina, idioma e execução nas próximas semanas.";
  }

  return "Seu começo pede estrutura e foco em fundamentos antes de acelerar candidaturas.";
}

export function ResultScreen({ values, result }: ResultScreenProps) {
  function handleBuyPdfReport(): void {
    exportCareerResultPdf(values, result);
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
          <h3>Nível de prontidão</h3>
          <strong>{result.readinessLevel}%</strong>
          <div className="readiness-track" aria-hidden>
            <div
              className="readiness-fill"
              style={{ width: `${result.readinessLevel}%` }}
            />
          </div>
          <p>
            Classificação: <strong>{getReadinessLevelLabel(result.readinessLevel)}</strong>
          </p>
          <p>{getReadinessMessage(result.readinessLevel)}</p>
        </article>

        <article className="result-card countries-match-card">
          <h3>Países que mais combinam com seu estilo</h3>
          <p className="result-card-note">
            Compatibilidade estimada com base no seu perfil e na lista de países
            escolhida por você.
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
          <h3>O que você desbloqueia na assinatura</h3>
          <ul>
            <li>Plano detalhado de estudos e de carreira</li>
            <li>Relatório completo</li>
            <li>IA personalizada</li>
            <li>Bolsas de estudos e para viagens</li>
          </ul>
          <p className="plus-price">R$ 49,00/mês</p>
          <button type="button" className="primary-btn">
            Inscreva-se
          </button>
        </article>

        <article className="result-card pdf-card">
          <p className="result-kicker">Relatório Avulso</p>
          <h3>Relatório completo em PDF</h3>
          <p className="result-card-note">
            Documento completo com análise de perfil, prontidão, compatibilidade de
            países e respostas do formulário.
          </p>
          <p className="plus-price">R$ 15,90</p>
          <button type="button" className="primary-btn" onClick={handleBuyPdfReport}>
            Adquira Já!
          </button>
        </article>
      </div>
    </section>
  );
}
