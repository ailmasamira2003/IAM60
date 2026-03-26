import { z } from "zod";

export const quizSchema = z.object({
  whatsapp: z.string().min(10, "Informe um número válido com DDI e DDD."),
  nome: z.string().min(2, "Informe seu nome."),
  perfil: z.object({
    seConsideraMais: z.string(),
    prefereTrabalhar: z.string(),
    decisoes: z.string(),
  }),
  objetivos: z.object({
    maiorObjetivo: z.string(),
    ondeQuerEstarEm1Ano: z.string(),
    oQueDesejaConquistar: z.string(),
  }),
  realidadeAtual: z.object({
    horasPorDia: z.coerce.number(),
    trabalhaOuEstuda: z.string(),
    disciplina: z.coerce.number().min(0).max(10),
    jaTentouMudar: z.string(),
  }),
  dificuldades: z.object({
    principalDificuldade: z.string(),
    maiorMedo: z.string(),
    comecaENaoTermina: z.string(),
  }),
  interesses: z.object({
    tempoLivre: z.string(),
    areas: z.array(z.string()).min(1),
    semDinheiroComoProblema: z.string(),
  }),
  personalizacao: z.object({
    estiloPlano: z.string(),
  }),
});

export type QuizData = z.infer<typeof quizSchema>;

export type AIResult = {
  diagnostico: string;
  carreiras: string[];
  paises: string[];
  plano30Dias: Array<{
    semana: string;
    foco: string;
    acoes: string[];
  }>;
  rotinaDiaria: string[];
  alertas: string[];
};