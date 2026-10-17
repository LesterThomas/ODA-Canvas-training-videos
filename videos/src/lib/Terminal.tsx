import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO } from "../theme";

// Animated terminal that replays *real* command output captured by demos/cli/capture-cli.mjs
// (videos/public/captures/<session>.cli.json). Each command is typed, then its output appears.

export type CliStep = { cmd: string; output: string; exitCode?: number };
export type CliSession = { name: string; capturedAt?: string; context?: string; steps: CliStep[] };

export const Terminal: React.FC<{
  session: CliSession;
  /** Seconds (composition time) at which each command starts typing. Defaults to back-to-back. */
  starts?: number[];
  at?: number;
  cps?: number; // typing speed, characters per second
  fontSize?: number;
  width?: number;
  height?: number;
  title?: string;
  /** Highlight output lines containing these strings (e.g. a release name). */
  highlight?: string[];
  style?: React.CSSProperties;
}> = ({ session, starts, at = 0, cps = 32, fontSize = 20, width = 1500, height = 560, title, highlight = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lh = fontSize * 1.45;

  // Default schedule: type, pause 0.35 s, reveal output over 0.5 s, hold 1.4 s, next.
  const sched: number[] = [];
  let cursor = at;
  session.steps.forEach((s, i) => {
    const st = starts?.[i] ?? cursor;
    sched.push(st);
    cursor = st + s.cmd.length / cps + 0.35 + 0.5 + 1.4;
  });

  const lines: { text: string; kind: "prompt" | "out"; hl: boolean }[] = [];
  session.steps.forEach((s, i) => {
    const st = sched[i];
    if (t < st) return;
    const typed = Math.min(s.cmd.length, Math.floor((t - st) * cps));
    const doneTyping = st + s.cmd.length / cps;
    lines.push({ text: s.cmd.slice(0, typed), kind: "prompt", hl: false });
    if (t >= doneTyping + 0.35) {
      const out = s.output.split("\n");
      const shown = Math.ceil(
        out.length * interpolate(t, [doneTyping + 0.35, doneTyping + 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      );
      out.slice(0, shown).forEach((l) => lines.push({ text: l, kind: "out", hl: highlight.some((h) => h && l.includes(h)) }));
    }
  });

  const maxLines = Math.floor((height - 70) / lh);
  const visible = lines.slice(Math.max(0, lines.length - maxLines));
  const blink = Math.floor(t * 2) % 2 === 0;
  const lastIsTyping = lines.length > 0 && lines[lines.length - 1].kind === "prompt";

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        background: "#0B1020",
        border: `2px solid ${C.panelEdge}`,
        boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
        overflow: "hidden",
        fontFamily: MONO,
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 18px",
          background: "#151C30",
          borderBottom: `2px solid ${C.panelEdge}`,
          color: C.muted,
          fontSize: 18,
        }}
      >
        <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: 7, background: "#28C840" }} />
        <span style={{ marginLeft: 14 }}>{title ?? `Terminal · ${session.context ?? "kubectl"}`}</span>
      </div>
      <div style={{ padding: "12px 22px" }}>
        {visible.map((l, i) => (
          <div
            key={i}
            style={{
              height: lh,
              lineHeight: `${lh}px`,
              fontSize,
              whiteSpace: "pre",
              overflow: "hidden",
              color: l.kind === "prompt" ? C.text : l.hl ? C.ok : "#C8D0E4",
              background: l.hl ? `${C.ok}1A` : undefined,
            }}
          >
            {l.kind === "prompt" ? (
              <>
                <span style={{ color: C.operator, fontWeight: 600 }}>$ </span>
                {l.text}
                {i === visible.length - 1 && lastIsTyping && blink ? <span style={{ color: C.operator }}>▋</span> : null}
              </>
            ) : (
              l.text || " "
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
