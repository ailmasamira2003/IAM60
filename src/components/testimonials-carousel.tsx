"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  username: string;
  headline: string;
  comment: string;
  outcome: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    username: "@lara.costa.dev",
    headline: "Clareza total do meu próximo passo",
    comment:
      "Eu estava perdida entre vários países e cursos. Em poucos minutos entendi qual rota fazia mais sentido e consegui organizar um plano que finalmente parecia executável.",
    outcome: "5.0/5 em clareza de direcionamento",
  },
  {
    username: "@bruno.melo.global",
    headline: "O plano ficou muito mais realista",
    comment:
      "O que eu mais gostei foi a sensação de mapa. Em vez de um monte de dicas soltas, recebi uma sequência de ações que eu realmente conseguiria seguir sem me sobrecarregar.",
    outcome: "5.0/5 em utilidade pratica",
  },
  {
    username: "@nina.studyabroad",
    headline: "A parte das bolsas foi o diferencial",
    comment:
      "Ver bolsas relacionadas aos países que eu escolhi deixou tudo muito mais concreto. Para uma demonstração, a experiência passou muita confiança e valor de produto premium.",
    outcome: "5.0/5 em valor percebido",
  },
  {
    username: "@caioreis.analytics",
    headline: "Parece uma mentoria organizada em tela",
    comment:
      "A interface conseguiu transformar meu perfil em próximas ações. O relatório e o chat demo ajudam bastante a vender a ideia de acompanhamento personalizado.",
    outcome: "4.9/5 em experiencia geral",
  },
  {
    username: "@amanda.viajante",
    headline: "Bonito, objetivo e fácil de entender",
    comment:
      "Eu curti porque não ficou com cara de formulário frio. A página passa uma energia premium e os comentários, plano e relatório deixam a jornada bem mais envolvente.",
    outcome: "5.0/5 em apresentação do produto",
  },
];

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 4800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  function goToSlide(index: number): void {
    setActiveIndex(index);
  }

  function goToPrevious(): void {
    setActiveIndex((current) =>
      current === 0 ? TESTIMONIALS.length - 1 : current - 1
    );
  }

  function goToNext(): void {
    setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
  }

  return (
    <section className="testimonials-shell" aria-labelledby="testimonials-title">
      <div className="testimonials-head">
        <p className="result-kicker">Comentários em destaque</p>
        <h2 id="testimonials-title">Quem conhece a AILA sente mais clareza para agir</h2>
        <p>
          Comentários demonstrativos com feedbacks positivos para reforçar a
          percepção de valor logo na primeira tela.
        </p>
      </div>

      <div className="testimonials-carousel">
        <button
          type="button"
          className="ghost-btn testimonials-arrow"
          onClick={goToPrevious}
          aria-label="Comentário anterior"
        >
          Anterior
        </button>

        <div className="testimonials-viewport">
          <div
            className="testimonials-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.username} className="testimonial-card">
                <div className="testimonial-rating-row">
                  <span className="testimonial-rating-pill">Avaliação premium</span>
                  <strong>{testimonial.outcome}</strong>
                </div>
                <h3>{testimonial.headline}</h3>
                <p>{testimonial.comment}</p>
                <footer className="testimonial-footer">
                  <span>{testimonial.username}</span>
                  <span>Experiência demonstrativa</span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="ghost-btn testimonials-arrow"
          onClick={goToNext}
          aria-label="Próximo comentário"
        >
          Próximo
        </button>
      </div>

      <div className="testimonials-dots" aria-label="Seletor de comentários">
        {TESTIMONIALS.map((testimonial, index) => (
          <button
            key={testimonial.username}
            type="button"
            className={`testimonial-dot ${
              index === activeIndex ? "testimonial-dot-active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para comentário ${index + 1}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
