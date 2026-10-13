// Fontes empacotadas localmente (@fontsource), sem depender de rede no render.
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/playfair-display/900-italic.css";
import { continueRender, delayRender } from "remotion";

export const montserrat = "Montserrat";
export const poppins = "Poppins";
export const caveat = "Caveat";
export const playfair = "Playfair Display";

const SAMPLE = "Aa ÁÃÇÉÊÍÓÔÕÚ áãçéêíóôõú";
const FACES = [
  `700 80px ${montserrat}`,
  `800 80px ${montserrat}`,
  `900 80px ${montserrat}`,
  `200 80px ${poppins}`,
  `300 80px ${poppins}`,
  `600 80px ${poppins}`,
  `700 80px ${caveat}`,
  `italic 900 80px "${playfair}"`,
];

if (typeof document !== "undefined") {
  const handle = delayRender("Carregando fontes");
  Promise.all(FACES.map((f) => document.fonts.load(f, SAMPLE)))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
