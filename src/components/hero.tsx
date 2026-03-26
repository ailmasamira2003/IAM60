type HeroProps = {
  onStart: () => void;
};

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black px-8 py-20 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.35),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(109,40,217,0.35),_transparent_30%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-violet-300">
          AI Career System
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-none md:text-7xl">
          Seu próximo passo para uma carreira internacional
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Descubra carreiras, países e um plano de estudos realista com base no
          seu perfil.
        </p>

        <button
          onClick={onStart}
          className="mt-10 rounded-full bg-violet-600 px-8 py-4 text-lg font-semibold transition hover:bg-violet-500"
        >
          Começar agora
        </button>
      </div>
    </section>
  );
}