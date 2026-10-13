import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHUNKS, COLORS, Chunk } from "./data";
import { caveat, montserrat, playfair, poppins } from "./fonts";

type Kind = "default" | "thin" | "heavy" | "script" | "serif";
type Word = { text: string; kind: Kind; accent: boolean; t: number };
type Line = Word[];

const STYLE: Record<
  Kind,
  { family: string; size: number; weight: number; style?: string; em: number }
> = {
  default: { family: montserrat, size: 76, weight: 800, em: 0.64 },
  thin: { family: poppins, size: 80, weight: 300, em: 0.56 },
  heavy: { family: montserrat, size: 122, weight: 900, em: 0.8 },
  script: { family: caveat, size: 140, weight: 700, em: 0.43 },
  serif: { family: playfair, size: 104, weight: 900, style: "italic", em: 0.6 },
};

const MAX_WIDTH = 940;

const parseChunk = (chunk: Chunk): Line[] => {
  const lines: Line[] = [[]];
  const raw = chunk.text.split(" ").filter(Boolean);
  const words = raw.filter((w) => w !== "|");
  const weights = words.map((w) => Math.max(3, w.replace(/[\^~%&!]/g, "").length));
  const total = weights.reduce((a, b) => a + b, 0);
  // As palavras vao surgindo ao longo dos primeiros 75% do trecho.
  const span = (chunk.e - chunk.s) * 0.75;
  let acc = 0;
  let i = 0;
  for (const token of raw) {
    if (token === "|") {
      lines.push([]);
      continue;
    }
    const marker = token[0];
    const kind: Kind =
      marker === "^"
        ? "heavy"
        : marker === "~"
          ? "thin"
          : marker === "%"
            ? "script"
            : marker === "&"
              ? "serif"
              : "default";
    let text = kind === "default" ? token : token.slice(1);
    const accent = text.endsWith("!") && text.length > 1;
    if (accent) text = text.slice(0, -1);
    if (kind === "heavy") text = text.toUpperCase();
    lines[lines.length - 1].push({
      text,
      kind,
      accent,
      t: chunk.s + (acc / total) * span,
    });
    acc += weights[i++];
  }
  return lines.filter((l) => l.length);
};

const lineScale = (line: Line) => {
  const width = line.reduce((sum, w, idx) => {
    const st = STYLE[w.kind];
    const pad = w.kind === "heavy" && w.accent ? 0.5 * st.size : 0;
    return sum + w.text.length * st.em * st.size + pad + (idx ? 22 : 0);
  }, 0);
  return Math.min(1, MAX_WIDTH / width);
};

const AnimatedWord: React.FC<{ word: Word; scale: number }> = ({
  word,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - Math.round(word.t * fps);
  const st = STYLE[word.kind];
  const size = st.size * scale;

  const p = spring({
    frame: local,
    fps,
    config:
      word.kind === "heavy"
        ? { damping: 11, stiffness: 260, mass: 0.6 }
        : { damping: 14, stiffness: 220 },
  });
  const visible = local >= 0;

  let transform = "";
  let filter = "";
  let clipPath: string | undefined;
  if (word.kind === "heavy") {
    transform = `scale(${interpolate(p, [0, 1], [1.4, 1])})`;
  } else if (word.kind === "script") {
    const w = interpolate(local, [0, 8], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    clipPath = `inset(-30% ${100 - w}% -30% -10%)`;
    transform = `rotate(-5deg) translateY(${interpolate(p, [0, 1], [10, 0])}px)`;
  } else if (word.kind === "serif") {
    filter = `blur(${interpolate(p, [0, 1], [12, 0])}px)`;
    transform = `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [1.15, 1])})`;
  } else {
    transform = `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`;
  }

  const highlightBox = word.kind === "heavy" && word.accent;
  const color = highlightBox
    ? COLORS.white
    : word.accent
      ? word.kind === "thin"
        ? COLORS.yellow
        : COLORS.blue
      : COLORS.white;

  const boxProgress = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        margin: `0 ${11 * scale}px`,
        opacity: visible ? Math.min(1, p * 1.6) : 0,
        transform,
        filter: filter || undefined,
        clipPath,
        fontFamily: st.family,
        fontWeight: st.weight,
        fontStyle: st.style ?? "normal",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: word.kind === "heavy" ? -2 * scale : 0,
        color,
        padding: highlightBox ? `${0.08 * size}px ${0.22 * size}px` : 0,
        textShadow: highlightBox
          ? "0 4px 0 rgba(0,0,0,0.25)"
          : word.accent && word.kind !== "thin"
            ? `0 0 28px rgba(46,155,255,0.65), 0 6px 18px rgba(0,0,0,0.75)`
            : "0 6px 20px rgba(0,0,0,0.8), 0 2px 3px rgba(0,0,0,0.6)",
        whiteSpace: "nowrap",
      }}
    >
      {highlightBox ? (
        <span
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDeep})`,
            borderRadius: 0.16 * size,
            transform: `rotate(-2deg) scaleX(${boxProgress})`,
            transformOrigin: "left center",
            boxShadow: "0 10px 30px rgba(11,91,211,0.55)",
            zIndex: -1,
          }}
        />
      ) : null}
      {word.text}
    </span>
  );
};

const ChunkView: React.FC<{ chunk: Chunk; end: number }> = ({ chunk, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = parseChunk(chunk);
  const start = Math.round(chunk.s * fps);
  const endF = Math.round(end * fps);
  const pop = spring({
    frame: frame - start,
    fps,
    config: { damping: 15, stiffness: 240 },
  });
  const out = interpolate(frame, [endF - 3, endF], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        top: 1040,
        height: 400,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity: out,
        transform: `scale(${interpolate(pop, [0, 1], [0.92, 1]) * interpolate(out, [0, 1], [0.9, 1])})`,
      }}
    >
      {lines.map((line, i) => {
        const scale = lineScale(line);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              marginTop: i ? 4 : 0,
            }}
          >
            {line.map((w, j) => (
              <AnimatedWord key={j} word={w} scale={scale} />
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = CHUNKS.findIndex((c, i) => {
    const next = CHUNKS[i + 1];
    const end = next ? Math.min(next.s, c.e + 0.45) : c.e + 0.2;
    return t >= c.s && t < end;
  });
  if (idx === -1) return null;
  const chunk = CHUNKS[idx];
  const next = CHUNKS[idx + 1];
  const end = next ? Math.min(next.s, chunk.e + 0.45) : chunk.e + 0.2;
  return <ChunkView key={idx} chunk={chunk} end={end} />;
};
