import React from "react";
import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHUNKS, CUTS, END_CARD_START, VIDEO_DURATION } from "./data";

export type TransitionKind =
  | "zoomBlur"
  | "whipLeft"
  | "whipRight"
  | "whipUp"
  | "flash"
  | "glitch"
  | "spin"
  | "shake";

// Uma transicao diferente para cada corte, estilo CapCut.
export const CUT_TRANSITIONS: TransitionKind[] = [
  "zoomBlur",
  "whipLeft",
  "flash",
  "glitch",
  "spin",
  "whipUp",
  "zoomBlur",
  "shake",
  "whipRight",
  "glitch",
  "zoomBlur",
  "spin",
  "whipLeft",
  "flash",
  "zoomBlur",
];

const PRE = 5;
const POST = 7;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

// Momentos de "zoom punch": palavras grossas em destaque.
const PUNCHES = CHUNKS.filter((c) => /\^[^ ]+!/.test(c.text)).map((c) => ({
  s: c.s,
  e: c.e,
}));

export const VideoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;

  // Ken Burns por segmento, alternando zoom-in e zoom-out.
  const segIdx = CUTS.filter((c) => c <= t).length;
  const segStart = segIdx === 0 ? 0 : CUTS[segIdx - 1];
  const segEnd = CUTS[segIdx] ?? VIDEO_DURATION;
  const segP = Math.min(1, (t - segStart) / Math.max(0.1, segEnd - segStart));
  let scale = segIdx % 2 === 0 ? 1.0 + 0.06 * segP : 1.08 - 0.06 * segP;
  let tx = 0;
  let ty = 0;
  let rot = 0;
  let blur = 0;
  let dirBlur = 0;
  let rgbShift = 0;
  let flash = 0;

  // Zoom punch nas palavras de impacto.
  for (const p of PUNCHES) {
    const f0 = p.s * fps;
    const f1 = (p.e + 0.2) * fps;
    if (frame >= f0 - 1 && frame <= f1 + 6) {
      const inP = interpolate(frame, [f0, f0 + 4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(2)),
      });
      const outP = interpolate(frame, [f1, f1 + 6], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      scale *= 1 + 0.12 * inP * outP;
    }
  }

  // Transicoes nos cortes.
  CUTS.forEach((cut, i) => {
    const d = frame - Math.round(cut * fps);
    if (d < -PRE || d > POST) return;
    const kind = CUT_TRANSITIONS[i];
    const before = d < 0;
    const p = before
      ? ease(interpolate(d, [-PRE, 0], [0, 1]))
      : ease(interpolate(d, [0, POST], [1, 0]));
    switch (kind) {
      case "zoomBlur":
        scale *= 1 + 0.4 * p;
        blur += 16 * p;
        break;
      case "whipLeft":
      case "whipRight": {
        const dir = kind === "whipLeft" ? -1 : 1;
        tx += dir * (before ? 1 : -1) * 220 * p;
        scale *= 1 + 0.45 * p;
        dirBlur += 60 * p;
        break;
      }
      case "whipUp":
        ty += (before ? -1 : 1) * 260 * p;
        scale *= 1 + 0.45 * p;
        blur += 10 * p;
        break;
      case "flash":
        flash = Math.max(flash, before ? p * 0.6 : p);
        scale *= 1 + 0.15 * p;
        break;
      case "glitch":
        rgbShift = 26 * p;
        tx += (random(`gx${frame}`) - 0.5) * 70 * p;
        ty += (random(`gy${frame}`) - 0.5) * 30 * p;
        scale *= 1 + 0.12 * p;
        break;
      case "spin":
        rot += (before ? 1 : -1) * 14 * p;
        scale *= 1 + 0.35 * p;
        blur += 8 * p;
        break;
      case "shake":
        tx += (random(`sx${frame}`) - 0.5) * 60 * p;
        ty += (random(`sy${frame}`) - 0.5) * 60 * p;
        scale *= 1 + 0.1 * p;
        flash = Math.max(flash, p * 0.35);
        break;
    }
  });

  // Fundo do cartao final: desfoca e escurece o video.
  const endP = interpolate(t, [END_CARD_START, END_CARD_START + 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  blur += 22 * endP;
  scale *= 1 + 0.08 * endP;

  const filters = [
    "contrast(1.08) saturate(1.15) brightness(1.03)",
    blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : "",
    dirBlur > 0.5 ? "url(#dirblur)" : "",
    rgbShift > 0.5 ? "url(#rgbsplit)" : "",
    endP > 0 ? `brightness(${1 - 0.45 * endP})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const lastFrame = Math.floor(VIDEO_DURATION * fps) - 2;
  const video = (
    <OffthreadVideo
      src={staticFile("base.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="dirblur" x="-20%" y="0" width="140%" height="100%">
            <feGaussianBlur stdDeviation={`${dirBlur.toFixed(1)} 0`} />
          </filter>
          <filter id="rgbsplit" x="-10%" y="0" width="120%" height="100%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="r"
            />
            <feOffset in="r" dx={-rgbShift} dy="0" result="r2" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="g"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="b"
            />
            <feOffset in="b" dx={rgbShift} dy={rgbShift / 3} result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`,
          transformOrigin: `${width / 2}px 800px`,
          filter: filters,
        }}
      >
        {frame >= lastFrame ? <Freeze frame={lastFrame}>{video}</Freeze> : video}
      </AbsoluteFill>
      {/* Vinheta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Flash branco + light leak */}
      {flash > 0.01 ? (
        <>
          <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash * 0.85 }} />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(120deg, rgba(255,150,60,0.9), rgba(46,155,255,0.0) 55%, rgba(46,155,255,0.8))",
              mixBlendMode: "screen",
              opacity: flash,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
