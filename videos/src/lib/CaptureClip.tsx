import React from "react";
import { Video } from "@remotion/media";
import { Freeze, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE_IN_OUT } from "./ui";

// Plays a Playwright browser capture (demos/ → videos/public/captures/<name>.webm) inside browser
// chrome, cut into segments so dead time is trimmed and slow stretches can be sped up.
// Segment times are in seconds of the *capture*; take them from <name>.marks.json.
// The last segment freezes on its final frame until the composition ends (the slide's hold).

export type CaptureSegment = {
  from: number; // capture seconds
  to: number; // capture seconds
  rate?: number; // playback speed for this segment (1 = real time)
  url?: string; // shown in the address bar while this segment plays
  label?: string; // lower-third caption while this segment plays
  /** Optional slow push-in on a point (capture pixels, 1920×1080 space). */
  zoom?: { scale: number; x: number; y: number };
};

export const captureDuration = (segments: CaptureSegment[]) =>
  segments.reduce((s, g) => s + (g.to - g.from) / (g.rate ?? 1), 0);

export const CaptureClip: React.FC<{
  src: string; // e.g. "captures/portal-inventory.webm"
  segments: CaptureSegment[];
  width?: number; // rendered width of the browser viewport area
  left?: number;
  top?: number;
  labelColor?: string;
}> = ({ src, segments, width = 1680, left, top = 40, labelColor = C.tmf }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / 1920;
  const h = 1080 * k;
  const x0 = left ?? (1920 - width) / 2;

  let acc = 0;
  const timed = segments.map((s) => {
    const dur = (s.to - s.from) / (s.rate ?? 1);
    const start = acc;
    acc += dur;
    return { ...s, start, dur };
  });
  const t = frame / fps;
  const cur = timed.find((s) => t >= s.start && t < s.start + s.dur) ?? timed[timed.length - 1];
  const url = cur.url ?? timed.slice(0, timed.indexOf(cur) + 1).reverse().find((s) => s.url)?.url ?? "";
  const label = cur.label ?? "";
  const labelIn = interpolate(t, [cur.start, cur.start + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x0,
          top,
          width,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
          border: `2px solid ${C.panelEdge}`,
          background: "#fff",
        }}
      >
        <div style={{ height: 46, background: "#E9ECF2", display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FF5F57" }} />
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FEBC2E" }} />
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#28C840" }} />
          <div
            style={{
              marginLeft: 16,
              flex: 1,
              height: 30,
              borderRadius: 15,
              background: "#fff",
              color: "#445",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              fontFamily: FONT,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {url}
          </div>
        </div>
        <div style={{ position: "relative", width, height: h, overflow: "hidden" }}>
          {timed.map((s, i) => {
            const z = s.zoom;
            const zp = z
              ? interpolate(t, [s.start, s.start + Math.min(2.5, s.dur)], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE_IN_OUT,
                })
              : 0;
            return (
              <Sequence
                key={i}
                from={Math.round(s.start * fps)}
                durationInFrames={i === timed.length - 1 ? undefined : Math.max(1, Math.round(s.dur * fps))}
                premountFor={fps}
              >
                <Freeze
                  frame={Math.max(0, Math.round(s.dur * fps) - 1)}
                  active={(f) => i === timed.length - 1 && f >= Math.round(s.dur * fps) - 1}
                >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: z ? `${z.x * k}px ${z.y * k}px` : undefined,
                    scale: z ? String(1 + (z.scale - 1) * zp) : undefined,
                  }}
                >
                  <Video
                    src={staticFile(src)}
                    trimBefore={Math.round(s.from * fps)}
                    playbackRate={s.rate ?? 1}
                    muted
                    style={{ width, height: h, display: "block" }}
                  />
                </div>
                </Freeze>
              </Sequence>
            );
          })}
        </div>
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: x0 + 24,
            top: top + 46 + h - 78,
            opacity: labelIn,
            translate: `${(1 - labelIn) * -20}px 0px`,
            padding: "12px 24px",
            borderRadius: 14,
            background: "rgba(10,15,30,0.86)",
            border: `2px solid ${labelColor}`,
            color: C.text,
            fontSize: 30,
            fontWeight: 700,
            fontFamily: FONT,
            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};
