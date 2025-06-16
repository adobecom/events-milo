import { createTag } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

// Create toggle button with event handling
const createToggle = (c, cfg) => {
  if (!cfg.showmsg || !cfg.hidemsg) return null;

  const btn = createTag('button', {
    class: 'drawer-toggle',
    'aria-expanded': 'false',
    'aria-label': cfg.showmsg,
  }, [
    createTag('span', { class: 'drawer-toggle-label' }, cfg.showmsg),
    createTag('span', { class: 'drawer-toggle-icon' })
  ]);

  btn.onclick = () => {
    const exp = btn.getAttribute('aria-expanded') === 'true';
    const msg = exp ? cfg.showmsg : cfg.hidemsg;
    btn.setAttribute('aria-expanded', !exp);
    c.classList.toggle('drawer-open');
    btn.querySelector('.drawer-toggle-label').textContent = msg;
    btn.setAttribute('aria-label', msg);
  };

  return btn;
};

// Create video thumbnail with metadata
const createThumb = (v, onClick) => {
  const item = createTag('div', {
    class: 'drawer-item',
    role: 'button',
    tabindex: '0',
    'data-vid': v.videoId,
    'data-asl': v.aslId,
    'data-session': v.sessionId
  }, [
    createTag('div', { class: 'drawer-item-thumbnail' }, 
      v.thumbnail ? [createTag('img', {
        src: v.thumbnail,
        alt: v.title || '',
        loading: 'lazy'
      })] : []
    ),
    createTag('div', { class: 'drawer-item-content' }, [
      v.title && createTag('h3', { class: 'drawer-item-title' }, v.title),
      v.description && createTag('p', { class: 'drawer-item-description' }, v.description)
    ].filter(Boolean))
  ]);

  if (onClick) {
    item.onclick = () => onClick(v, item);
    item.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(v, item);
      }
    };
  }

  return item;
};

// Initialize drawer with video list
export default function initDrawer(c, cfg) {
  if (!cfg.concurrentenabled || cfg.concurrentenabled !== 'true') return null;

  // Create drawer container
  const drawer = createTag('div', {
    class: `mobile-rider-drawer ${cfg.drawerposition || 'right'}`,
    'aria-label': cfg.drawertitle || 'Concurrent Video'
  });

  // Add toggle button
  const toggle = createToggle(c, cfg);
  if (toggle) drawer.appendChild(toggle);

  // Create content container with title
  const content = createTag('div', { class: 'drawer-content' });
  if (cfg.concurrenttitle) {
    content.appendChild(createTag('h2', { class: 'drawer-title' }, cfg.concurrenttitle));
  }

  // Create video list (single concurrent video)
  const list = createTag('div', { class: 'drawer-items' });

  // Only one concurrent video is authored in the flattened config
  const v = {
    videoId: cfg.concurrentvideoid,
    aslId: cfg.concurrentaslid,
    title: cfg.concurrenttitle,
    description: cfg.concurrentdescription,
    sessionId: cfg.concurrentsessionid
  };

  // Create the card
  const item = createTag('div', {
    class: 'drawer-item',
    role: 'button',
    tabindex: '0',
    'data-vid': v.videoId,
    'data-asl': v.aslId,
    'data-session': v.sessionId
  }, [
    createTag('div', { class: 'drawer-item-content' }, [
      v.title && createTag('h3', { class: 'drawer-item-title' }, v.title),
      v.description && createTag('p', { class: 'drawer-item-description' }, v.description)
    ].filter(Boolean))
  ]);

  // Click handler: load concurrent video into main player
  item.onclick = () => {
    const mainVid = c.querySelector('.mobile-rider-viewport');
    if (mainVid) {
      // Dispose previous player if needed
      if (window.__mr_player && window.__mr_player.dispose) {
        window.__mr_player.dispose();
      }
      // Re-embed with new video/ASL
      window.__mr_player = window.mobilerider?.embed(
        mainVid.id,
        v.videoId,
        cfg.skinid,
        {
          autoplay: true,
          controls: true,
          muted: true,
          analytics: { provider: 'adobe' },
          identifier1: v.videoId,
          identifier2: v.aslId
        }
      );
      // Update store with session status
      if (v.sessionId) {
        mobileRiderStore.set(v.sessionId, true);
      }
    }
    // UI feedback (optional): highlight selected
    list.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('current'));
    item.classList.add('current');
  };

  // Keyboard accessibility
  item.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.onclick();
    }
  };

  list.appendChild(item);
  content.appendChild(list);
  drawer.appendChild(content);
  c.appendChild(drawer);

  return drawer;
}
