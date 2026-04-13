export function randomItems(arr, count) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

export function extractTextFromAnswers(nodes, answers, items) {
  return nodes
    .map((node) => {
      if (node.type === "text") return node.content;
      if (node.type === "slot") {
        const itemId = answers[node.id];
        const item = items.find((i) => i.id === itemId);
        return item ? `[${item.label}]` : "[___]";
      }
      return "";
    })
    .join("");
}