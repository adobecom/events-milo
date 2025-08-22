import { createTag } from '../../scripts/utils.js';

class Drawer {
  constructor(root, cfg = {}) {
    if (!root) throw new Error('Drawer needs a root element.');

    this.root = root;
    this.cfg = cfg;
    this.items = cfg.items || [];
    this.renderItem = cfg.renderItem || (() => createTag('div', { class: 'drawer-item' }, 'Item'));
    this.onClick = cfg.onItemClick || (() => {});
    this.itemsEl = null;

    this.render();
  }

  render() {
    const drawer = createTag('div', {
      class: 'drawer',
      'aria-label': this.cfg.ariaLabel || 'Drawer',
    });

    const content = createTag('div', { class: 'drawer-content' });
    this.itemsEl = createTag('div', { class: 'drawer-items' });

    this.items.forEach((data, i) => {
      const el = this.renderItem(data, i);
      if (!el) return;
      if (i === 0) el.classList.add('current');
      this.bindEvents(el, data);
      this.itemsEl.append(el);
    });

    content.append(this.itemsEl);
    drawer.append(content);
    this.root.append(drawer);
  }

  bindEvents(el, data) {
    const handler = () => this.setActive(el, data);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  }

  async setActive(el, data) {
    this.itemsEl?.querySelectorAll('.drawer-item.current')
      .forEach((i) => i.classList.remove('current'));
    el.classList.add('current');
    try {
      await this.onClick(el, data);
    } catch (e) {
      window.lana?.log(`Drawer click failed: ${e.message}`);
    }
  }

  setActiveById(id) {
    const el = this.itemsEl?.querySelector(`[data-id="${id}"]`);
    if (el) {
      // Only update visual state, don't trigger click handler
      this.itemsEl?.querySelectorAll('.drawer-item.current')
        .forEach((i) => i.classList.remove('current'));
      el.classList.add('current');
    }
  }

  remove() {
    // Remove the drawer element from the DOM
    const drawerElement = this.root.querySelector('.drawer');
    if (drawerElement) {
      drawerElement.remove();
    }
  }
}

export default function initDrawers(root, cfg) {
  try {
    return new Drawer(root, cfg);
  } catch (e) {
    window.lana?.log(`Drawer init failed: ${e.message}`);
    return null;
  }
}
