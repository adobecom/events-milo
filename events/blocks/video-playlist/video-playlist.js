/* VideoPlaylist.js */
// eslint-disable-next-line no-underscore-dangle
import { LIBS } from '../../scripts/utils.js';
import {
  getLocalStorageVideos, saveLocalStorageVideos, saveCurrentVideoProgress,
  getLocalStorageShouldAutoPlay, saveShouldAutoPlayToLocalStorage,
  getCurrentPlaylistId, findVideoIdFromIframeSrc, startVideoFromSecond
} from './utils.js';
import {
  PLAYLIST_PLAY_ALL_ID, MPC_STATUS, RESTART_THRESHOLD, PROGRESS_SAVE_INTERVAL,
  VIDEO_ORIGIN, VIDEO_PLAYLIST_ID_URL_KEY, TOAST_CONTAINER_ID, EVENT_STATES,
  ANALYTICS, MOCK_API, PLAYLIST_SKIP_TO_ID, SOCIAL_ICONS
} from './constants.js';
import { initAPI, ENDPOINTS } from './api.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default function init(el){ return new VideoPlaylist(el); }

/* helpers */
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const bool=(v,d)=>v==null||v===''?d:String(v).toLowerCase()==='true';
const int=(v,d)=>{const n=parseInt(v,10);return Number.isNaN(n)?d:n;};
const toKebab=(s)=>s?.trim().toLowerCase().replace(/ /g,'-')||'';
const getMeta=(root)=>Object.fromEntries(
  [...root.querySelectorAll(':scope > div > div:first-child')].map(div=>[
    toKebab(div.textContent), div.nextElementSibling?.textContent?.trim()||''
  ])
);

class VideoPlaylist{
  constructor(el){
    this.el=el; this.cfg={}; this.root=null; this.sessionsWrapper=null;
    this.cards=[]; this.currentPlaylistId=null; this.youtubePlayer=null;
    this.progressInterval=null; this.disposers=[]; this.mo=null;
    this.boundMsg=(e)=>this._onMpcMessage(e);
    this.init();
  }

  /* lifecycle */
  async init(){
    try{
      this.cfg=this._parseCfg();
      this.currentPlaylistId=getCurrentPlaylistId();
      this.root=this._createRoot(); this.el.appendChild(this.root);
      await this._loadAndRender();
      this._setupPlayerBootstrap();
    }catch(e){ console.error('VideoPlaylist init error:',e); }
  }
  cleanup(){
    if(this.progressInterval) clearInterval(this.progressInterval);
    if(this.youtubePlayer?.destroy) this.youtubePlayer.destroy();
    this.disposers.forEach(fn=>{try{fn()}catch{}});
    this.disposers.length=0;
    if(this.mo) this.mo.disconnect();
    window.removeEventListener('message',this.boundMsg);
  }

  /* config */
  _parseCfg(){
    const m=getMeta(this.el);
    return {
      playlistId: m['playlist-id']||null,
      playlistTitle: m['playlist-title']||'Video Playlist',
      topicEyebrow: m['topic-eyebrow']||'',
      autoplayText: m['autoplay-text']||'Play All',
      skipPlaylistText: m['skip-playlist-text']||m['skip-playlist']||'Skip playlist',
      minimumSessions: int(m['minimum-sessions']||m['minimum-session'],4),
      sort: m['sort']||'default',
      sortByTime: bool(m['sort-by-time'],false),
      isTagBased: bool(m['is-tagbased'],true),
      socialSharing: bool(m['social-sharing'],true),
      favoritesEnabled: bool(m['favorites-enabled'],true),
      favoritesTooltipText: m['favorites-tooltip-text']||m['tooltip-text']||'Add to favorites',
      favoritesNotificationText: m['favorites-notification-text']||'Session added to favorites',
      favoritesButtonText: m['favorites-button-text']||'View',
      favoritesButtonLink: m['favorites-button-link']||'/schedule',
      theme: m['theme']||'light',
      enableFacebook: bool(m['enable-facebook'],true),
      facebookAltText: m['facebook-alt-text']||'Share Playlist on Facebook',
      enableTwitter: bool(m['enable-twitter'],true),
      twitterCustomText: m['twitter-custom-text']||'',
      twitterAltText: m['twitter-alt-text']||'Share Playlist on X',
      enableLinkedIn: bool(m['enable-linkedin'],true),
      linkedInAltText: m['linked-in-alt-text']||'Share Playlist on LinkedIn',
      enableCopyLink: bool(m['enable-copy-link'],true),
      copyLinkAltText: m['copy-link-alt-text']||'Share with link',
      copyNotificationText: m['copy-notification-text']||'Link copied to clipboard!',
      sessionPaths: m['sessionpath']||'',
    };
  }
  _createRoot(){
    const c=createTag('div',{class:'video-playlist-container'});
    if(this.cfg.theme) c.classList.add(`consonant--${this.cfg.theme}`);
    c.style.display='none'; return c;
  }

  /* data */
  async _fetchCards(){
    if(this.cfg.isTagBased){
      const {cards=[]}=await MOCK_API.getSessions(); return cards.filter(c=>c.search.thumbnailUrl);
    }
    const pl=await MOCK_API.getUserAuthoredPlaylist(this.cfg);
    this.cfg.playlistTitle=pl.playlistTitle||this.cfg.playlistTitle;
    this.cfg.topicEyebrow=pl.topicEyebrow||this.cfg.topicEyebrow;
    const ids=pl.sessions.map(s=>s.entityId);
    const {cards=[]}=await MOCK_API.getChimeraFeaturedCards(ids);
    return cards.filter(c=>c.search.thumbnailUrl);
  }
  _sortCards(cards){
    if(this.cfg.sort==='default' && !this.cfg.sortByTime) return cards;
    let out=[...cards];
    if(this.cfg.sortByTime) out.sort((a,b)=>a.search.videoDuration.localeCompare(b.search.videoDuration));
    if(this.cfg.sort==='ascending') out.sort((a,b)=>a.contentArea.title.localeCompare(b.contentArea.title));
    if(this.cfg.sort==='descending') out.sort((a,b)=>b.contentArea.title.localeCompare(a.contentArea.title));
    return out;
  }

  /* render */
  async _loadAndRender(){
    try{
      const raw=await this._fetchCards();
      this.cards=this._sortCards(raw);
      if(this.cards.length<this.cfg.minimumSessions){ console.warn('Not enough sessions:',this.cfg.minimumSessions); return; }
      await this._render(this.cards);
    }catch(e){ console.error('Failed to load sessions:',e); }
  }
  async _render(cards){
    this.root.style.display='';
    this.root.appendChild(this._renderHeader());
    this.root.appendChild(this._renderSessions(cards));
    if(this.cfg.favoritesEnabled) await this._setupFavorites();
    this.root.appendChild(createTag('div',{id:PLAYLIST_SKIP_TO_ID,style:'height:1px;'}));
  }

  _renderHeader(){
    const h=createTag('div',{class:'video-playlist-container__header'});
    const checked=getLocalStorageShouldAutoPlay();
    h.innerHTML=`
      <div class="video-playlist-container__header__upper">
        <div class="video-playlist-container__header__upper__skipLink">
          <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">${this.cfg.skipPlaylistText}</a>
        </div>
        <div class="video-playlist-container__header__toggle">
          <div class="consonant-switch consonant-switch--sizeM">
            <input type="checkbox" class="consonant-switch-input" id="${PLAYLIST_PLAY_ALL_ID}" daa-ll="${checked?ANALYTICS.TOGGLE_OFF:ANALYTICS.TOGGLE_ON}" ${checked?'checked':''}/>
            <span class="consonant-switch-switch"></span>
            <label class="consonant-switch-label" for="${PLAYLIST_PLAY_ALL_ID}">${this.cfg.autoplayText.toUpperCase()}</label>
          </div>
        </div>
      </div>
      <div class="video-playlist-container__header__content">
        <div class="video-playlist-container__header__content__left">
          <p class="video-playlist-container__header__content__left__topic">${this.cfg.topicEyebrow}</p>
          <h3 class="video-playlist-container__header__content__left__title">${this.cfg.playlistTitle}</h3>
        </div>
        <div class="video-playlist-container__header__content__right">
          ${this.cfg.socialSharing?this._socialShareMarkup():''}
        </div>
      </div>`;
    /* autoplay toggle */
    const cb=qs(`#${PLAYLIST_PLAY_ALL_ID}`,h);
    cb?.addEventListener('change',(e)=>{
      saveShouldAutoPlayToLocalStorage(e.target.checked);
      e.target.setAttribute('daa-ll',e.target.checked?ANALYTICS.TOGGLE_ON:ANALYTICS.TOGGLE_OFF);
    });
    /* share */
    if(this.cfg.socialSharing) this._wireSocialShare(h);
    return h;
  }

  _socialShareMarkup(){
    const u=encodeURIComponent(window.location.href);
    const title=encodeURIComponent(this.cfg.playlistTitle);
    const text=encodeURIComponent(this.cfg.twitterCustomText||this.cfg.playlistTitle);
    const items=[
      this.cfg.enableFacebook && {key:'facebook',icon:SOCIAL_ICONS.facebook,alt:this.cfg.facebookAltText,href:`https://www.facebook.com/sharer/sharer.php?u=${u}`,daa:'Facebook_Share Playlist',ext:true},
      this.cfg.enableTwitter && {key:'twitter',icon:SOCIAL_ICONS.twitter,alt:this.cfg.twitterAltText,href:`https://twitter.com/intent/tweet?text=${text}&url=${u}`,daa:'Twitter_Share Playlist',ext:true},
      this.cfg.enableLinkedIn && {key:'linkedin',icon:SOCIAL_ICONS.linkedin,alt:this.cfg.linkedInAltText,href:`https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${title}`,daa:'LinkedIn_Share Playlist',ext:true},
      this.cfg.enableCopyLink && {key:'copy',icon:SOCIAL_ICONS.copy,alt:this.cfg.copyLinkAltText,href:'#',daa:'Link_Share Playlist',ext:false},
    ].filter(Boolean);
    const li=items.map(p=>`<li><a class="video-playlist-container__social-share-menu__item" data-platform="${p.key}" daa-ll="${p.daa}" aria-label="${p.alt}" href="${p.href}" ${p.ext?'target="_blank"':''}>
      <svg width="16" height="16" viewBox="0 0 ${p.key==='twitter'?'1200 1227':'16 16'}" fill="none" xmlns="http://www.w3.org/2000/svg">${p.icon}</svg>
      <span>${p.alt}</span></a></li>`).join('');
    return li?`
      <div class="video-playlist-container__social-share-wrapper">
        <button class="video-playlist-container__social-share" daa-ll="Social_Share">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M12 6c.8 0 1.5.7 1.5 1.5S12.8 9 12 9s-1.5-.7-1.5-1.5S11.2 6 12 6zM4 6c.8 0 1.5.7 1.5 1.5S4.8 9 4 9s-1.5-.7-1.5-1.5S3.2 6 4 6zM8 6c.8 0 1.5.7 1.5 1.5S8.8 9 8 9s-1.5-.7-1.5-1.5S7.2 6 8 6z"/></svg>
        </button>
        <div class="share-menu-wrapper"><ul class="video-playlist-container__social-share-menu">${li}</ul></div>
      </div>`:'';
  }
  _wireSocialShare(root){
    const btn=qs('.video-playlist-container__social-share',root);
    const menu=qs('.share-menu-wrapper',root); if(!btn||!menu) return;
    const onDoc=()=>{menu.classList.remove('active');btn.setAttribute('aria-expanded','false');};
    btn.addEventListener('click',(e)=>{e.stopPropagation();menu.classList.toggle('active');btn.setAttribute('aria-expanded',menu.classList.contains('active'));});
    document.addEventListener('click',onDoc);
    this.disposers.push(()=>document.removeEventListener('click',onDoc));
    qsa('a',menu).forEach(a=>{
      a.addEventListener('click',(e)=>{
        const isCopy=a.dataset.platform==='copy';
        e.preventDefault();
        if(isCopy){ this._copy(window.location.href); this._toast(this.cfg.copyNotificationText,'info'); }
        else window.open(a.href,'share-window','width=600,height=400,scrollbars=yes');
      });
    });
  }

  _renderSessions(cards){
    const outer=createTag('div',{class:'video-playlist-container__sessions'});
    this.sessionsWrapper=createTag('div',{class:'video-playlist-container__sessions__wrapper'});
    this.sessionsWrapper.innerHTML=cards.map(card=>{
      const vid=card.search.mpcVideoId||card.search.videoId;
      return `
      <div daa-lh="${card.contentArea.title}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${vid}">
        <a daa-ll="${ANALYTICS.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
          <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
            <img src="${card.search.thumbnailUrl}" alt="${card.contentArea.title}" loading="lazy"/>
            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__play-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 18 18" width="40"><rect opacity="0" width="18" height="18"/><path fill="#e5e5e5" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm4.2685,8.43L7.255,12.93A.50009.50009,0,0,1,7,13H6.5a.5.5,0,0,1-.5-.5v-7A.5.5,0,0,1,6.5,5H7a.50009.50009,0,0,1,.255.07l6.0135,3.5a.5.5,0,0,1,0,.86Z"/></svg>
            </div>
            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__duration"><p class="video-playlist-container__sessions__wrapper__session__thumbnail__duration__text">${card.search.videoDuration}</p></div>
            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress"><div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar"></div></div>
          </div>
          <div class="video-playlist-container__sessions__wrapper__session__info">
            <h4 class="video-playlist-container__sessions__wrapper__session__info__title">${card.contentArea.title}</h4>
            <p class="video-playlist-container__sessions__wrapper__session__info__description">${card.contentArea.description}</p>
          </div>
        </a>
      </div>`;
    }).join('');
    outer.appendChild(this.sessionsWrapper);
    this._initProgressBars(this.sessionsWrapper);
    return outer;
  }
  _initProgressBars(wrap){
    const videos=getLocalStorageVideos();
    qsa('.video-playlist-container__sessions__wrapper__session',wrap).forEach(el=>{
      const vid=el.getAttribute('data-video-id'); const d=videos[vid];
      if(d?.length && d.secondsWatched>0){
        const bar=qs('.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',el);
        if(bar){ bar.style.width=`${Math.min(100,(d.secondsWatched/d.length)*100)}%`; bar.style.backgroundColor='#1473e6'; bar.style.display='block'; }
      }
    });
  }

  /* favorites */
  async _setupFavorites(){
    try{
      if(!window?.feds?.utilities?.getEventData) return;
      const ev=await window.feds.utilities.getEventData(); if(!ev?.isRegistered) return;
      const favs=await initAPI(ENDPOINTS.GET_FAVORITES); if(!favs?.sessionInterests) return;
      const favIds=new Set(favs.sessionInterests.map(f=>f.sessionID));
      const byVid=new Map(this.cards.map(c=>[(c.search.mpcVideoId||c.search.videoId),c]));
      qsa('.video-playlist-container__sessions__wrapper__session',this.sessionsWrapper).forEach((session,i)=>{
        const vid=session.getAttribute('data-video-id'); let card=byVid.get(vid)||this.cards[i]; if(!card) return;
        session.appendChild(this._favoriteButton(card,favIds.has(card.search.sessionId)));
      });
    }catch(e){ console.error('Favorites setup failed:',e); }
  }
  _favoriteButton(card,isFav){
    const btn=createTag('button',{
      class:'video-playlist-container__sessions__wrapper__session__favorite',
      'daa-ll':isFav?ANALYTICS.UNFAVORITE:ANALYTICS.FAVORITE,
      'aria-label':`${this.cfg.favoritesTooltipText} ${card.contentArea.title}`,
      'data-tooltip':this.cfg.favoritesTooltipText
    });
    btn.innerHTML=`<svg class="heart ${isFav?'filled':'unfilled'}" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14"><path d="M10.5895 1.82617C10.0133 1.85995 9.45382 2.03175 8.95885 2.32693C8.46389 2.62211 8.04809 3.0319 7.74691 3.52137C7.44573 3.0319 7.02993 2.62211 6.53496 2.32693C6.04 2.03175 5.48056 1.85995 4.90436 1.82617C3.99978 1.82617 3.13226 2.18337 2.49262 2.8192C1.85299 3.45502 1.49365 4.31738 1.49365 5.21657C1.49365 8.45423 7.74691 12.563 7.74691 12.563C7.74691 12.563 14.0002 8.49774 14.0002 5.21657C14.0002 4.31738 13.6408 3.45502 13.0012 2.8192C12.3616 2.18337 11.494 1.82617 10.5895 1.82617Z" stroke-width="2"/></svg>`;
    btn.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();this._toggleFavorite(btn,card);});
    return btn;
  }
  async _toggleFavorite(btn,card){
    try{
      btn.disabled=true;
      const sessionTimeId=card.search.sessionTimeId||card.search.sessionId;
      const sessionId=card.search.sessionId;
      const ok=await initAPI(ENDPOINTS.TOGGLE_FAVORITES,sessionTimeId,sessionId);
      if(!ok) throw new Error('toggle failed');
      const svg=qs('svg',btn); const on=svg.classList.toggle('filled'); svg.classList.toggle('unfilled',!on);
      btn.setAttribute('daa-ll',on?ANALYTICS.FAVORITE:ANALYTICS.UNFAVORITE);
      btn.setAttribute('data-tooltip',this.cfg.favoritesTooltipText);
      btn.setAttribute('aria-label',`${this.cfg.favoritesTooltipText} ${card.contentArea.title}`);
      if(on) this._toast(this.cfg.favoritesNotificationText,'positive',{text:this.cfg.favoritesButtonText,link:this.cfg.favoritesButtonLink,daaLL:ANALYTICS.VIEW_SCHEDULE});
    }catch(e){ console.error('Favorite toggle failed:',e); } finally{ btn.disabled=false; }
  }

  /* video player (MPC + YT) */
  _setupPlayerBootstrap(){
    const tryInit=()=>{
      this.videoContainer=qs('.milo-video');
      if(this.videoContainer){ this._onPlayerMounted(); return true; }
      return false;
    };
    if(tryInit()) return;
    this.mo=new MutationObserver(()=>{ if(tryInit()) this.mo.disconnect(); });
    this.mo.observe(document.body,{childList:true,subtree:true});
  }
  _onPlayerMounted(){
    this._highlightCurrentSession();
    window.removeEventListener('message',this.boundMsg);
    window.addEventListener('message',this.boundMsg);
    this._setupYouTubeHook();
  }

  _highlightCurrentSession(){
    if(!this.sessionsWrapper) return;
    const id=this._currentVideoId();
    qsa('.highlighted',this.sessionsWrapper).forEach(el=>el.classList.remove('highlighted'));
    if(!id) return;
    const el=qs(`[data-video-id="${id}"]`,this.sessionsWrapper);
    if(el){ el.classList.add('highlighted'); el.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  }
  _currentVideoId(){
    if(!this.videoContainer) return null;
    const lite=qs('lite-youtube',this.videoContainer); if(lite) return lite.getAttribute('videoid');
    const ifr=qs('iframe',this.videoContainer); return ifr?findVideoIdFromIframeSrc(ifr.getAttribute('src')):null;
  }

  _onMpcMessage(event){
    if(event.origin!==VIDEO_ORIGIN||event.data.type!==MPC_STATUS) return;
    const d=event.data;
    if(d.state===EVENT_STATES.LOAD) this._onMpcLoad(d);
    else if(d.state===EVENT_STATES.PAUSE) saveCurrentVideoProgress(d.id,d.currentTime);
    else if(d.state===EVENT_STATES.TICK){
      if(d.currentTime%PROGRESS_SAVE_INTERVAL===0){
        saveCurrentVideoProgress(d.id,d.currentTime,d.length);
        this._updateProgress(d.id,d.currentTime,d.length);
      }
    }else if(d.state===EVENT_STATES.COMPLETE) this._onComplete(d.id);
  }
  _onMpcLoad(d){
    this._highlightCurrentSession();
    const vids=getLocalStorageVideos(); const cur=vids[d.id];
    const start=(cur?.secondsWatched>d.length-RESTART_THRESHOLD)?0:(cur?.secondsWatched||0);
    startVideoFromSecond(this.videoContainer,start);
  }
  _onComplete(videoId){
    if(this.progressInterval) clearInterval(this.progressInterval);
    const vids=getLocalStorageVideos();
    if(vids[videoId]){
      vids[videoId].completed=true;
      if(vids[videoId].length) vids[videoId].secondsWatched=vids[videoId].length;
      saveLocalStorageVideos(vids);
      this._updateProgress(videoId,vids[videoId].length,vids[videoId].length);
    }
    if(!getLocalStorageShouldAutoPlay()) return;
    const i=this.cards.findIndex(c=>c.search.mpcVideoId===videoId||c.search.videoId===videoId);
    if(i===-1||i>=this.cards.length-1) return;
    const next=new URL(this.cards[i+1].overlayLink,window.location.origin);
    if(this.currentPlaylistId) next.searchParams.set(VIDEO_PLAYLIST_ID_URL_KEY,this.currentPlaylistId);
    window.location.href=next.href;
  }
  _updateProgress(videoId,cur,len){
    const el=qs(`[data-video-id="${videoId}"]`); const bar=qs('.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',el||document);
    if(bar){ bar.style.width=`${Math.min(100,(cur/len)*100)}%`; bar.style.backgroundColor='#1473e6'; bar.style.display='block'; }
  }

  /* YouTube */
  _setupYouTubeHook(){
    const lite=qs('lite-youtube',this.videoContainer);
    const ifr=qs('iframe',this.videoContainer);
    const videoId=lite?.getAttribute('videoid')||(ifr?findVideoIdFromIframeSrc(ifr.src):null);
    const srcRef=lite?videoId:ifr?.src;
    if(!videoId||!this._isYouTube(srcRef)) return;

    if(lite){
      const onClick=()=>{ const t=setInterval(()=>{
        const newI=qs('iframe',this.videoContainer);
        if(newI?.src.includes('youtube-nocookie.com/embed/')){ clearInterval(t); this._enableYTAPI(newI,videoId); }
      },100); };
      lite.addEventListener('click',onClick);
      this.disposers.push(()=>lite.removeEventListener('click',onClick));
    }else if(ifr?.src.includes('enablejsapi=1')) this._attachYT(ifr,videoId);
    else this._enableYTAPI(ifr,videoId);
  }
  _isYouTube(src){ return src && (String(src).includes('youtube.com')||String(src).includes('youtube-nocookie.com')||String(src).length===11); }
  _enableYTAPI(iframe,videoId){
    try{
      if(!iframe) return;
      const url=new URL(iframe.src);
      url.searchParams.set('enablejsapi','1');
      url.searchParams.set('origin',window.location.origin);
      const vids=getLocalStorageVideos();
      if(vids[videoId]?.secondsWatched>RESTART_THRESHOLD) url.searchParams.set('start',Math.floor(vids[videoId].secondsWatched));
      iframe.src=url.toString();
      iframe.addEventListener('load',()=>this._attachYT(iframe,videoId));
    }catch(e){ console.error('YT iframe modify error:',e); }
  }
  async _attachYT(iframe,videoId){
    await this._ensureYT();
    try{
      let id=iframe.getAttribute('id'); if(!id){ id=`player-${videoId}-${Date.now()}`; iframe.setAttribute('id',id); }
      this.youtubePlayer=new window.YT.Player(id,{
        events:{
          onReady:()=>this._startYT(this.youtubePlayer,videoId),
          onStateChange:(e)=>this._onYTState(e,videoId)
        }
      });
    }catch(e){ console.error('YT.Player error:',e); }
  }
  _ensureYT(){
    if(window.YT?.Player) return Promise.resolve();
    const existing=[...document.scripts].some(s=>s.src.includes('youtube.com/iframe_api'));
    if(!existing){
      const tag=document.createElement('script'); tag.src='https://www.youtube.com/iframe_api';
      const first=document.getElementsByTagName('script')[0]; first.parentNode.insertBefore(tag,first);
    }
    return new Promise((res)=>{
      const tryReady=()=>{ if(window.YT?.Player){ res(); return true; } return false; };
      if(tryReady()) return;
      const i=setInterval(()=>{ if(tryReady()) clearInterval(i); },100);
    });
  }
  _startYT(player,videoId){
    if(this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval=setInterval(()=>this._tickYT(player,videoId),1000);
  }
  _onYTState(e,videoId){
    const PS=window.YT.PlayerState;
    if(e.data===PS.PLAYING) this._startYT(e.target,videoId);
    else if(e.data===PS.PAUSED||e.data===PS.BUFFERING){ if(this.progressInterval) clearInterval(this.progressInterval); this._tickYT(e.target,videoId); }
    else if(e.data===PS.ENDED){ if(this.progressInterval) clearInterval(this.progressInterval); this._onComplete(videoId); }
  }
  async _tickYT(player,videoId){
    try{
      const t=player.getCurrentTime(); const d=player.getDuration();
      if(t&&d&&(Math.floor(t)%PROGRESS_SAVE_INTERVAL===0||d-t<1)){ await saveCurrentVideoProgress(videoId,t,d); this._updateProgress(videoId,t,d); }
    }catch(e){ console.error('YT progress error:',e); }
  }

  /* UX bits */
  _copy(text){
    if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text).catch(()=>this._legacyCopy(text)); }
    else this._legacyCopy(text);
  }
  _legacyCopy(text){
    const ta=createTag('textarea',{value:text,style:'position:fixed;left:-9999px;top:-9999px;'}); document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); }catch(e){ console.error('Copy failed',e); } document.body.removeChild(ta);
  }
  _toast(msg,type='default',btn=null){
    let c=document.getElementById(TOAST_CONTAINER_ID);
    if(!c){ c=createTag('div',{id:TOAST_CONTAINER_ID}); this.root.appendChild(c); }
    const klass=type==='positive'?'video-playlist-container__toast--positive':type==='info'?'video-playlist-container__toast--info':'';
    const t=createTag('div',{class:`video-playlist-container__toast ${klass}`,role:'alert','aria-live':'assertive','aria-atomic':'true'});
    const icon=type==='positive'
      ?'<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18" class="video-playlist-container__toast-icon"><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5.333,4.54L8.009,13.6705a.603.603,0,0,1-.4375.2305H7.535a.6.6,0,0,1-.4245-.1755L3.218,9.829a.6.6,0,0,1-.00147-.84853L3.218,8.979l.663-.6625A.6.6,0,0,1,4.72953,8.315L4.731,8.3165,7.4,10.991l5.257-6.7545a.6.6,0,0,1,.8419-.10586L13.5,4.1315l.7275.5685A.6.6,0,0,1,14.333,5.54Z"></path></svg>'
      :type==='info'
      ?'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="video-playlist-container__toast-icon"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
      :'';
    t.innerHTML=`
      ${icon}
      <div class="video-playlist-container__toast-body">
        <div class="video-playlist-container__toast-content">${msg}</div>
        ${btn?`<button class="video-playlist-container__toast-button" daa-ll="${btn.daaLL}"><span class="video-playlist-container__toast-button-label">${btn.text}</span></button>`:''}
      </div>
      <div class="video-playlist-container__toast-buttons">
        <button aria-label="close" class="video-playlist-container__toast-close" label="Close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">
          <svg class="video-playlist-container__toast-close-icon" viewBox="0 0 8 8"><path d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path></svg>
        </button>
      </div>`;
    c.appendChild(t);
    const close=qs('.video-playlist-container__toast-close',t);
    close.addEventListener('click',()=>t.remove());
    if(btn){ qs('.video-playlist-container__toast-button',t)?.addEventListener('click',()=>{ if(btn.link) window.location.href=btn.link; }); }
  }
}
