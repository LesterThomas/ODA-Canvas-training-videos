import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import { Appear, Caption, EASE, Heading, Icon, IconName, Pill, Stage, useT } from "../lib/ui";

const PILLARS: { label: string; sub: string; icon: IconName; color: string; at: number }[] = [
  { label: "Customer experience", sub: "Zero touch, zero wait, zero trouble", icon: "smile", color: C.tmf, at: 7.0 },
  { label: "Simplicity", sub: "Hundreds of ops teams → one SRE team", icon: "people", color: C.canvas, at: 11.2 },
  { label: "Innovation", sub: "Agility, faster AI-native adoption", icon: "spark", color: C.ai, at: 18.6 },
  { label: "Operational efficiency", sub: "Integration fully automated", icon: "bolt", color: C.operator, at: 22.6 },
  { label: "Security", sub: "Zero trust, security as code", icon: "shield", color: C.identity, at: 25.4 },
  { label: "Technical debt", sub: "Continuous upgrade of every component", icon: "wrench", color: C.component, at: 29.6 },
];

// Slide 13 — Six benefits
export const S13Benefits: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="Benefits" title="Why ODA Components and Canvas?" />
      <Appear at={2.0} from="up" style={{ left: 120, top: 245 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {["Service providers", "Software vendors", "Systems integrators", "Cloud providers"].map((s) => (
            <Pill key={s} color={C.muted} fontSize={26}>
              {s}
            </Pill>
          ))}
        </div>
      </Appear>
      {PILLARS.map((p, i) => {
        const g = interpolate(t, [p.at, p.at + 1.1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
        const colH = 600;
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: 110 + i * 285,
              top: 340 + colH * (1 - g),
              width: 272,
              height: colH * g,
              borderRadius: "22px 22px 0 0",
              background: `linear-gradient(180deg, ${p.color}40 0%, ${p.color}08 100%)`,
              borderTop: `6px solid ${p.color}`,
              overflow: "hidden",
              opacity: g,
            }}
          >
            <div style={{ padding: "34px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              <Icon name={p.icon} size={80} color={p.color} />
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>{p.label}</div>
              <div style={{ fontSize: 27, color: C.muted, lineHeight: 1.35 }}>{p.sub}</div>
            </div>
          </div>
        );
      })}
    </Stage>
  );
};

// Slide 14 — An order-of-magnitude goal
export const S14TenX: React.FC = () => {
  const t = useT();
  const small = interpolate(t, [0.8, 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const big = interpolate(t, [3.8, 6.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const base = 760;
  return (
    <Stage glow="#2A1534">
      <Heading kicker="Benefits" title="Not incremental — an order of magnitude" />
      <div style={{ position: "absolute", left: 260, top: 940, width: 1400, height: 4, background: C.panelEdge }} />
      <div
        style={{
          position: "absolute",
          left: 460,
          top: 940 - 0.13 * base * small,
          width: 300,
          height: 0.13 * base * small,
          background: C.muted,
          borderRadius: "12px 12px 0 0",
        }}
      />
      <Appear at={1.6} from="up" style={{ left: 460, top: 940 - 0.13 * base - 80, width: 300 }}>
        <div style={{ textAlign: "center", fontSize: 54, fontWeight: 800, color: C.muted }}>+30%</div>
      </Appear>
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 940 - 0.78 * base * big,
          width: 380,
          height: 0.78 * base * big,
          background: `linear-gradient(180deg, ${C.tmf} 0%, ${C.ai}88 100%)`,
          borderRadius: "16px 16px 0 0",
          boxShadow: `0 0 80px ${C.tmf}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1060,
          width: 380,
          top: 940 - 0.78 * base * big + 30,
          textAlign: "center",
          fontSize: 150,
          fontWeight: 800,
          opacity: big,
        }}
      >
        10×
      </div>
      <Appear at={6.0} from="left" style={{ left: 1480, top: 420 }}>
        <div style={{ fontSize: 34, color: C.text, fontWeight: 700, width: 360, lineHeight: 1.3 }}>
          efficiency
          <br />& agility
        </div>
      </Appear>
      <Caption at={8.6} bottom={40} color={C.ai}>
        … and a faster transformation to an AI-native telco
      </Caption>
    </Stage>
  );
};
