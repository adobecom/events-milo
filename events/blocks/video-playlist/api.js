/**
 * @file api.js
 * @desc API utilities for video playlist favorites (adapter + mock fallback)
 */

export const ENDPOINTS=Object.freeze({
  GET_FAVORITES:'myInterests',
  TOGGLE_FAVORITES:'toggleSessionInterest',
});

/* ---------- adapters ---------- */
const hasRealApi=()=>Boolean(window?.northstar?.api); // TODO: refine when real API is known

function realAdapter(){
// Placeholder wiring; adjust to real methods when available
  return {
    async getFavorites(){
    // const res=await window.northstar.api.getInterests();
    // return {sessionInterests:res.items.map(x=>({sessionID:x.sessionId})),responseCode:'0'};
    throw new Error('Real API not wired'); // remove once implemented
    },
    async toggleFavorite(sessionTimeId,sessionId){
    // const ok=await window.northstar.api.toggleInterest({sessionTimeId,sessionId});
    // return {success:!!ok,responseCode:'0'};
    throw new Error('Real API not wired'); // remove once implemented
    }
  };
}

const LS_KEY='mockFavorites';
const lsRead=()=>{try{const v=localStorage.getItem(LS_KEY);return v?new Set(JSON.parse(v)):new Set(['sess_001','sess_003']);}catch{return new Set(['sess_001','sess_003']);}};
const lsWrite=(set)=>{try{localStorage.setItem(LS_KEY,JSON.stringify([...set]));}catch{}};
const delay=(ms)=>new Promise(r=>setTimeout(r,ms));

function mockAdapter(){
  return {
    async getFavorites(){
    await delay(100);
    const set=lsRead();
    return {sessionInterests:[...set].map(id=>({sessionID:id})),responseCode:'0'};
    },
    async toggleFavorite(sessionTimeId,sessionId){
    await delay(100);
    const set=lsRead();
    set.has(sessionId)?set.delete(sessionId):set.add(sessionId);
    lsWrite(set);
    return {success:true,responseCode:'0'};
    }
  };
}

function createApi(){ return hasRealApi()?realAdapter():mockAdapter(); }

/* ---------- public entry ---------- */
export async function initAPI(endpoint,sessionTimeId=null,sessionId=null){
  const api=createApi();
  try{
      if(endpoint===ENDPOINTS.GET_FAVORITES) return api.getFavorites();
      if(endpoint===ENDPOINTS.TOGGLE_FAVORITES) return api.toggleFavorite(sessionTimeId,sessionId);
      throw new Error(`Unknown endpoint: ${endpoint}`);
  } catch(err) {
    console.error('API call failed:',err);
    throw err;
  }
}
  