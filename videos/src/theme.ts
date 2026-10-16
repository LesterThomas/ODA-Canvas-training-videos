import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const FONT = inter.fontFamily;
export const MONO = mono.fontFamily;

// Shared palette for every ODA Canvas training video.
// One colour per recurring concept, used identically in every scene and deck.
export const C = {
  bg: "#0A0F1E",
  bgGlow: "#16203A",
  panel: "#111A30",
  panelEdge: "#24314F",
  grid: "#1A2440",
  text: "#F2F5FB",
  muted: "#8F9BB8",
  faint: "#4A5675",
  tmf: "#E6007E", // TM Forum magenta (portal logo mark)

  component: "#F5A623", // ODA Component (matches the portal's TMF hexagons)
  canvas: "#2F6FED", // ODA Canvas base plate
  operator: "#1FC7A8", // Canvas operators
  api: "#8B6CFF", // API management / gateways
  identity: "#FF6B6B", // Identity & access
  observability: "#38BDF8", // Observability
  secrets: "#E9C46A", // Secrets
  events: "#A3E635", // Events
  ai: "#F472B6", // AI-native
  carbon: "#34D399", // Carbon
  cost: "#FB923C", // Cost
  agent: "#F8FAFC", // Agentic components are drawn white (ODA convention)
  danger: "#F43F5E",
  ok: "#22C55E",
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
