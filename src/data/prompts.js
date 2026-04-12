export const PROMPTS = [
  {
    id: "p1",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p2",
    nodes: [
      { type: "text", content: "São Paulo tem cheiro de " },
      { type: "slot", id: "s1" },
      { type: "text", content: " e textura de " },
      { type: "slot", id: "s2" },
      { type: "text", content: "." },
    ],
  },

  // --- 1 lacuna

  {
    id: "p3",
    nodes: [
      { type: "text", content: "São Paulo soa como " },
      { type: "slot", id: "s1" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p4",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p5",
    nodes: [
      { type: "text", content: "A textura de São Paulo é " },
      { type: "slot", id: "s1" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p6",
    nodes: [
      { type: "text", content: "O som de São Paulo é " },
      { type: "slot", id: "s1" },
      { type: "text", content: "." },
    ],
  },

  // --- 2 lacunas

  {
    id: "p7",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1" },
      { type: "text", content: " e cheiro de " },
      { type: "slot", id: "s2" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p8",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1" },
      { type: "text", content: " mas soa como " },
      { type: "slot", id: "s2" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p9",
    nodes: [
      { type: "text", content: "São Paulo é áspera como " },
      { type: "slot", id: "s1" },
      { type: "text", content: " e cheira a " },
      { type: "slot", id: "s2" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p10",
    nodes: [
      { type: "text", content: "O gosto de São Paulo é " },
      { type: "slot", id: "s1" },
      { type: "text", content: " e o parece " },
      { type: "slot", id: "s2" },
      { type: "text", content: "." },
    ],
  },

  // --- 3 lacunas

  {
    id: "p11",
    nodes: [
      { type: "text", content: "São Paulo tem gosto de " },
      { type: "slot", id: "s1" },
      { type: "text", content: ", cheiro de " },
      { type: "slot", id: "s2" },
      { type: "text", content: " e som de " },
      { type: "slot", id: "s3" },
      { type: "text", content: "." },
    ],
  },
  {
    id: "p12",
    nodes: [
      { type: "text", content: "São Paulo parece " },
      { type: "slot", id: "s1" },
      { type: "text", content: ", soa como " },
      { type: "slot", id: "s2" },
      { type: "text", content: " e é áspero como " },
      { type: "slot", id: "s3" },
      { type: "text", content: "." },
    ],
  },
];