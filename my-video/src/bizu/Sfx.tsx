import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { CHUNKS, CUTS, END_CARD_START } from "./data";
import { CUT_TRANSITIONS, TransitionKind } from "./VideoLayer";

type Cue = { t: number; src: string; vol: number };

const CUT_SFX: Record<TransitionKind, { src: string; lead: number; vol: number }[]> = {
  zoomBlur: [{ src: "whoosh", lead: 0.25, vol: 0.5 }],
  whipLeft: [{ src: "whoosh_fast", lead: 0.12, vol: 0.55 }],
  whipRight: [{ src: "whoosh_fast", lead: 0.12, vol: 0.55 }],
  whipUp: [{ src: "swoosh_down", lead: 0.14, vol: 0.5 }],
  flash: [
    { src: "whoosh", lead: 0.25, vol: 0.4 },
    { src: "shutter", lead: 0, vol: 0.35 },
  ],
  glitch: [{ src: "glitch", lead: 0.05, vol: 0.45 }],
  spin: [{ src: "swoosh_down", lead: 0.16, vol: 0.5 }],
  shake: [{ src: "impact", lead: 0, vol: 0.35 }],
};

const cues: Cue[] = [
  ...CUTS.flatMap((cut, i) =>
    CUT_SFX[CUT_TRANSITIONS[i]].map((c) => ({
      t: cut - c.lead,
      src: c.src,
      vol: c.vol,
    })),
  ),
  // "Pop" leve nas palavras de impacto
  ...CHUNKS.filter((c) => /\^[^ ]+!/.test(c.text)).map((c) => ({
    t: c.s,
    src: "pop",
    vol: 0.22,
  })),
  // Grafismos
  { t: 4.55, src: "whoosh_fast", vol: 0.4 },
  { t: 8.88, src: "pop", vol: 0.4 },
  { t: 9.05, src: "pop", vol: 0.35 },
  { t: 10.28, src: "whoosh_fast", vol: 0.3 },
  { t: 11.75, src: "impact", vol: 0.55 },
  { t: 14.78, src: "ding", vol: 0.35 },
  { t: 16.22, src: "ding", vol: 0.35 },
  { t: 17.15, src: "ding", vol: 0.35 },
  { t: 24.62, src: "whoosh_fast", vol: 0.35 },
  { t: 26.16, src: "whoosh_fast", vol: 0.35 },
  { t: 28.96, src: "whoosh_fast", vol: 0.35 },
  { t: 36.74, src: "glitch", vol: 0.4 },
  { t: 36.76, src: "impact", vol: 0.35 },
  { t: 40.87, src: "pop", vol: 0.4 },
  { t: 43.44, src: "pop", vol: 0.4 },
  { t: 50.3, src: "impact", vol: 0.55 },
  { t: 54.99, src: "ding", vol: 0.3 },
  { t: 55.09, src: "pop", vol: 0.25 },
  { t: 55.19, src: "pop", vol: 0.25 },
  { t: END_CARD_START - 1.25, src: "riser", vol: 0.35 },
  { t: END_CARD_START, src: "impact", vol: 0.5 },
  { t: END_CARD_START + 0.75, src: "ding", vol: 0.35 },
];

export const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(c.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </>
  );
};
