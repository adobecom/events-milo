import { useRef, useEffect } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import fireflyGalleryInit from '../firefly-gallery/firefly-gallery.js';

/**
 * FireflyGallery Preact wrapper component
 * Wraps the standalone firefly-gallery block for use in the adobe-max-plus monoblock
 */
export default function FireflyGallery({ title, category, count }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build config rows for block parsing
    const configRows = [
      title && `<div><div>title</div><div>${title}</div></div>`,
      category && `<div><div>category</div><div>${category}</div></div>`,
      count && `<div><div>count</div><div>${count}</div></div>`,
    ].filter(Boolean);

    containerRef.current.innerHTML = configRows.join('');
    fireflyGalleryInit(containerRef.current);
  }, []); // Initialize once on mount

  return html`<div class="firefly-gallery" ref=${containerRef}></div>`;
}

