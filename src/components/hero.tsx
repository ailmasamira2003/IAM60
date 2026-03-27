type HeroProps = {
  onStart: () => void;
};

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="rounded-2xl border border-white/20 bg-black/30 p-6 text-white">
      <h1 className="text-3xl font-bold">AILA</h1>
      <p className="mt-3 text-white/80">Versão de introdução legada.</p>
      <button
        type="button"
        onClick={onStart}
        className="mt-4 rounded-full bg-cyan-500 px-5 py-2 font-medium text-black"
      >
        Iniciar
      </button>
    </section>
  );
}
