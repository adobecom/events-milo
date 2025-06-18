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

  // Create content container with title
  const content = createTag('div', { class: 'drawer-content' });
  if (cfg.drawertitle) {
    content.appendChild(createTag('h2', { class: 'drawer-title' }, cfg.drawertitle));
  }

  // Create video list
  const list = createTag('div', { class: 'drawer-items' });

  // Add main video to drawer
  const mainVideo = {
    videoId: cfg.videoid,
    aslId: cfg.aslid,
    title: 'Main Stream',
    description: cfg.description,
    thumbnail: cfg.thumbnail
  };

  // Create the main video card
  const mainItem = createTag('div', {
    class: 'drawer-item',
    role: 'button',
    tabindex: '0',
    'data-vid': mainVideo.videoId,
    'data-asl': mainVideo.aslId
  });

  // Add thumbnail if available
  const thumbnail = createTag('div', { class: 'drawer-item-thumbnail' });
  if (mainVideo.thumbnail) {
    thumbnail.appendChild(createTag('img', {
      src: mainVideo.thumbnail,
      alt: mainVideo.title
    }));
  }
  mainItem.appendChild(thumbnail);

  // Add content
  const mainContent = createTag('div', { class: 'drawer-item-content' });
  mainContent.appendChild(createTag('div', { class: 'drawer-item-title' }, mainVideo.title));
  if (mainVideo.description) {
    mainContent.appendChild(createTag('div', { class: 'drawer-item-description' }, mainVideo.description));
  }
  mainItem.appendChild(mainContent);

  // Add click handler
  mainItem.onclick = () => {
    const mainVid = c.querySelector('.mobile-rider-viewport');
    if (mainVid && window.mobilerider) {
      if (window.__mr_player && window.__mr_player.dispose) {
        window.__mr_player.dispose();
      }
      window.__mr_player = window.mobilerider.embed(
        mainVid.id,
        mainVideo.videoId,
        cfg.skinid,
        {
          autoplay: true,
          controls: true,
          muted: true,
          analytics: { provider: 'adobe' },
          identifier1: mainVideo.videoId,
          identifier2: mainVideo.aslId
        }
      );
    }
    list.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('current'));
    mainItem.classList.add('current');
  };

  list.appendChild(mainItem);

  // Add concurrent video if available
  if (cfg.concurrentvideoid) {
    const concurrentVideo = {
      videoId: cfg.concurrentvideoid,
      aslId: cfg.concurrentaslid,
      title: cfg.concurrenttitle || 'Concurrent Stream',
      description: cfg.concurrentdescription,
      thumbnail: cfg.concurrentthumbnail
    };

    const concurrentItem = createTag('div', {
      class: 'drawer-item',
      role: 'button',
      tabindex: '0',
      'data-vid': concurrentVideo.videoId,
      'data-asl': concurrentVideo.aslId
    });

    // Add thumbnail if available
    const concurrentThumbnail = createTag('div', { class: 'drawer-item-thumbnail' });
    if (concurrentVideo.thumbnail) {
      concurrentThumbnail.appendChild(createTag('img', {
        src: concurrentVideo.thumbnail,
        alt: concurrentVideo.title
      }));
    }
    concurrentItem.appendChild(concurrentThumbnail);

    // Add content
    const concurrentContent = createTag('div', { class: 'drawer-item-content' });
    concurrentContent.appendChild(createTag('div', { class: 'drawer-item-title' }, concurrentVideo.title));
    if (concurrentVideo.description) {
      concurrentContent.appendChild(createTag('div', { class: 'drawer-item-description' }, concurrentVideo.description));
    }
    concurrentItem.appendChild(concurrentContent);

    // Add click handler
    concurrentItem.onclick = () => {
      const mainVid = c.querySelector('.mobile-rider-viewport');
      if (mainVid && window.mobilerider) {
        if (window.__mr_player && window.__mr_player.dispose) {
          window.__mr_player.dispose();
        }
        window.__mr_player = window.mobilerider.embed(
          mainVid.id,
          concurrentVideo.videoId,
          cfg.skinid,
          {
            autoplay: true,
            controls: true,
            muted: true,
            analytics: { provider: 'adobe' },
            identifier1: concurrentVideo.videoId,
            identifier2: concurrentVideo.aslId
          }
        );
      }
      list.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('current'));
      concurrentItem.classList.add('current');
    };

    list.appendChild(concurrentItem);
  }

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
