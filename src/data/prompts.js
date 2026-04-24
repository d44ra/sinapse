export const PROMPTS = [
  {
    id: "p1",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1", sentido: "paladar" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p2",
    nodes: [
      { type: "text", content: "São Paulo tem cheiro de " },
      { type: "slot", id: "s1", sentido: "olfato" },
      { type: "text", content: " e textura de " },
      { type: "slot", id: "s2", sentido: "tato" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p3",
    nodes: [
      { type: "text", content: "São Paulo soa como " },
      { type: "slot", id: "s1", sentido: "audicao" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p4",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1", sentido: "visao" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p5",
    nodes: [
      { type: "text", content: "A textura de São Paulo é " },
      { type: "slot", id: "s1", sentido: "tato" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p6",
    nodes: [
      { type: "text", content: "O som de São Paulo é " },
      { type: "slot", id: "s1", sentido: "audicao" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p7",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1", sentido: "paladar" },
      { type: "text", content: " e cheiro de " },
      { type: "slot", id: "s2", sentido: "olfato" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p8",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1", sentido: "visao" },
      { type: "text", content: ", mas soa como " },
      { type: "slot", id: "s2", sentido: "audicao" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p9",
    nodes: [
      { type: "text", content: "São Paulo é áspera como " },
      { type: "slot", id: "s1", sentido: "tato" },
      { type: "text", content: " e cheira a " },
      { type: "slot", id: "s2", sentido: "olfato" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p10",
    nodes: [
      { type: "text", content: "O gosto de São Paulo é " },
      { type: "slot", id: "s1", sentido: "paladar" },
      { type: "text", content: " e o parece " },
      { type: "slot", id: "s2", sentido: "visao" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p12",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1", sentido: "visao" },
      { type: "text", content: " e tem textura de " },
      { type: "slot", id: "s2", sentido: "tato" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p11",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1", sentido: "paladar" },
      { type: "text", content: ", cheiro de " },
      { type: "slot", id: "s2", sentido: "olfato" },
      { type: "text", content: " e som de " },
      { type: "slot", id: "s3", sentido: "audicao" },
      { type: "text", content: "." },
    ],
  },
];