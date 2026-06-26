// Parte un texto en líneas de ancho <= width, respetando \n y palabras.
// Palabras más largas que width se cortan duro. Usado por la vista de
// descripción completa (scroll por líneas).
export function wrapText(text: string, width: number): string[] {
  const w = Math.max(1, width);
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    const pushWord = (word: string) => {
      let r = word;
      while (r.length > w) {
        out.push(r.slice(0, w));
        r = r.slice(w);
      }
      line = r;
    };
    for (const word of words) {
      if (line === "") pushWord(word);
      else if (line.length + 1 + word.length <= w) line += " " + word;
      else {
        out.push(line);
        pushWord(word);
      }
    }
    if (line) out.push(line);
  }
  return out;
}
