import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, END_CARD_START, TOTAL_DURATION } from "./data";
import { caveat, montserrat, playfair, poppins } from "./fonts";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const glass: React.CSSProperties = {
  background: "rgba(7,20,39,0.72)",
  backdropFilter: "blur(14px)",
  border: `2px solid rgba(46,155,255,0.55)`,
  borderRadius: 30,
  boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
};

// Envoltorio que posiciona um grafico entre dois instantes (em segundos).
const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({
  from,
  to,
  children,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      from={Math.round(from * fps)}
      durationInFrames={Math.round((to - from) * fps)}
      layout="none"
    >
      {children}
    </Sequence>
  );
};

const useSpring = (delay = 0, config = { damping: 13, stiffness: 180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

const sec = (s: number, fps: number) => Math.round(s * fps);

/* ---------------- Lower third ---------------- */
const LowerThird: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bar = useSpring(0, { damping: 18, stiffness: 160 });
  const name = useSpring(5);
  const role = useSpring(10);
  const exit = interpolate(frame, [dur - 8, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top: 250, left: 60 }}>
      <div
        style={{
          transform: `translateX(${-exit * 700}px)`,
          display: "flex",
          alignItems: "stretch",
          gap: 22,
        }}
      >
        <div
          style={{
            width: 12,
            borderRadius: 6,
            background: `linear-gradient(${COLORS.blue}, ${COLORS.blueDeep})`,
            transform: `scaleY(${bar})`,
            boxShadow: `0 0 24px ${COLORS.blue}`,
          }}
        />
        <div style={{ overflow: "hidden", paddingRight: 30 }}>
          <div
            style={{
              fontFamily: montserrat,
              fontWeight: 900,
              fontSize: 64,
              color: "#fff",
              lineHeight: 1.05,
              transform: `translateX(${interpolate(name, [0, 1], [-520, 0])}px)`,
              textShadow: "0 4px 18px rgba(0,0,0,0.7)",
            }}
          >
            Dra. Christiane
            <span style={{ color: COLORS.blue }}> Inoue</span>
          </div>
          <div
            style={{
              marginTop: 10,
              display: "inline-block",
              fontFamily: poppins,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 8,
              color: COLORS.navy,
              background: "#fff",
              padding: "6px 16px",
              borderRadius: 8,
              transform: `translateY(${interpolate(role, [0, 1], [70, 0])}px)`,
              opacity: role,
            }}
          >
            MÉDICA DERMATOLOGISTA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Titulo do curso ---------------- */
const CourseTitle: React.FC<{ dur: number; hiperAt: number }> = ({
  dur,
  hiperAt,
}) => {
  const frame = useCurrentFrame();
  const a = useSpring(0, { damping: 10, stiffness: 200 });
  const b = useSpring(5, { damping: 10, stiffness: 200 });
  const writeP = interpolate(frame, [hiperAt, hiperAt + 14], [0, 100], clamp);
  const exit = interpolate(frame, [dur - 7, dur], [1, 0], clamp);
  const shine = interpolate(frame, [8, 30], [-120, 220], clamp);
  return (
    <AbsoluteFill
      style={{
        top: 210,
        alignItems: "center",
        opacity: exit,
        transform: `scale(${interpolate(exit, [0, 1], [1.3, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: poppins,
          fontWeight: 300,
          fontSize: 38,
          letterSpacing: 14,
          color: "#fff",
          opacity: a,
          textShadow: "0 3px 12px rgba(0,0,0,0.8)",
        }}
      >
        CURSO
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 112,
            color: "#fff",
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDeep})`,
            padding: "0 26px",
            borderRadius: 22,
            transform: `scale(${a}) rotate(${interpolate(a, [0, 1], [-14, -3])}deg)`,
            boxShadow: "0 14px 40px rgba(11,91,211,0.6)",
          }}
        >
          BIZU
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: "35%",
              background:
                "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 112,
            color: "#fff",
            transform: `translateY(${interpolate(b, [0, 1], [120, 0])}px)`,
            opacity: b,
            textShadow: "0 8px 26px rgba(0,0,0,0.75)",
          }}
        >
          FERIDAS
        </div>
      </div>
      <div
        style={{
          fontFamily: caveat,
          fontWeight: 700,
          fontSize: 120,
          color: COLORS.blue,
          marginTop: -8,
          transform: "rotate(-4deg)",
          clipPath: `inset(-20% ${100 - writeP}% -20% -5%)`,
          textShadow: "0 0 30px rgba(46,155,255,0.6), 0 6px 18px rgba(0,0,0,0.8)",
        }}
      >
        & Hiperbárica
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Carimbo ---------------- */
const Stamp: React.FC<{ text: string; dur: number; top?: number }> = ({
  text,
  dur,
  top = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 9, stiffness: 300, mass: 0.7 } });
  const exit = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  const ring = interpolate(frame, [2, 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top, alignItems: "center", opacity: exit }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -30,
            border: `6px solid ${COLORS.yellow}`,
            borderRadius: 30,
            opacity: 1 - ring,
            transform: `rotate(-8deg) scale(${1 + ring * 0.5})`,
          }}
        />
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 110,
            letterSpacing: 2,
            color: COLORS.yellow,
            border: `9px solid ${COLORS.yellow}`,
            borderRadius: 24,
            padding: "4px 34px",
            background: "rgba(7,20,39,0.55)",
            transform: `rotate(-8deg) scale(${interpolate(p, [0, 1], [3.2, 1])})`,
            opacity: Math.min(1, p * 2),
            textShadow: "0 0 26px rgba(255,216,74,0.6)",
            boxShadow: "0 0 40px rgba(255,216,74,0.35)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Checklist ---------------- */
const CheckIcon: React.FC<{ p: number }> = ({ p }) => (
  <svg width="62" height="62" viewBox="0 0 62 62">
    <circle
      cx="31"
      cy="31"
      r="28"
      fill={p > 0.05 ? COLORS.blue : "transparent"}
      stroke={COLORS.blue}
      strokeWidth="4"
      opacity={0.4 + 0.6 * Math.min(1, p * 2)}
    />
    <path
      d="M18 32 L27 41 L45 22"
      fill="none"
      stroke="#fff"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="44"
      strokeDashoffset={44 * (1 - p)}
    />
  </svg>
);

const Checklist: React.FC<{ dur: number; items: { label: string; at: number }[] }> = ({
  dur,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useSpring(0, { damping: 15, stiffness: 170 });
  const exit = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ top: 200, alignItems: "center" }}>
      <div
        style={{
          ...glass,
          padding: "30px 44px",
          width: 720,
          transform: `translateY(${interpolate(card, [0, 1], [-80, 0])}px) scale(${interpolate(exit, [0, 1], [0.85, 1])})`,
          opacity: card * exit,
        }}
      >
        <div
          style={{
            fontFamily: poppins,
            fontWeight: 300,
            fontSize: 34,
            letterSpacing: 6,
            color: "#cfe6ff",
            marginBottom: 14,
          }}
        >
          DÚVIDAS SOBRE
        </div>
        {items.map((it, i) => {
          const ip = spring({
            frame: frame - it.at,
            fps,
            config: { damping: 14, stiffness: 200 },
          });
          const check = interpolate(frame - it.at, [3, 12], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginTop: 12,
                opacity: frame >= it.at ? 1 : 0.25,
                transform: `translateX(${interpolate(ip, [0, 1], [60, 0])}px)`,
              }}
            >
              <CheckIcon p={check} />
              <span
                style={{
                  fontFamily: montserrat,
                  fontWeight: 800,
                  fontSize: 54,
                  color: "#fff",
                }}
              >
                {it.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Chips de especialidades ---------------- */
const Chips: React.FC<{ dur: number; items: { label: string; at: number }[] }> = ({
  dur,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        top: 190,
        alignItems: "center",
        gap: 20,
        opacity: exit,
      }}
    >
      <div
        style={{
          fontFamily: caveat,
          fontWeight: 700,
          fontSize: 76,
          color: "#fff",
          transform: "rotate(-3deg)",
          textShadow: "0 4px 16px rgba(0,0,0,0.8)",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        Time de especialistas
      </div>
      {items.map((it, i) => {
        const p = spring({
          frame: frame - it.at,
          fps,
          config: { damping: 11, stiffness: 210 },
        });
        const active =
          frame >= it.at && (i === items.length - 1 || frame < items[i + 1].at);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "14px 40px 14px 20px",
              borderRadius: 999,
              background: active
                ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDeep})`
                : "rgba(7,20,39,0.75)",
              border: `2px solid ${COLORS.blue}`,
              transform: `translateX(${interpolate(p, [0, 1], [i % 2 ? -900 : 900, 0])}px) scale(${active ? 1.06 : 0.94})`,
              boxShadow: active ? `0 10px 34px rgba(46,155,255,0.55)` : "none",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                background: "#fff",
                color: COLORS.blueDeep,
                fontFamily: montserrat,
                fontWeight: 900,
                fontSize: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                fontFamily: montserrat,
                fontWeight: 800,
                fontSize: 50,
                color: "#fff",
              }}
            >
              {it.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- Alerta ---------------- */
const Warning: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = useSpring(0, { damping: 8, stiffness: 260 });
  const exit = interpolate(frame, [dur - 7, dur], [1, 0], clamp);
  const pulse = 1 + 0.06 * Math.sin(frame / 3);
  const wobble = Math.sin(frame / 2) * interpolate(frame, [0, 20], [10, 0], clamp);
  return (
    <AbsoluteFill style={{ top: 220, alignItems: "center", opacity: exit }}>
      <div
        style={{
          transform: `scale(${p * pulse}) rotate(${wobble}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg width="190" height="170" viewBox="0 0 190 170">
          <path
            d="M95 10 L182 160 L8 160 Z"
            fill={COLORS.yellow}
            stroke="#1b1b1b"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <rect x="86" y="58" width="18" height="58" rx="8" fill="#1b1b1b" />
          <circle cx="95" cy="137" r="11" fill="#1b1b1b" />
        </svg>
        <div
          style={{
            marginTop: 10,
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 74,
            letterSpacing: 6,
            color: "#1b1b1b",
            background: COLORS.yellow,
            padding: "2px 28px",
            borderRadius: 14,
            transform: "rotate(-2deg)",
          }}
        >
          ATENÇÃO
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 100% online / de casa ---------------- */
const OnlineBadge: React.FC<{ dur: number; houseAt: number }> = ({
  dur,
  houseAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpring(0, { damping: 11, stiffness: 200 });
  const h = spring({ frame: frame - houseAt, fps, config: { damping: 11, stiffness: 200 } });
  const exit = interpolate(frame, [dur - 7, dur], [1, 0], clamp);
  const isHouse = frame >= houseAt;
  const swap = isHouse ? h : p;
  return (
    <AbsoluteFill style={{ top: 220, alignItems: "center", opacity: exit }}>
      <div
        style={{
          ...glass,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "26px 44px 26px 30px",
          transform: `scale(${interpolate(swap, [0, 1], [0.4, 1])}) rotate(${interpolate(swap, [0, 1], [-10, 0])}deg)`,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDeep})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isHouse ? (
            <svg width="76" height="76" viewBox="0 0 76 76">
              <path
                d="M8 36 L38 10 L68 36"
                fill="none"
                stroke="#fff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 32 V66 H60 V32"
                fill="none"
                stroke="#fff"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M38 58 C 28 50, 28 42, 34 41 C 37 41, 38 44, 38 45 C 38 44, 39 41, 42 41 C 48 42, 48 50, 38 58 Z"
                fill="#fff"
              />
            </svg>
          ) : (
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path d="M22 12 L58 35 L22 58 Z" fill="#fff" />
            </svg>
          )}
        </div>
        <div>
          <div
            style={{
              fontFamily: poppins,
              fontWeight: 300,
              fontSize: 34,
              letterSpacing: 6,
              color: "#cfe6ff",
            }}
          >
            {isHouse ? "ASSISTA" : "CURSO"}
          </div>
          <div
            style={{
              fontFamily: isHouse ? caveat : montserrat,
              fontWeight: isHouse ? 700 : 900,
              fontSize: isHouse ? 92 : 78,
              lineHeight: 1,
              color: "#fff",
            }}
          >
            {isHouse ? "de casa" : "100% ONLINE"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Estrelas ---------------- */
const Stars: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{ top: 300, flexDirection: "row", justifyContent: "center", gap: 14, opacity: exit }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const p = spring({
          frame: frame - i * 3,
          fps,
          config: { damping: 9, stiffness: 240 },
        });
        return (
          <svg
            key={i}
            width="120"
            height="120"
            viewBox="0 0 24 24"
            style={{
              transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-90, 0])}deg)`,
              filter: "drop-shadow(0 0 14px rgba(255,216,74,0.7))",
            }}
          >
            <path
              d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"
              fill={COLORS.yellow}
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- Cartao final ---------------- */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number, cfg = { damping: 12, stiffness: 190 }) =>
    spring({ frame: frame - d, fps, config: cfg });
  const logo = s(0);
  const sub = s(8);
  const doc = s(14);
  const btn = s(22, { damping: 9, stiffness: 220 });
  const shine = interpolate((frame - 30) % 45, [0, 25], [-60, 160], clamp);
  const tap = interpolate((frame - 40) % 45, [0, 6, 12], [1, 0.9, 1], clamp);
  const arrow = interpolate(frame, [30, 44], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -120,
        }}
      >
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 190,
            color: "#fff",
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDeep})`,
            padding: "0 50px",
            borderRadius: 40,
            transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-20, -3])}deg)`,
            boxShadow: "0 24px 70px rgba(11,91,211,0.7)",
          }}
        >
          BIZU
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 64,
            color: "#fff",
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [50, 0])}px)`,
          }}
        >
          FERIDAS
          <span style={{ fontFamily: playfair, fontStyle: "italic", color: COLORS.blue }}>
            {" "}&{" "}
          </span>
          HIPERBÁRICA
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: caveat,
            fontWeight: 700,
            fontSize: 74,
            color: "#cfe6ff",
            opacity: doc,
            transform: `rotate(-3deg) translateY(${interpolate(doc, [0, 1], [30, 0])}px)`,
          }}
        >
          com Dra. Christiane Inoue
        </div>
        <div style={{ height: 70 }} />
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "26px 56px",
            borderRadius: 999,
            background: "#fff",
            transform: `scale(${btn * tap})`,
            boxShadow: "0 18px 50px rgba(46,155,255,0.55)",
          }}
        >
          <span
            style={{
              fontFamily: montserrat,
              fontWeight: 900,
              fontSize: 62,
              color: COLORS.navy,
            }}
          >
            cursobizu.com.br
          </span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: "30%",
              background:
                "linear-gradient(100deg, transparent, rgba(46,155,255,0.35), transparent)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: poppins,
            fontWeight: 300,
            fontSize: 36,
            letterSpacing: 8,
            color: "#fff",
            opacity: arrow,
          }}
        >
          LINK NA BIO ↑
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Graphics: React.FC = () => {
  const { fps } = useVideoConfig();
  const d = (a: number, b: number) => sec(b - a, fps);
  return (
    <>
      <At from={4.6} to={8.75}>
        <LowerThird dur={d(4.6, 8.75)} />
      </At>
      <At from={8.88} to={11.1}>
        <CourseTitle dur={d(8.88, 11.1)} hiperAt={sec(10.31 - 8.88, fps)} />
      </At>
      <At from={11.75} to={12.95}>
        <Stamp text="IMPERDÍVEL" dur={d(11.75, 12.95)} />
      </At>
      <At from={14.72} to={18.55}>
        <Checklist
          dur={d(14.72, 18.55)}
          items={[
            { label: "Evolução", at: 2 },
            { label: "Acompanhamento", at: sec(16.12 - 14.72, fps) },
            { label: "Tratamento", at: sec(17.05 - 14.72, fps) },
          ]}
        />
      </At>
      <At from={24.59} to={29.95}>
        <Chips
          dur={d(24.59, 29.95)}
          items={[
            { label: "Dermatologia", at: 2 },
            { label: "Vascular", at: sec(26.13 - 24.59, fps) },
            { label: "Hiperbárica", at: sec(28.93 - 24.59, fps) },
          ]}
        />
      </At>
      <At from={36.74} to={39.78}>
        <Warning dur={d(36.74, 39.78)} />
      </At>
      <At from={40.87} to={46.2}>
        <OnlineBadge dur={d(40.87, 46.2)} houseAt={sec(43.44 - 40.87, fps)} />
      </At>
      <At from={50.3} to={51.35}>
        <Stamp text="IMPERDÍVEL" dur={d(50.3, 51.35)} />
      </At>
      <At from={54.99} to={56.25}>
        <Stars dur={d(54.99, 56.25)} />
      </At>
      <At from={END_CARD_START} to={TOTAL_DURATION}>
        <EndCard />
      </At>
    </>
  );
};

