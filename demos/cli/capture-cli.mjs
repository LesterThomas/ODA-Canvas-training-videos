// Run real helm/kubectl commands against the demo cluster and save their output for the Remotion
// <Terminal> component, which types each command and reveals its real output.
// Usage (from repo root): node demos/cli/capture-cli.mjs <session>      (sessions defined below)
// Output: videos/public/captures/<session>.cli.json
//
// Only read-only commands belong here (get, list, describe). Never print secrets.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { OUT_DIR } from "../lib/capture.mjs";

export const SESSIONS = {
  // Slide "The Canvas as a set of operators": the operators running in the canvas namespace.
  "cli-operators": [
    "kubectl get deployments -n canvas",
  ],
  // Slide "Deploying a component": what the operators created for release r1.
  "cli-deploy": [
    "helm list -n components",
    "kubectl get components -n components",
    "kubectl get exposedapis -n components",
  ],
};

const name = process.argv[2];
if (!SESSIONS[name]) {
  console.error(`unknown session ${name}; one of: ${Object.keys(SESSIONS).join(", ")}`);
  process.exit(1);
}
const steps = SESSIONS[name].map((cmd) => {
  let output = "";
  let exitCode = 0;
  try {
    output = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, NO_COLOR: "1" } });
  } catch (e) {
    output = `${e.stdout ?? ""}${e.stderr ?? ""}`;
    exitCode = e.status ?? 1;
  }
  // Normalise: tabs → spaces, strip trailing whitespace, drop the trailing blank line.
  output = output.replace(/\t/g, "    ").split(/\r?\n/).map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
  console.log(`$ ${cmd}\n${output}\n`);
  return { cmd, output, exitCode };
});
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, `${name}.cli.json`),
  JSON.stringify({ name, capturedAt: new Date().toISOString(), context: execSync("kubectl config current-context", { encoding: "utf8" }).trim(), steps }, null, 1),
);
