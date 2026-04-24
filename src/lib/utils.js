export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomItems(arr, count) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

export function extractTextFromAnswers(nodes, answers, items) {
  return nodes
    .map((node) => {
      if (node.type === "text") return node.content;
      if (node.type === "slot") {
        const answer = answers[node.id];
        if (answer) {
          const item = items.find((i) => i.id === answer.itemId);
          return item ? `[${item.label}]` : "[___]";
        }
        return "[___]";
      }
      return "";
    })
      .join("");
  }
  export function parsePolygonString(polygonStr) {
    const match = polygonStr.match(/polygon\((.*)\)/);
    if (!match) return [[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }]]; // Fallback de erro
    
    const points = match[1].split(',');
    const vertices = points.map(p => {
      const coords = p.trim().split(/\s+/);
      return { x: parseFloat(coords[0]), y: parseFloat(coords[1]) };
    });
    
    return [vertices];
  }