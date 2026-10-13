// Tempos em segundos, extraidos das legendas originais do video.
//
// Marcadores de estilo por palavra (estilo legenda "Captions"):
//   ^palavra  -> fonte grossa (Montserrat Black, caixa alta, grande)
//   ~palavra  -> fonte fina (Poppins Thin)
//   %palavra  -> manuscrita (Caveat)
//   &palavra  -> serifada italica (Playfair Display)
//   palavra!  -> cor de destaque (azul da marca)
//   |         -> quebra de linha
// Palavra sem marcador usa a fonte padrao (Montserrat ExtraBold).

export type Chunk = { s: number; e: number; text: string };

export const CHUNKS: Chunk[] = [
  { s: 0.23, e: 0.7, text: "^FERIDAS!" },
  { s: 0.73, e: 1.4, text: "~elas ~são | %sempre" },
  { s: 1.43, e: 2.1, text: "^COMPLEXAS" },
  { s: 2.17, e: 2.9, text: "~em ~alguns | &momentos" },
  { s: 2.94, e: 4.1, text: "%traiçoeiras!" },
  { s: 4.14, e: 4.54, text: "^OLÁ!" },
  { s: 4.61, e: 4.97, text: "~eu ~sou ~a | doutora" },
  { s: 5.04, e: 5.77, text: "%Christiane | ^INOUE!" },
  { s: 5.81, e: 6.94, text: "~médica | &dermatologista!" },
  { s: 7.01, e: 8.17, text: "~e ~estou ~vindo | ^CONVERSAR" },
  { s: 8.21, e: 8.81, text: "~com ~vocês ~um | %pouquinho" },
  { s: 8.88, e: 10.28, text: "~sobre ~o | ^BIZU ^FERIDAS!" },
  { s: 10.31, e: 11.08, text: "~e | &Hiperbárica!" },
  { s: 11.14, e: 12.91, text: "~é ~um ~curso | ^IMPERDÍVEL!" },
  { s: 13.15, e: 14.68, text: "~você ~que ~tem | %dúvidas!" },
  { s: 14.72, e: 15.98, text: "~sobre | ^EVOLUÇÃO" },
  { s: 16.12, e: 17.02, text: "&acompanhamento!" },
  { s: 17.05, e: 18.59, text: "~tratamento ~de | ^FERIDAS!" },
  { s: 18.75, e: 18.95, text: "~a ~gente" },
  { s: 18.99, e: 19.75, text: "%temos" },
  { s: 19.79, e: 20.89, text: "~os ~melhores | ^TRATAMENTOS!" },
  { s: 20.95, e: 21.56, text: "~e ~os | %melhores" },
  { s: 21.59, e: 22.69, text: "^PROFISSIONAIS | &associados" },
  { s: 22.72, e: 23.46, text: "~nesse | ^CURSO!" },
  { s: 23.66, e: 24.56, text: "~eu ~estou ~na | parte" },
  { s: 24.59, e: 25.79, text: "~de | &dermatologia!" },
  { s: 25.83, e: 26.1, text: "~tem ~o | pessoal" },
  { s: 26.13, e: 27.13, text: "~da | ^VASCULAR!" },
  { s: 27.43, e: 28.9, text: "~tem ~as | %novidades" },
  { s: 28.93, e: 29.93, text: "~de | ^HIPERBÁRICA!" },
  { s: 29.96, e: 30.83, text: "~então ~tudo | ~que ~você" },
  { s: 30.9, e: 32.1, text: "~pode ~entregar | &de ^MELHOR!" },
  { s: 32.13, e: 33.1, text: "~para ~o | %paciente" },
  { s: 33.17, e: 33.83, text: "~se ~você | ^NÃO ~tiver" },
  { s: 33.87, e: 35.27, text: "~o ~conhecimento | &adequado!" },
  { s: 35.3, e: 36.67, text: "~para ~o | ^TRATAMENTO" },
  { s: 36.74, e: 37.54, text: "~pode ~ser | ^PROBLEMA!" },
  { s: 37.6, e: 38.64, text: "~para | %você ~e ^PROBLEMA" },
  { s: 38.67, e: 39.74, text: "~para ~o ~seu | &paciente!" },
  { s: 40.14, e: 40.57, text: "^NADA | %melhor" },
  { s: 40.61, e: 40.84, text: "~do ~que ~ter" },
  { s: 40.87, e: 42.34, text: "~um ~curso | ^ONLINE!" },
  { s: 42.41, e: 43.41, text: "~para ~você | &assistir ~isso" },
  { s: 43.44, e: 44.04, text: "~em | ^CASA!" },
  { s: 44.11, e: 44.71, text: "~no | %conforto" },
  { s: 44.75, e: 46.25, text: "~do ~seu | ^LAR ~e ~ter ~todo" },
  { s: 46.28, e: 47.68, text: "~o | &conhecimento! | ~para ~você" },
  { s: 47.71, e: 48.18, text: "~oferecer | %melhor" },
  { s: 48.21, e: 49.15, text: "~para ~seus | ^PACIENTES!" },
  { s: 49.25, e: 49.92, text: "~então ~fica | &essa ^DICA" },
  { s: 49.95, e: 51.32, text: "~porque ~está | ^IMPERDÍVEL!" },
  { s: 51.35, e: 52.39, text: "~e ~tem | %todos" },
  { s: 52.45, e: 53.02, text: "~os | ^PROFISSIONAIS" },
  { s: 53.05, e: 53.29, text: "~que ~estão" },
  { s: 53.32, e: 54.35, text: "%comigo | ~nesse ^CURSO!" },
  { s: 54.42, e: 54.92, text: "~e ~assim" },
  { s: 54.99, e: 56.26, text: "~está | &espetacular!" },
  { s: 56.56, e: 57.29, text: "%Obrigada!" },
];

// Cortes (jump cuts) detectados no video original.
export const CUTS = [
  3.937, 10.978, 12.946, 18.519, 23.423, 27.161, 28.195, 32.966, 36.47, 39.806,
  43.977, 47.214, 49.082, 51.585, 56.223,
];

export const VIDEO_DURATION = 59.12;
export const END_CARD_START = 57.35;
export const TOTAL_DURATION = 61.0;

export const COLORS = {
  blue: "#2E9BFF",
  blueDeep: "#0B5BD3",
  navy: "#071427",
  white: "#FFFFFF",
  yellow: "#FFD84A",
};
