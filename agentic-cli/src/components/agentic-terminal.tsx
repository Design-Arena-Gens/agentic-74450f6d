"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AgentEngine,
  EngineEvent,
  EngineSnapshot,
  EngineEventType,
} from "@/lib/agent-engine";
import { cn } from "@/lib/utils";

const typeAccent: Record<EngineEventType, string> = {
  input: "text-zinc-200",
  system: "text-cyan-300",
  agent: "text-emerald-300",
  tool: "text-sky-300",
  result: "text-amber-300",
  warning: "text-orange-300",
  error: "text-rose-400",
  divider: "text-zinc-700",
};

const typeBorder: Partial<Record<EngineEventType, string>> = {
  agent: "border-l-2 border-emerald-500/40 pl-4",
  tool: "border-l-2 border-sky-500/40 pl-4",
  result: "border-l-2 border-amber-500/40 pl-4",
  warning: "border-l-2 border-orange-500/40 pl-4",
  error: "border-l-2 border-rose-500/40 pl-4",
};

const suggestionCatalog = [
  {
    label: "Autopilot onboarding flow",
    command: "run build frictionless onboarding --priority=high --deliverable=plan",
  },
  {
    label: "Inspect agent swarm",
    command: "agents",
  },
  {
    label: "Queue growth experiments",
    command: "stack add growth experiments roadmap",
  },
  {
    label: "Review recent wins",
    command: "history",
  },
  {
    label: "Plugin surface",
    command: "tools",
  },
];

type TerminalLine = EngineEvent & { timestamp: number };

const renderContent = (content?: string) => {
  if (!content) return null;
  return content.split("\n").map((line, index) => (
    <span key={`${line}-${index}`} className="block whitespace-pre-wrap">
      {line}
    </span>
  ));
};

const formatHeadline = (event: TerminalLine) => {
  if (event.type === "input") {
    return `$ ${event.content ?? ""}`;
  }
  return event.headline ?? event.content ?? "";
};

const animatedCursor = (
  <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded bg-emerald-300" />
);

export function AgenticTerminal() {
  const engine = useMemo(() => new AgentEngine(), []);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: crypto.randomUUID(),
      type: "system",
      headline: "Hyperplex \u00B7 Agentic CLI",
      content: "Booting swarm orchestration layer...",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      type: "system",
      content:
        "Type `help` to view commands · Ships with autoplan, stack queue, and telemetry",
      timestamp: Date.now(),
    },
  ]);
  const [snapshot, setSnapshot] = useState<EngineSnapshot>(engine.getSnapshot());
  const [command, setCommand] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
  const [suggestions, setSuggestions] = useState(suggestionCatalog.slice(0, 3));
  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  useEffect(() => {
    const rotation = Math.floor(Math.random() * suggestionCatalog.length);
    setSuggestions([
      suggestionCatalog[rotation % suggestionCatalog.length],
      suggestionCatalog[(rotation + 1) % suggestionCatalog.length],
      suggestionCatalog[(rotation + 2) % suggestionCatalog.length],
    ]);
  }, [lines.length]);

  const pushLine = (event: EngineEvent) => {
    setLines((prev) => [
      ...prev,
      {
        ...event,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleCommand = async (value: string) => {
    if (!value.trim() || isRunning) return;

    const id = crypto.randomUUID();
    setLines((prev) => [
      ...prev,
      {
        id,
        type: "input",
        content: value,
        timestamp: Date.now(),
      },
    ]);

    setCommand("");
    setHistory((prev) => [value, ...prev].slice(0, 30));
    historyIndexRef.current = null;
    setIsRunning(true);

    try {
      for await (const event of engine.execute(value)) {
        if (event.type === "system" && event.content === "__CLEAR__") {
          setLines([]);
          continue;
        }
        pushLine(event);
      }
      setSnapshot(engine.getSnapshot());
    } catch (error) {
      pushLine({
        id: crypto.randomUUID(),
        type: "error",
        headline: "Runtime failure",
        content:
          error instanceof Error
            ? error.message
            : "Unknown error encountered while processing command.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCommand(command);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const prev = historyIndexRef.current;
      const nextIndex =
        prev === null ? 0 : Math.min(prev + 1, history.length - 1);
      historyIndexRef.current = nextIndex;
      setCommand(history[nextIndex] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      const prev = historyIndexRef.current;
      if (prev === null) return;
      if (prev === 0) {
        historyIndexRef.current = null;
        setCommand("");
        return;
      }
      const nextIndex = prev - 1;
      historyIndexRef.current = nextIndex;
      setCommand(history[nextIndex] ?? "");
    }
  };

  const statusPill = isRunning ? "Autopilot engaged" : "Idle";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-200 shadow-lg shadow-emerald-500/5 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center">
            <span
              className={cn(
                "h-3 w-3 rounded-full",
                isRunning ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
              )}
            />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
              Agentic Stack
            </p>
            <p className="font-mono text-sm text-zinc-100">{statusPill}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">
              Missions
            </p>
            <p className="font-mono text-sm text-zinc-100">
              {snapshot.stats.missions.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">
              Avg Agents
            </p>
            <p className="font-mono text-sm text-zinc-100">
              {snapshot.stats.avgAgents.toFixed(1)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">
              Stack
            </p>
            <p className="font-mono text-sm text-zinc-100">
              {snapshot.stack.length.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl shadow-emerald-500/5 backdrop-blur">
          <div
            ref={feedRef}
            className="h-[420px] space-y-4 overflow-y-auto px-6 py-6 font-mono text-sm text-zinc-100"
          >
            {lines.map((line) => (
              <div
                key={line.id}
                className={cn(
                  "space-y-1",
                  typeBorder[line.type] ?? ""
                )}
              >
                <p className={cn("font-semibold", typeAccent[line.type])}>
                  {formatHeadline(line)}
                </p>
                {line.type !== "divider" && line.type !== "input" ? (
                  <div className="text-xs leading-relaxed text-zinc-300">
                    {renderContent(line.content)}
                  </div>
                ) : null}
                {line.type === "divider" ? (
                  <div className="text-xs uppercase tracking-[0.5em] text-zinc-600">
                    {line.content}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 bg-zinc-900/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-500">$</span>
              <input
                ref={inputRef}
                className="flex-1 bg-transparent font-mono text-sm text-emerald-100 placeholder:text-zinc-600 focus:outline-none"
                placeholder="run ship onboarding autopilot --priority=high"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
              />
              {isRunning ? animatedCursor : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {suggestions.map((item) => (
                <button
                  key={item.command}
                  type="button"
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-100 transition hover:bg-emerald-500/20"
                  onClick={() => {
                    setCommand(item.command);
                    inputRef.current?.focus();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-zinc-200 backdrop-blur">
            <p className="font-semibold text-emerald-200">Active agents</p>
            <ul className="mt-3 space-y-3">
              {snapshot.agents.map((agent) => (
                <li key={agent.id} className="space-y-1">
                  <p className="font-mono text-sm text-zinc-100">
                    {agent.avatar} {agent.name}
                  </p>
                  <p className="text-[11px] text-zinc-400">{agent.role}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-zinc-200 backdrop-blur">
            <p className="font-semibold text-emerald-200">Recent missions</p>
            <ul className="mt-3 space-y-2">
              {snapshot.missionHistory.length ? (
                snapshot.missionHistory.map((mission) => (
                  <li key={mission.id} className="space-y-1">
                    <p className="font-mono text-xs text-zinc-100">
                      {mission.task}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {mission.priority.toUpperCase()} · {mission.deliverable}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-[11px] text-zinc-400">
                  Missions will appear here after first run.
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AgenticTerminal;
