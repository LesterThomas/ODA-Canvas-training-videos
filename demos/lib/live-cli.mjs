// Record a live terminal session: run real commands that change the demo cluster (helm install,
// newman, curl, helm uninstall) and save each command with its real output for the Remotion
// <Terminal> component. The format matches demos/cli/capture-cli.mjs, plus "live": true.
//
// Only use this for actions the user has approved for a demo. Read-only sessions belong in
// capture-cli.mjs. Never invent or edit output: what is saved is exactly what the command printed
// (tabs expanded, trailing whitespace and ANSI colour codes stripped).
//
// Commands run in Git Bash, so they read the same on screen as in the user's own terminal.
import { exec, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { OUT_DIR } from "./capture.mjs";

const BASH = process.env.DEMO_BASH ?? "C:/Program Files/Git/bin/bash.exe";

const clean = (s) =>
  s
    .replace(/\x1b\[[0-9;]*[A-Za-z]/g, "")
    .replace(/\t/g, "    ")
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");

/** Run one command in Git Bash and resolve with {cmd, output, exitCode}. */
export function run(cmd, { cwd } = {}) {
  return new Promise((resolve) => {
    exec(cmd, { cwd, shell: BASH, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" }, maxBuffer: 64 << 20 }, (err, stdout, stderr) => {
      const output = clean(`${stdout ?? ""}${stderr ?? ""}`);
      resolve({ cmd, output, exitCode: err ? (err.code ?? 1) : 0 });
    });
  });
}

/** Poll a command until its output matches `re` (not recorded). Throws after `timeoutMs`. */
export async function waitFor(cmd, re, { cwd, timeoutMs = 300000, everyMs = 3000, label = cmd } = {}) {
  const t0 = Date.now();
  for (;;) {
    const r = await run(cmd, { cwd });
    if (re.test(r.output)) return r;
    if (Date.now() - t0 > timeoutMs) throw new Error(`timed out waiting for ${label}: last output\n${r.output}`);
    await new Promise((ok) => setTimeout(ok, everyMs));
  }
}

/**
 * Run a named session. `steps` is a list of commands (recorded) and {wait: async () => …}
 * entries (run, not recorded). Returns the recorded steps and writes <name>.cli.json.
 */
export async function recordSession(name, steps, { cwd } = {}) {
  const recorded = [];
  for (const s of steps) {
    if (typeof s === "string") {
      const r = await run(s, { cwd });
      console.log(`$ ${r.cmd}\n${r.output}\n${r.exitCode ? `(exit ${r.exitCode})\n` : ""}`);
      recorded.push({ ...r, at: new Date().toISOString() });
      if (r.exitCode) throw new Error(`${name}: "${s}" failed with exit ${r.exitCode}`);
    } else if (s.wait) {
      await s.wait();
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, `${name}.cli.json`),
    JSON.stringify(
      {
        name,
        live: true,
        capturedAt: new Date().toISOString(),
        context: execSync("kubectl config current-context", { encoding: "utf8" }).trim(),
        cwd: cwd ? path.basename(cwd) : undefined,
        steps: recorded,
      },
      null,
      1,
    ),
  );
  console.log(`saved ${name}.cli.json (${recorded.length} commands)`);
  return recorded;
}
