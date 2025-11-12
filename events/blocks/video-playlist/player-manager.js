import {
  MPC_STATUS,
  EVENT_STATES,
  PROGRESS_SAVE_INTERVAL,
  RESTART_THRESHOLD,
  VIDEO_ORIGIN,
} from './constants.js';
import {
  saveCurrentVideoProgress,
  getLocalStorageVideos,
  saveLocalStorageVideos,
  getLocalStorageShouldAutoPlay,
  findVideoIdFromIframeSrc,
  startVideoFromSecond,
} from './utils.js';

const qs = (selector, root = document) => root.querySelector(selector);

export class PlayerManager {
  constructor({
    highlightSession,
    updateProgressBar,
    getCards,
    navigateTo,
  }) {
    this.highlightSession = highlightSession;
    this.updateProgressBar = updateProgressBar;
    this.getCards = getCards;
    this.navigateTo = navigateTo;

    this.videoContainer = null;
    this.progressInterval = null;
    this.youtubePlayer = null;
    this.mo = null;
    this.cleanupFns = [];

    this.boundMessageHandler = (event) => this.handleMpcMessage(event);
  }

  bootstrap() {
    const tryInit = () => {
      this.videoContainer = qs('.milo-video');
      if (this.videoContainer) {
        this.onPlayerMounted();
        return true;
      }
      return false;
    };

    if (tryInit()) return;

    this.mo = new MutationObserver(() => {
      if (tryInit() && this.mo) {
        this.mo.disconnect();
        this.mo = null;
      }
    });

    this.mo.observe(document.body, { childList: true, subtree: true });
  }

  cleanup() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.youtubePlayer?.destroy) {
      this.youtubePlayer.destroy();
      this.youtubePlayer = null;
    }

    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.debug('PlayerManager cleanup error:', err);
      }
    });
    this.cleanupFns = [];

    if (this.mo) {
      this.mo.disconnect();
      this.mo = null;
    }

    window.removeEventListener('message', this.boundMessageHandler);
  }

  onPlayerMounted() {
    this.highlightCurrentSession();
    window.removeEventListener('message', this.boundMessageHandler);
    window.addEventListener('message', this.boundMessageHandler);
    this.setupYouTubeHook();
  }

  highlightCurrentSession() {
    const id = this.currentVideoId();
    if (id && typeof this.highlightSession === 'function') {
      this.highlightSession(id);
    }
  }

  currentVideoId() {
    if (!this.videoContainer) return null;
    const lite = qs('lite-youtube', this.videoContainer);
    if (lite) return lite.getAttribute('videoid');
    const iframe = qs('iframe', this.videoContainer);
    return iframe ? findVideoIdFromIframeSrc(iframe.getAttribute('src')) : null;
  }

  handleMpcMessage(event) {
    if (event.origin !== VIDEO_ORIGIN || event.data.type !== MPC_STATUS) return;
    const data = event.data;

    switch (data.state) {
      case EVENT_STATES.LOAD:
        this.handleMpcLoad(data);
        break;
      case EVENT_STATES.PAUSE:
        saveCurrentVideoProgress(data.id, data.currentTime);
        break;
      case EVENT_STATES.TICK:
        if (data.currentTime % PROGRESS_SAVE_INTERVAL === 0) {
          saveCurrentVideoProgress(data.id, data.currentTime, data.length);
          this.updateProgress(data.id, data.currentTime, data.length);
        }
        break;
      case EVENT_STATES.COMPLETE:
        this.handleComplete(data.id);
        break;
      default:
        break;
    }
  }

  handleMpcLoad(data) {
    this.highlightCurrentSession();
    const videos = getLocalStorageVideos();
    const current = videos[data.id];
    const start =
      current?.secondsWatched > data.length - RESTART_THRESHOLD
        ? 0
        : current?.secondsWatched || 0;
    startVideoFromSecond(this.videoContainer, start);
  }

  handleComplete(videoId) {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    const videos = getLocalStorageVideos();
    if (videos[videoId]) {
      videos[videoId].completed = true;
      if (videos[videoId].length) {
        videos[videoId].secondsWatched = videos[videoId].length;
      }
      saveLocalStorageVideos(videos);
      this.updateProgress(videoId, videos[videoId].length, videos[videoId].length);
    }

    if (!getLocalStorageShouldAutoPlay()) return;

    const cards = this.getCards?.() ?? [];
    const index = cards.findIndex(
      (card) =>
        card.search.mpcVideoId === videoId || card.search.videoId === videoId,
    );
    if (index === -1 || index >= cards.length - 1) return;

    const nextUrl = cards[index + 1].overlayLink;
    // TODO: Add playlist ID to URL when AEM implementation is ready
    // 1. Uncomment VIDEO_PLAYLIST_ID_URL_KEY in constants.js
    // 2. Import getCurrentPlaylistId from utils.js (to be implemented based on AEM requirements)
    // 3. Uncomment the following code:
    // const playlistId = getCurrentPlaylistId();
    // if (playlistId) {
    //   const next = new URL(nextUrl, window.location.origin);
    //   next.searchParams.set(VIDEO_PLAYLIST_ID_URL_KEY, playlistId);
    //   nextUrl = next.href;
    // }

    if (typeof this.navigateTo === 'function') {
      this.navigateTo(nextUrl);
    } else {
      window.location.href = nextUrl;
    }
  }

  updateProgress(videoId, current, length) {
    if (typeof this.updateProgressBar === 'function') {
      this.updateProgressBar(videoId, current, length);
    }
  }

  setupYouTubeHook() {
    const lite = qs('lite-youtube', this.videoContainer);
    const iframe = qs('iframe', this.videoContainer);
    const videoId =
      lite?.getAttribute('videoid') ||
      (iframe ? findVideoIdFromIframeSrc(iframe.src) : null);
    const srcRef = lite ? videoId : iframe?.src;
    if (!videoId || !this.isYouTube(srcRef)) return;

    if (lite) {
      const onClick = () => {
        const timer = setInterval(() => {
          const newIframe = qs('iframe', this.videoContainer);
          if (newIframe?.src.includes('youtube-nocookie.com/embed/')) {
            clearInterval(timer);
            this.enableYTAPI(newIframe, videoId);
          }
        }, 100);
        this.cleanupFns.push(() => clearInterval(timer));
      };
      lite.addEventListener('click', onClick);
      this.cleanupFns.push(() => lite.removeEventListener('click', onClick));
    } else if (iframe?.src.includes('enablejsapi=1')) {
      this.attachYT(iframe, videoId);
    } else {
      this.enableYTAPI(iframe, videoId);
    }
  }

  isYouTube(src) {
    if (!src) return false;
    const value = String(src);
    return (
      value.includes('youtube.com') ||
      value.includes('youtube-nocookie.com') ||
      value.length === 11
    );
  }

  enableYTAPI(iframe, videoId) {
    if (!iframe) return;
    try {
      const url = new URL(iframe.src);
      url.searchParams.set('enablejsapi', '1');
      url.searchParams.set('origin', window.location.origin);
      const videos = getLocalStorageVideos();
      if (videos[videoId]?.secondsWatched > RESTART_THRESHOLD) {
        url.searchParams.set('start', Math.floor(videos[videoId].secondsWatched));
      }
      const onLoad = () => this.attachYT(iframe, videoId);
      iframe.addEventListener('load', onLoad, { once: true });
      this.cleanupFns.push(() => iframe.removeEventListener('load', onLoad));
      iframe.src = url.toString();
    } catch (err) {
      console.error('YT iframe modify error:', err);
    }
  }

  async attachYT(iframe, videoId) {
    await this.ensureYT();
    try {
      let id = iframe.getAttribute('id');
      if (!id) {
        id = `player-${videoId}-${Date.now()}`;
        iframe.setAttribute('id', id);
      }
      this.youtubePlayer = new window.YT.Player(id, {
        events: {
          onReady: () => this.startYT(this.youtubePlayer, videoId),
          onStateChange: (event) => this.handleYTState(event, videoId),
        },
      });
    } catch (err) {
      console.error('YT.Player error:', err);
    }
  }

  ensureYT() {
    if (window.YT?.Player) return Promise.resolve();
    const hasScript = [...document.scripts].some((script) =>
      script.src.includes('youtube.com/iframe_api'),
    );
    if (!hasScript) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(tag, first);
    }
    return new Promise((resolve) => {
      const tryReady = () => {
        if (window.YT?.Player) {
          resolve();
          return true;
        }
        return false;
      };
      if (tryReady()) return;
      const interval = setInterval(() => {
        if (tryReady()) clearInterval(interval);
      }, 100);
      this.cleanupFns.push(() => clearInterval(interval));
    });
  }

  startYT(player, videoId) {
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(
      () => this.tickYT(player, videoId),
      1000,
    );
  }

  handleYTState(event, videoId) {
    const { PlayerState } = window.YT;
    if (event.data === PlayerState.PLAYING) {
      this.startYT(event.target, videoId);
    } else if (
      event.data === PlayerState.PAUSED ||
      event.data === PlayerState.BUFFERING
    ) {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      this.tickYT(event.target, videoId);
    } else if (event.data === PlayerState.ENDED) {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      this.handleComplete(videoId);
    }
  }

  async tickYT(player, videoId) {
    try {
      const current = player.getCurrentTime();
      const duration = player.getDuration();
      const shouldSave =
        (current && Math.floor(current) % PROGRESS_SAVE_INTERVAL === 0) ||
        (duration && duration - current < 1);
      if (shouldSave) {
        await saveCurrentVideoProgress(videoId, current, duration);
        this.updateProgress(videoId, current, duration);
      }
    } catch (err) {
      console.error('YT progress error:', err);
    }
  }
}


