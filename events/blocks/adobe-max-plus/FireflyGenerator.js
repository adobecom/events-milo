import { useRef, useEffect } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import fireflyGeneratorInit from '../firefly-generator/firefly-generator.js';

/**
 * FireflyGenerator Preact wrapper component
 * Wraps the standalone firefly-generator block for use in the adobe-max-plus monoblock
 */
export default function FireflyGenerator({ title, promptLabel, placeholder, buttonText }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build config rows for block parsing
    const configRows = [
      title && `<div><div>title</div><div>${title}</div></div>`,
      promptLabel && `<div><div>prompt-label</div><div>${promptLabel}</div></div>`,
      placeholder && `<div><div>placeholder</div><div>${placeholder}</div></div>`,
      buttonText && `<div><div>button-text</div><div>${buttonText}</div></div>`,
    ].filter(Boolean);

    containerRef.current.innerHTML = configRows.join('');
    fireflyGeneratorInit(containerRef.current);
  }, []); // Initialize once on mount

  return html`<div class="firefly-generator" ref=${containerRef}></div>`;
}

