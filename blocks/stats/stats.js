import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Builds a stat element from a cell, moving its children (keeps inline
 * formatting such as <strong> or <sup>) and falling back to plain text.
 * @param {Element} cell source cell
 * @param {string} className class for the new element
 * @returns {HTMLParagraphElement}
 */
function buildPart(cell, className) {
  const p = document.createElement('p');
  p.className = className;
  if (!cell) return p;

  // a cell authored as a single <p> or heading: use its inline content
  const source = cell.children.length === 1 && /^(P|H[1-6])$/.test(cell.firstElementChild.tagName)
    ? cell.firstElementChild
    : cell;
  while (source.firstChild) p.append(source.firstChild);
  return p;
}

/**
 * Stats block
 * Each row: | number | label |
 * Variant: Stats (dark)
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'stats-list';
  // keep list semantics in Safari/VoiceOver despite list-style: none
  ul.setAttribute('role', 'list');

  [...block.children].forEach((row) => {
    const [valueCell, labelCell] = row.children;
    const li = document.createElement('li');
    li.className = 'stats-item';
    moveInstrumentation(row, li);

    const value = buildPart(valueCell, 'stats-value');
    const label = buildPart(labelCell, 'stats-label');

    // skip empty rows
    if (!value.textContent.trim() && !label.textContent.trim()) return;

    li.append(value);
    if (label.textContent.trim()) li.append(label);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
