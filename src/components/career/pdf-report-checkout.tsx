"use client";

import { FormEvent, useState } from "react";
import type { PlusSubscriber } from "@/lib/plus-content";
import { exportCareerResultPdf } from "@/services/pdf-service";
import type { CareerFormValues, CareerResult } from "@/types/career";

type PdfReportCheckoutProps = {
  values: CareerFormValues;
  result: CareerResult;
  onBack: () => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasFullName(value: string): boolean {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length >= 2;
}

function sanitizeCpf(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpf(value: string): boolean {
  const cpf = sanitizeCpf(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(cpf[index]) * (10 - index);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10) {
    remainder = 0;
  }

  if (remainder !== Number(cpf[9])) {
    return false;
  }

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(cpf[index]) * (11 - index);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) {
    remainder = 0;
  }

  return remainder === Number(cpf[10]);
}

function isValidBirthDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const birthDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return birthDate <= today && birthDate.getFullYear() >= 1900;
}

export function PdfReportCheckout({
  values,
  result,
  onBack,
}: PdfReportCheckoutProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [formError, setFormError] = useState("");
  const [downloadStarted, setDownloadStarted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setDownloadStarted(false);

    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCpf = sanitizeCpf(cpf);

    if (!hasFullName(normalizedFullName)) {
      setFormError("Informe nome e sobrenome para liberar o relatorio.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFormError("Informe um e-mail valido para continuar.");
      return;
    }

    if (!isValidCpf(normalizedCpf)) {
      setFormError("Informe um CPF valido com 11 digitos.");
      return;
    }

    if (!isValidBirthDate(birthDate)) {
      setFormError("Informe uma data de nascimento valida.");
      return;
    }

    setFormError("");
    setDownloadStarted(true);

    const customer: PlusSubscriber = {
      fullName: normalizedFullName,
      email: normalizedEmail,
      cpf: normalizedCpf,
      birthDate,
    };

    exportCareerResultPdf(values, result, customer);
  }

  return (
    <section className="plus-shell">
      <div className="plus-topbar">
        <button type="button" className="ghost-btn plus-back-btn" onClick={onBack}>
          Voltar ao resultado
        </button>
        <span className="plus-status">Relatorio avulso demonstrativo</span>
      </div>

      <div className="plus-access-grid">
        <article className="plus-access-copy">
          <p className="result-kicker">Relatorio Avulso</p>
          <h2>Finalize os dados para obter seu PDF completo</h2>
          <p>
            Preencha os dados abaixo para liberar o mesmo relatorio completo da
            experiencia premium, com analise de perfil, metricas e plano inicial.
          </p>

          <div className="plus-access-points">
            <div className="plus-access-point">
              <strong>Documento completo</strong>
              <span>Analise de perfil, prontidao, compatibilidade e respostas do formulario.</span>
            </div>
            <div className="plus-access-point">
              <strong>Metricas demonstrativas</strong>
              <span>Percentuais de idioma, rotina, clareza de objetivo e fit internacional.</span>
            </div>
            <div className="plus-access-point">
              <strong>Plano inicial</strong>
              <span>Roadmap em dias com proximas acoes para candidatura internacional.</span>
            </div>
            <div className="plus-access-point">
              <strong>Download imediato</strong>
              <span>Ao enviar o formulario, o PDF e baixado no mesmo instante.</span>
            </div>
          </div>
        </article>

        <form className="plus-access-card" onSubmit={handleSubmit}>
          <p className="result-kicker">Dados para emissao</p>
          <h3>Complete o formulario do relatorio</h3>
          <p className="result-card-note">
            Este fluxo e demonstrativo e usa os dados abaixo apenas para montar
            o download do seu relatorio em PDF.
          </p>

          <label className="plus-field">
            <span>Nome completo</span>
            <input
              type="text"
              className="text-field"
              placeholder="Exemplo: Ana Souza"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="plus-field">
            <span>E-mail</span>
            <input
              type="email"
              className="text-field"
              placeholder="ana@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <div className="plus-inline-fields">
            <label className="plus-field">
              <span>CPF</span>
              <input
                type="text"
                inputMode="numeric"
                className="text-field"
                placeholder="00000000000"
                value={cpf}
                onChange={(event) => setCpf(event.target.value)}
                autoComplete="off"
              />
            </label>

            <label className="plus-field">
              <span>Data de nascimento</span>
              <input
                type="date"
                className="text-field"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                autoComplete="bday"
              />
            </label>
          </div>

          {formError ? <p className="error-message">{formError}</p> : null}
          {downloadStarted ? (
            <p className="result-card-note">
              Se o navegador permitir, o download do PDF ja foi iniciado.
            </p>
          ) : null}

          <div className="plus-access-actions">
            <button type="submit" className="primary-btn">
              Obter o meu Relatorio Completo!
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
