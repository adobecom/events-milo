import { createTag } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

// Create toggle button with event handling
const createToggle = (c, cfg) => {
  if (!cfg.drawertitle) return null;

  const btn = createTag('button', {
    class: 'drawer-toggle',
    'aria-expanded': 'false',
    'aria-label': cfg.drawertitle,
  }, [
    createTag('span', { class: 'drawer-toggle-label' }, cfg.drawertitle),
    createTag('span', { class: 'drawer-toggle-icon' })
  ]);

  btn.onclick = () => {
    const exp = btn.getAttribute('aria-expanded') === 'true';
    const drawer = c.querySelector('.mobile-rider-drawer');
    if (drawer) {
      drawer.classList.toggle('drawer-open');
      btn.setAttribute('aria-expanded', !exp);
      btn.setAttribute('aria-label', exp ? cfg.drawertitle : 'Close drawer');
    }
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
  if (!cfg.drawerenabled) return null;

  // Create drawer container (no fixed/absolute positioning)
  const drawer = createTag('div', {
    class: `mobile-rider-drawer ${cfg.drawerposition || 'bottom'}`,
    'aria-label': cfg.drawertitle || 'Related Videos',
    style: 'width: 100%; box-sizing: border-box;'
  });

  // Add toggle button
  const toggle = createToggle(c, cfg);
  if (toggle) drawer.appendChild(toggle);

  // Add content
  const content = createTag('div', { class: 'drawer-content' });
  if (cfg.drawertitle) {
    content.appendChild(createTag('h2', { class: 'drawer-title' }, cfg.drawertitle));
  }

  // Create video list
  const list = createTag('div', { class: 'drawer-items' });

  // Render all videos from cfg.videos array
  (cfg.videos || []).forEach((video, idx) => {
    const item = createTag('div', {
      class: 'drawer-item',
      role: 'button',
      tabindex: '0',
      'data-vid': video.videoid,
      'data-asl': video.aslid
    });

    // Thumbnail
    const thumbnail = createTag('div', { class: 'drawer-item-thumbnail' });
    if (video.thumbnail) {
      thumbnail.appendChild(createTag('img', {
        src: video.thumbnail,
        alt: video.title
      }));
    }
    item.appendChild(thumbnail);

    // Content
    const contentDiv = createTag('div', { class: 'drawer-item-content' });
    contentDiv.appendChild(createTag('div', { class: 'drawer-item-title' }, video.title));
    if (video.description) {
      contentDiv.appendChild(createTag('div', { class: 'drawer-item-description' }, video.description));
    }
    item.appendChild(contentDiv);

    // Click handler: load this video in the main player
    item.onclick = () => {
      const mainVid = c.querySelector('.mobile-rider-viewport');
      if (mainVid && window.mobilerider) {
        if (window.__mr_player && window.__mr_player.dispose) {
          window.__mr_player.dispose();
        }
        window.__mr_player = window.mobilerider.embed(
          mainVid.id,
          video.videoid,
          cfg.skinid,
          {
            autoplay: true,
            controls: true,
            muted: true,
            analytics: { provider: 'adobe' },
            identifier1: video.videoid,
            identifier2: video.aslid
          }
        );
      }
      list.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('current'));
      item.classList.add('current');
    };

    // Mark the first video as current by default
    if (idx === 0) item.classList.add('current');

    list.appendChild(item);
  });

  content.appendChild(list);
  drawer.appendChild(content);
  c.appendChild(drawer);

  return drawer;
}

function injectPlayer(wrapper, videoId, skinId, aslId = null) {
  // Remove any existing player (iframe or video)
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  // Create a new div for the player
  const playerDiv = document.createElement('div');
  playerDiv.id = 'mr-adobe-player';
  wrapper.appendChild(playerDiv);

  // Dispose of existing player if it exists
  if (window.__mr_player) {
    window.__mr_player.dispose();
    window.__mr_player = null;
  }

  // Initialize new player (let MobileRider handle the internals)
  window.__mr_player = window.mobilerider.embed(
    playerDiv.id,
    videoId,
    skinId,
    {
      autoplay: true,
      controls: true,
      muted: false,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: videoId,
      identifier2: aslId
    }
  );

  return window.__mr_player;
}
