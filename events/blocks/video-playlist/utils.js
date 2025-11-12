/* utils.js */
import { PLAYLIST_VIDEOS_KEY, AUTOPLAY_PLAYLIST_KEY, VIDEO_ORIGIN } from './constants.js';

/* ---------- localStorage ---------- */
const readJSON=(k,def)=>{
  try{const v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){console.error(`ls read ${k}:`,e);return def;}
};
const writeJSON=(k,val)=>{
  try{localStorage.setItem(k,JSON.stringify(val));}catch(e){console.error(`ls write ${k}:`,e);}
};

export const getLocalStorageVideos=()=>readJSON(PLAYLIST_VIDEOS_KEY,{});
export const saveLocalStorageVideos=(videos)=>writeJSON(PLAYLIST_VIDEOS_KEY,videos);
export const getLocalStorageShouldAutoPlay=()=>readJSON(AUTOPLAY_PLAYLIST_KEY,true);
export const saveShouldAutoPlayToLocalStorage=(v)=>writeJSON(AUTOPLAY_PLAYLIST_KEY,v);

/* ---------- Duration fetching (memoized) ---------- */
const durationCache=new Map(); // id -> seconds
const inflight=new Map(); // id -> Promise<number|null>

const fetchVideoDuration=async(id)=>{
  if(durationCache.has(id)) return durationCache.get(id);
  if(inflight.has(id)) return inflight.get(id);
  const p=(async()=>{
    try{
      const r=await fetch(`${VIDEO_ORIGIN}/v/${id}?format=json-ld`);
      const j=await r.json();
      const sec=convertIsoDurationToSeconds(j?.jsonLinkedData?.duration||'')||null;
      if(sec!=null) durationCache.set(id,sec);
      return sec;
    }catch(e){ console.error(`duration ${id} fetch fail:`,e); return null; }
    finally{ inflight.delete(id); }
  })();
  inflight.set(id,p);
  return p;
};

export const saveCurrentVideoProgress=async(id,currentTime,length=null)=>{
  if(!id && id!==0) return;
  const videos=getLocalStorageVideos();
  const prev=videos[id];

  if(prev){
    const completed=prev.completed||Boolean(length&&currentTime>=length);
    videos[id]={...prev,secondsWatched:currentTime,completed};
  }else{
    const len=length??await fetchVideoDuration(id);
    if(len!=null) videos[id]={secondsWatched:currentTime,length:len};
  }
  saveLocalStorageVideos(videos);
};

/* ---------- Time ---------- */
export const convertIsoDurationToSeconds=(iso)=>{
  if(!iso||typeof iso!=='string') return 0;
  const m=iso.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if(!m) return 0;
  const h=parseInt(m[4]||0,10), mn=parseInt(m[5]||0,10), s=parseInt(m[6]||0,10);
  return h*3600+mn*60+s;
};

/* ---------- Player helpers ---------- */
export const findVideoIdFromIframeSrc=(src='')=>{
  if(!src) return null;
  // MPC: https://video.tv.adobe.com/v/12345?...  -> 12345
  const mpc=src.match(/\/v\/(\d+)\b/);
  if(mpc) return mpc[1];
  // YT embed/nocookie
  const yt=src.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if(yt) return yt[1];
  // Fallback: v= param on YouTube watch URLs
  const vparam=src.match(/[?&#]v=([a-zA-Z0-9_-]{11})/);
  return vparam?vparam[1]:null;
};

export const startVideoFromSecond=(container,seconds=0)=>{
  const ifr=container?.querySelector('iframe');
  const win=ifr?.contentWindow;
  if(!win||Number.isNaN(seconds)) return;
  win.postMessage({type:'mpcAction',action:'play',currentTime:Math.floor(seconds)},VIDEO_ORIGIN);
};
