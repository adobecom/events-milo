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
  if (!cfg.drawerenabled === 'true') return null;

  // Create drawer container
  const drawer = createTag('div', {
    class: `mobile-rider-drawer ${cfg.drawerposition || 'right'}`,
    'aria-label': cfg.drawertitle || 'Related Videos'
  });

  // Add toggle button
  const toggle = createToggle(c, cfg);
  if (toggle) drawer.appendChild(toggle);

  // Create content container with title
  const content = createTag('div', { class: 'drawer-content' });
  if (cfg.drawertitle) {
    content.appendChild(createTag('h2', { class: 'drawer-title' }, cfg.drawertitle));
  }

  // Create video list
  const list = createTag('div', { class: 'drawer-items' });
  const items = [
    ...(cfg.relatedcontent ? JSON.parse(cfg.relatedcontent) : []),
    ...(cfg.timing?.variations || [])
  ];

  // Add video thumbnails with click handlers
  items.forEach(v => {
    list.appendChild(createThumb(v, (video, thumb) => {
      // Update video IDs
      const mainVid = c.querySelector('.main-video');
      if (mainVid) mainVid.id = `id${video.videoId}`;

      if (cfg.enableasl === 'true') {
        const aslVid = c.querySelector('.asl-video');
        if (aslVid && video.aslId) aslVid.id = `id${video.aslId}`;
      }

      // Update players
      window.mrPlayer?.changeMedia(video.videoId);
      if (video.aslId) window.mrPlayerASL?.changeMedia(video.aslId);

      // Update store with session status
      if (video.sessionId) {
        mobileRiderStore.set(video.sessionId, true);
      }

      // Update selection
      list.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('current'));
      thumb.classList.add('current');
    }));
  });

  content.appendChild(list);
  drawer.appendChild(content);
  c.appendChild(drawer);

  return drawer;
}
