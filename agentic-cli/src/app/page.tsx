import AgenticTerminal from "@/components/agentic-terminal";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#020106] font-sans text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-16 px-6 pb-24 pt-24 sm:px-10 lg:px-16">
        <section className="max-w-3xl space-y-6">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs tracking-[0.35em] text-emerald-200">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            LIVE AUTOPILOT
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Agentic CLI built for founders shipping at Vercel speed.
          </h1>
          <p className="text-lg text-zinc-300 sm:text-xl">
            Orchestrate multi-agent workflows, stack missions, and ship production-ready artefacts from a single high-trust terminal. No copy-paste chaos, just autonomous delivery.
          </p>
        </section>

        <AgenticTerminal />
      </main>
    </div>
  );
}
