import React from "react";
import { C } from "../theme";

/** Canvas "base plate" that components click onto. */
export const Plate: React.FC<{ w?: number; label?: string; fontSize?: number; style?: React.CSSProperties }> = ({
  w = 720,
  label = "ODA Canvas",
  fontSize,
  style,
}) => (
  <div
    style={{
      width: w,
      height: w * 0.14,
      borderRadius: 16,
      background: `linear-gradient(180deg, ${C.canvas} 0%, #1E4FB8 100%)`,
      boxShadow: `0 0 80px ${C.canvas}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fontSize ?? w * 0.05,
      fontWeight: 800,
      letterSpacing: 2,
      color: C.text,
      ...style,
    }}
  >
    {label}
  </div>
);
