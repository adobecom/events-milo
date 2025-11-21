import { SOCIAL_ICONS } from './constants.js';

const SHARE_MENU_SELECTOR = '.share-menu-wrapper';
const SHARE_TRIGGER_SELECTOR = '.video-playlist-container__social-share';
const ACTIVE_CLASS = 'active';

const qs = (selector, root = document) => root.querySelector(selector);

export function createSocialShareMarkup(config) {
  if (!config.socialSharing) return '';
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(config.playlistTitle);
  const text = encodeURIComponent(config.twitterCustomText || config.playlistTitle);

  const items = [
    config.enableFacebook && {
      key: 'facebook',
      icon: SOCIAL_ICONS.facebook,
      alt: config.facebookAltText,
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      daa: 'Facebook_Share Playlist',
      external: true,
    },
    config.enableTwitter && {
      key: 'twitter',
      icon: SOCIAL_ICONS.twitter,
      alt: config.twitterAltText,
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      daa: 'Twitter_Share Playlist',
      external: true,
    },
    config.enableLinkedIn && {
      key: 'linkedin',
      icon: SOCIAL_ICONS.linkedin,
      alt: config.linkedInAltText,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      daa: 'LinkedIn_Share Playlist',
      external: true,
    },
    config.enableCopyLink && {
      key: 'copy',
      icon: SOCIAL_ICONS.copy,
      alt: config.copyLinkAltText,
      href: '#',
      daa: 'Link_Share Playlist',
      external: false,
    },
  ].filter(Boolean);

  if (!items.length) return '';

  const list = items
    .map(
      (item) => `<li>
        <a class="video-playlist-container__social-share-menu__item"
           data-platform="${item.key}"
           daa-ll="${item.daa}"
           aria-label="${item.alt}"
           href="${item.href}"${item.external ? ' target="_blank"' : ''}>
          <svg width="16" height="16" viewBox="0 0 ${
            item.key === 'twitter' ? '1200 1227' : '16 16'
          }" fill="none" xmlns="http://www.w3.org/2000/svg">${item.icon}</svg>
          <span>${item.alt}</span>
        </a>
      </li>`,
    )
    .join('');

  return `
    <div class="video-playlist-container__social-share-wrapper">
      <button class="video-playlist-container__social-share" daa-ll="Social_Share" aria-expanded="false">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M12 6c.8 0 1.5.7 1.5 1.5S12.8 9 12 9s-1.5-.7-1.5-1.5S11.2 6 12 6zM4 6c.8 0 1.5.7 1.5 1.5S4.8 9 4 9s-1.5-.7-1.5-1.5S3.2 6 4 6zM8 6c.8 0 1.5.7 1.5 1.5S8.8 9 8 9s-1.5-.7-1.5-1.5S7.2 6 8 6z"/>
        </svg>
      </button>
      <div class="share-menu-wrapper">
        <ul class="video-playlist-container__social-share-menu">${list}</ul>
      </div>
    </div>`;
}

function closeShareMenu(menu, trigger) {
  menu.classList.remove(ACTIVE_CLASS);
  trigger.setAttribute('aria-expanded', 'false');
}

function handleToggle(event, menu, trigger) {
  event.stopPropagation();
  menu.classList.toggle(ACTIVE_CLASS);
  const isActive = menu.classList.contains(ACTIVE_CLASS);
  trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
}

function handleShareLinkClick(event, link, onCopy, closeMenu) {
  const platform = link.dataset.platform;
  if (platform === 'copy') {
    event.preventDefault();
    onCopy?.();
  } else if (!link.target) {
    event.preventDefault();
    window.open(link.href, 'share-window', 'width=600,height=400,scrollbars=yes');
  }
  closeMenu();
}

export function wireSocialShare(root, { onCopy }) {
  const trigger = qs(SHARE_TRIGGER_SELECTOR, root);
  const menu = qs(SHARE_MENU_SELECTOR, root);

  if (!trigger || !menu) return () => {};
  const boundCloseMenu = () => closeShareMenu(menu, trigger);
  const onDocumentClick = () => boundCloseMenu();
  document.addEventListener('click', onDocumentClick);

  const onToggle = (event) => handleToggle(event, menu, trigger);
  trigger.addEventListener('click', onToggle);

  const linkHandlers = [];
  menu.querySelectorAll('a').forEach((link) => {
    const handler = (event) => handleShareLinkClick(event, link, onCopy, boundCloseMenu);
    link.addEventListener('click', handler);
    linkHandlers.push(() => link.removeEventListener('click', handler));
  });

  return () => {
    document.removeEventListener('click', onDocumentClick);
    trigger.removeEventListener('click', onToggle);
    linkHandlers.forEach((removeListener) => removeListener());
  };
}
