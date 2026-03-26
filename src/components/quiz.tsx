"use client";

import { useState } from "react";

const initialState = {
  nome: "",
  whatsapp: "",
  perfil: {
    seConsideraMais: "",
    prefereTrabalhar: "",
    decisoes: "",
  },
  objetivos: {
    maiorObjetivo: "",
    ondeQuerEstarEm1Ano: "",
    oQueDesejaConquistar: "",
  },
  realidadeAtual: {
    horasPorDia: 1,
    trabalhaOuEstuda: "",
    disciplina: 5,
    jaTentouMudar: "",
  },
  dificuldades: {
    principalDificuldade: "",
    maiorMedo: "",
    comecaENaoTermina: "",
  },
  interesses: {
    tempoLivre: "",
    areas: [] as string[],
    semDinheiroComoProblema: "",
  },
  personalizacao: {
    estiloPlano: "",
  },
};

export function Quiz() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);

  function toggleArea(area: string) {
    setForm((prev) => ({
      ...prev,
      interesses: {
        ...prev.interesses,
        areas: prev.interesses.areas.includes(area)
          ? prev.interesses.areas.filter((item) => item !== area)
          : [...prev.interesses.areas, area],
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar formulário.");
      }

      setResult(data.result);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-[32px] border border-white/10 bg-zinc-950 p-8 text-white"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Seu nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="WhatsApp com DDI e DDD"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Criativo", "Analítico", "Prático", "Comunicativo"],
          ["Trabalhar sozinho", "Em equipe", "Liderar pessoas"],
          ["Lógica", "Emoção", "Intuição"],
        ].map((options, index) => (
          <select
            key={index}
            className="rounded-xl bg-zinc-900 p-4"
            onChange={(e) => {
              const value = e.target.value;

              if (index === 0) {
                setForm({
                  ...form,
                  perfil: { ...form.perfil, seConsideraMais: value },
                });
              }

              if (index === 1) {
                setForm({
                  ...form,
                  perfil: { ...form.perfil, prefereTrabalhar: value },
                });
              }

              if (index === 2) {
                setForm({
                  ...form,
                  perfil: { ...form.perfil, decisoes: value },
                });
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Maior objetivo"
          onChange={(e) =>
            setForm({
              ...form,
              objetivos: { ...form.objetivos, maiorObjetivo: e.target.value },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Onde quer estar em 1 ano"
          onChange={(e) =>
            setForm({
              ...form,
              objetivos: {
                ...form.objetivos,
                ondeQuerEstarEm1Ano: e.target.value,
              },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4 md:col-span-2"
          placeholder="O que deseja conquistar"
          onChange={(e) =>
            setForm({
              ...form,
              objetivos: {
                ...form.objetivos,
                oQueDesejaConquistar: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="number"
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Horas por dia"
          onChange={(e) =>
            setForm({
              ...form,
              realidadeAtual: {
                ...form.realidadeAtual,
                horasPorDia: Number(e.target.value),
              },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Você trabalha ou estuda atualmente?"
          onChange={(e) =>
            setForm({
              ...form,
              realidadeAtual: {
                ...form.realidadeAtual,
                trabalhaOuEstuda: e.target.value,
              },
            })
          }
        />
        <input
          type="number"
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Disciplina de 0 a 10"
          onChange={(e) =>
            setForm({
              ...form,
              realidadeAtual: {
                ...form.realidadeAtual,
                disciplina: Number(e.target.value),
              },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Já tentou mudar de vida antes?"
          onChange={(e) =>
            setForm({
              ...form,
              realidadeAtual: {
                ...form.realidadeAtual,
                jaTentouMudar: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="O que mais te atrapalha hoje?"
          onChange={(e) =>
            setForm({
              ...form,
              dificuldades: {
                ...form.dificuldades,
                principalDificuldade: e.target.value,
              },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4"
          placeholder="Qual seu maior medo?"
          onChange={(e) =>
            setForm({
              ...form,
              dificuldades: {
                ...form.dificuldades,
                maiorMedo: e.target.value,
              },
            })
          }
        />
        <input
          className="rounded-xl bg-zinc-900 p-4 md:col-span-2"
          placeholder="O que você sempre começa e não termina?"
          onChange={(e) =>
            setForm({
              ...form,
              dificuldades: {
                ...form.dificuldades,
                comecaENaoTermina: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-4">
        <input
          className="w-full rounded-xl bg-zinc-900 p-4"
          placeholder="O que você gosta de fazer no tempo livre?"
          onChange={(e) =>
            setForm({
              ...form,
              interesses: { ...form.interesses, tempoLivre: e.target.value },
            })
          }
        />

        <div className="flex flex-wrap gap-3">
          {["Tecnologia", "Negócios", "Arte", "Saúde", "Comunicação"].map(
            (area) => (
              <button
                type="button"
                key={area}
                onClick={() => toggleArea(area)}
                className={`rounded-full px-4 py-2 ${
                  form.interesses.areas.includes(area)
                    ? "bg-violet-600"
                    : "bg-zinc-800"
                }`}
              >
                {area}
              </button>
            )
          )}
        </div>

        <input
          className="w-full rounded-xl bg-zinc-900 p-4"
          placeholder="Se dinheiro não fosse problema, o que você faria?"
          onChange={(e) =>
            setForm({
              ...form,
              interesses: {
                ...form.interesses,
                semDinheiroComoProblema: e.target.value,
              },
            })
          }
        />
      </div>

      <select
        className="w-full rounded-xl bg-zinc-900 p-4"
        defaultValue=""
        onChange={(e) =>
          setForm({
            ...form,
            personalizacao: { estiloPlano: e.target.value },
          })
        }
      >
        <option value="" disabled>
          Você prefere um plano...
        </option>
        <option value="Rápido e intenso">Rápido e intenso</option>
        <option value="Equilibrado">Equilibrado</option>
        <option value="Leve e gradual">Leve e gradual</option>
      </select>

      <button
        disabled={loading}
        className="w-full rounded-full bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
      >
        {loading ? "Analisando..." : "Receber resultado"}
      </button>

      {message ? <p className="text-center text-zinc-300">{message}</p> : null}
      {message ? <p className="text-center text-zinc-300">{message}</p> : null}

{result && (
  <div className="mt-10 space-y-6 rounded-2xl bg-zinc-900 p-6">
    <h2 className="text-2xl font-bold text-violet-400">
      Seu plano personalizado
    </h2>

    <p>{result.diagnostico}</p>

    <div>
      <h3 className="font-semibold text-violet-300">Carreiras:</h3>
      <ul className="list-disc ml-5">
        {result.carreiras.map((c: string, i: number) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="font-semibold text-violet-300">Países:</h3>
      <ul className="list-disc ml-5">
        {result.paises.map((p: string, i: number) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  </div>
)}
    </form>
  );
}
