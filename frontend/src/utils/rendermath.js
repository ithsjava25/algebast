import katex from 'katex';
import 'katex/dist/katex.min.css';

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderMath(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Regex för att matcha inline- och blockmatematik ($..., $$..., \(...\), \[...\])
  const mathRegex = /\$\$([\s\S]*?)\$\$|\$([^\$]+?)\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;

  if (!mathRegex.test(text)) {
    return escapeHtml(text);
  }

  mathRegex.lastIndex = 0;

  let lastIndex = 0;
  let result = '';
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    const plainText = text.slice(lastIndex, match.index);
    if (plainText) {
      result += escapeHtml(plainText);
    }

    const fullMatch = match[0];
    const displayMode = fullMatch.startsWith('$$') || fullMatch.startsWith('\\[');
    const mathContent = match[1] || match[2] || match[3] || match[4];

    try {
      result += katex.renderToString(mathContent, {
        displayMode: displayMode,
        throwOnError: true,
      });
    } catch (e) {
      result += escapeHtml(fullMatch);
    }

    lastIndex = mathRegex.lastIndex;
  }


  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    result += escapeHtml(remainingText);
  }

  return result;
}