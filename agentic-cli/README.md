## Hyperplex Agentic CLI

This project delivers a production-ready, multi-agent command hub inspired by the latest wave of agentic CLIs. It ships as a fully client-rendered [Next.js](https://nextjs.org) experience designed to deploy cleanly on Vercel.

### Feature Set

- **Autonomous mission runner** — launch `run <task>` with priority, deliverable, and agent overrides.
- **Stack orchestration** — queue, inspect, and flush mission backlogs with `stack` commands.
- **Agent swarm visibility** — inspect roles, strengths, and availability through `agents`.
- **Plugin catalogue** — discover the active toolchain via `tools`.
- **Telemetry snapshot** — live stats for mission count, average crew size, and queue depth.

### Commands Cheat Sheet

```text
help                · Overview of the command surface
run <task> [flags] · Launch an agentic mission (flags: --priority, --deliverable, --agents)
stack add <task>   · Queue work for later execution
stack list/run     · Inspect or trigger queued missions
agents             · View the active swarm roster
tools              · List the plugin toolkit across stages
history            · See recent mission outcomes
clear              · Reset the terminal feed
```

### Local Development

```bash
npm install
npm run dev
```

The app boots on [http://localhost:3000](http://localhost:3000) and auto-refreshes as you iterate.

### Production Build

```bash
npm run build
npm run start
```

### Deployment

The project targets Vercel. You can deploy straight from the workspace with:

```bash
vercel deploy --prod --yes --name agentic-cli
```

Make sure the `VERCEL_TOKEN` environment variable is available in your shell session.
