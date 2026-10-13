import React from "react";
import { AbsoluteFill } from "remotion";
import { Captions } from "./Captions";
import { Graphics } from "./Graphics";
import { Sfx } from "./Sfx";
import { VideoLayer } from "./VideoLayer";
import "./fonts";

export const BizuVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <VideoLayer />
      <Graphics />
      <Captions />
      <Sfx />
    </AbsoluteFill>
  );
};
