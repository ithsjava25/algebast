import katex from 'katex';
import 'katex/dist/katex.min.css';

export function renderMath(text) {
  // Skydd mot tomma värden
  if (text === null || text === undefined || text === '') return '';
  
  // Säkerställ att vi jobbar med en sträng (om databasen skickar ett heltal)
  let renderedText = String(text);

  // Om texten saknar LaTeX-tecken, skippa regex helt
  if (!renderedText.includes('$') && !renderedText.includes('\\')) {
    return renderedText;
  }

  try {
    // Ersätt block-matematik (visas på egen rad, centrerat)
    renderedText = renderedText.replace(/\$\$(.*?)\$\$/g, (match, formula) => render(formula, true, match));
    renderedText = renderedText.replace(/\\\[(.*?)\\\]/g, (match, formula) => render(formula, true, match));

    // Ersätt inline-matematik (inbakat i den vanliga texten)
    renderedText = renderedText.replace(/\$(.*?)\$/g, (match, formula) => render(formula, false, match));
    renderedText = renderedText.replace(/\\\((.*?)\\\)/g, (match, formula) => render(formula, false, match));
  } catch (e) {
    console.error("KaTeX fel:", e);
  }

  return renderedText;
}

// Hjälpfunktion för att anropa KaTeX säkert
function render(formula, isBlock, fallback) {
  try {
    return katex.renderToString(formula, { 
      displayMode: isBlock, 
      throwOnError: false  
    });
  } catch {
    return fallback; // Returnera originaltexten om renderingen misslyckas
  }
}