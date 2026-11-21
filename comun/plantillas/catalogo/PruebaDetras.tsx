/** Prueba de las animaciones «detrás de ti» (21 nov 2026): su vídeo de fondo, la pieza en medio y su recorte delante. */
import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Animacion } from "./Animacion";

const Prueba: React.FC<{ id: string; cambios?: [string, string][]; clips?: string[] }> = ({ id, cambios, clips }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Animacion formato="detras" id={id} cambios={cambios} clips={clips} video="BBBA8ECF/video.mp4" videoDesde={5.3}
      recorte="BBBA8ECF/recorte-prueba.webm" />
  </AbsoluteFill>
);

export const ComposicionPruebaDetras: React.FC = () => (
  <Composition id="PruebaDetras" component={Prueba} durationInFrames={90} fps={30} width={1080} height={1920}
    defaultProps={{ id: "cifra-gigante", cambios: [] as [string, string][] }} />
);
