// ====== Config ======
const AGENDA_CONFIG={
    tracks:[
      {id:'live-broadcast',tagId:'caas:events/max/primary-track/live-broadcast',title:'Mainstage Broadcast',description:"Don't miss the Mainstage Broadcast of Keynotes, Sneaks, Creativity Super Sessions, and Luminary Sessions.",color:'#FF6B00'},
      {id:'adobe-live-at-max',tagId:'caas:events/max/primary-track/adobe-live-at-max',title:'Adobe Live @ MAX',description:'Visit your favorite MAX speakers online to get your questions answered.',color:'#1473E6'},
      {id:'creativity-and-design-in-business',tagId:'caas:events/max/primary-track/creativity-and-design-in-business',title:'Creativity and Design in Business',description:'Inspiring speakers share their expertise and insights about creative leadership.',color:'#00A38F'},
      {id:'video-audio-and-motion',tagId:'caas:events/max/primary-track/video-audio-and-motion',title:'Video, Audio, and Motion',description:'Learn how to edit your first video and transform static graphics into motion.',color:'#9C27B0'},
      {id:'photography',tagId:'caas:events/max/primary-track/photography',title:'Photography',description:'Spark your passion for photography with sessions that will help you build your skills.',color:'#795548'},
      {id:'social-media-and-marketing',tagId:'caas:events/max/primary-track/social-media-and-marketing',title:'Social Media and Marketing',description:'Leverage the power of social media and marketing to elevate your brand.',color:'#3F51B5'},
      {id:'education',tagId:'caas:events/max/primary-track/education',title:'Education',description:'Get essential creative and generative AI skills that open doors to a brighter future.',color:'#FF9800'},
      {id:'3d',tagId:'caas:events/max/primary-track/3d',title:'3D',description:'Add the power of 3D to your design skillset and take your career to new heights.',color:'#FF5722'}
    ],
    places:[
      {id:'live',name:'Live',timezone:'LOCAL'},
      {id:'americas',name:'Americas',timezone:'PST'},
      {id:'emea',name:'Europe, Middle East, and Africa',timezone:'CET'},
      {id:'apac',name:'Asia Pacific',timezone:'JST'}
    ],
    defaultPlace:'americas',
    labels:{liveLabel:'LIVE',onDemandLabel:'ON DEMAND',featuredLabel:'FEATURED',timeZoneLabel:'Times in',loadingText:'Loading agenda...',noSessionsText:'No sessions available for this day',prevAriaLabel:'Previous',nextAriaLabel:'Next'},
    styles:{primaryBackgroundColor:'#F5F5F5',cellBorderColor:'#E0E0E0',cornerRadius:4},
    api:{chimeraEndpoint:'https://chimera-api.adobe.io/collection',useMockData:true}
  };
  
  // ====== Consts ======
  const MINUTE=60*1000,HOUR=60*MINUTE;
  const SLOT_MIN=15, SLOTS_PER_DAY=24*60/SLOT_MIN; // 96
  const VISIBLE_SLOTS=5, LAST_SLOT=SLOTS_PER_DAY-1; // 95
  const PAGE_STEP=VISIBLE_SLOTS;
  
  // ====== Mock hook (optional) ======
  const MOCK=(typeof window!=='undefined'&&window.MOCK_CHIMERA_API_RESPONSE)||{cards:[]};
  
  // ====== TZ helpers ======
  const TZ_MAP={PST:'America/Los_Angeles',CET:'Europe/Berlin',JST:'Asia/Tokyo'};
  const getLocalIana=()=>Intl.DateTimeFormat().resolvedOptions().timeZone;
  const getIana=(place)=>{
    const p=AGENDA_CONFIG.places.find(x=>x.id===place);
    if(!p) return getLocalIana();
    if(p.timezone==='LOCAL') return getLocalIana();
    return TZ_MAP[p.timezone]||p.timezone||getLocalIana();
  };
  // Fixed-offset mins per “place” (keeps grid math deterministic)
  const getPlaceOffsetMin=(place)=>{
    const map={live: -480, americas:-480, emea:60, apac:540}; // PST, PST, CET, JST
    return map[place] ?? -480;
  };
  // UTC ms for “local midnight of dateKey (YYYY-MM-DD) in place”
  const tzMidnightMs=(dateKey,place)=>{
    const utcMidnight=Date.parse(`${dateKey}T00:00:00Z`);
    return utcMidnight - getPlaceOffsetMin(place)*MINUTE;
  };
  // Day key for a UTC ms when viewed in a “place”
  const dayKeyForPlace=(ms,place)=>{
    const off=getPlaceOffsetMin(place)*MINUTE;
    const d=new Date(ms+off); // pretend shifted to place local
    const y=d.getUTCFullYear(),m=(d.getUTCMonth()+1).toString().padStart(2,'0'),da=d.getUTCDate().toString().padStart(2,'0');
    return `${y}-${m}-${da}`;
  };
  const fmtDate=(ms,iana)=>new Date(ms).toLocaleDateString('en-US',{timeZone:iana,weekday:'short',month:'short',day:'numeric'});
  const fmtTime=(ms,iana)=>new Date(ms).toLocaleTimeString([],{timeZone:iana,hour:'2-digit',minute:'2-digit'});
  
  // ====== utils ======
  const toMs=(v)=>typeof v==='number'?v:(v?Date.parse(v):NaN);
  const endIso=(s)=>{
    if(s.sessionEndTime) return s.sessionEndTime;
    if(s.sessionStartTime&&s.sessionDuration){
      const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return s.sessionStartTime;
      return new Date(st+parseInt(s.sessionDuration,10)*MINUTE).toISOString();
    }
    return s.sessionStartTime||new Date().toISOString();
  };
  const isLive=(s)=>{const n=Date.now(),st=toMs(s.sessionStartTime),et=toMs(endIso(s));return Number.isFinite(st)&&Number.isFinite(et)&&n>=st&&n<=et;};
  const isOD  =(s)=>{const n=Date.now(),et=toMs(endIso(s));return Number.isFinite(et)&&n>et;};
  const uses24h=()=>{try{const p=new Intl.DateTimeFormat(navigator.language,{hour:'numeric'}).formatToParts(new Date(2020,0,1,13));return (p.find(x=>x.type==='hour')?.value||'').length===2;}catch{return false;}};
  const sunMoon=(sun,moon)=>sun?`<span class="sun"></span>`:moon?`<span class="moon"></span>`:'';
  const liveDot =()=>`<span class="live-dot"></span>`;
  const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
  
  // ====== main ======
  class VanillaAgenda{
    constructor(el){
      this.el=el; this.cfg=AGENDA_CONFIG;
      this.state={sessions:[],tracks:this.cfg.tracks,days:[],curDay:0,cursor:0,isLoading:true,place:this.cfg.defaultPlace,open:false,now:Date.now()};
      this._tick=null; this.init();
    }
  
    async init(){
      this.renderLoading();
      await this.load();
      this.render();
      this.bind();
      this.pinHeader();
      this.startTicker();
    }
  
    async load(){
      const data=this.cfg.api.useMockData?MOCK:(await fetch(this.cfg.api.chimeraEndpoint).then(r=>r.json()).catch(()=>({cards:[]})));
      const cards=(data&&data.cards)||[];
      // keep only cards we can place
      this.state.sessions=cards.filter(c=>c.sessionStartTime).map(c=>({...c,isLive:isLive(c),isOnDemand:isOD(c)}));
      this.rebuildDays();
      if(this.state.days.length) this.initCursor();
      this.state.isLoading=false;
    }
  
    // build days for current place from session UTC start times
    rebuildDays(){
      const place=this.state.place, iana=getIana(place), map=new Map();
      this.state.sessions.forEach(s=>{
        const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return;
        const key=dayKeyForPlace(st,place);
        if(!map.has(key)){
          const mid=tzMidnightMs(key,place);
          map.set(key,{id:key,label:fmtDate(mid,iana),startMs:mid});
        }
      });
      this.state.days=[...map.values()].sort((a,b)=>a.startMs-b.startMs);
      if(this.state.curDay>=this.state.days.length) this.state.curDay=0;
    }
  
    initCursor(){
      const d=this.state.days[this.state.curDay]; if(!d) return;
      const place=this.state.place, dayStart=tzMidnightMs(d.id,place);
      const daySessions=this.daySessions();
      if(!daySessions.length){ this.state.cursor=0; return; }
      const earliest=Math.min(...daySessions.map(s=>toMs(s.sessionStartTime)));
      const slot=Math.max(0,Math.floor((earliest-dayStart)/(SLOT_MIN*MINUTE)));
      this.state.cursor=slot;
    }
  
    // ---- render ----
    renderLoading(){ this.el.innerHTML=`<div class="agenda-loading"><div class="spinner"></div><p>${this.cfg.labels.loadingText}</p></div>`; }
  
    render(){
      if(this.state.isLoading){ this.renderLoading(); return; }
      const max=this.maxOffset(); if(this.state.cursor>max) this.state.cursor=max;
      this.el.innerHTML=`
        <div class="agenda-block__container">
          ${this.header()}
        </div>`;
    }
  
    header(){
      const dayLbl=this.state.days[this.state.curDay]?.label||'Select day';
      return `
        <div class="agenda-block__header">
          <div class="agenda-block__watch-nav">
            <div class="agenda-block__watch-nav-row agenda-block__geo-row">
              <span class="agenda-block__watch-label">Watch:</span>
              <div class="agenda-block__place-selector">
                <ul class="agenda-block__place-list">
                  ${this.cfg.places.map(p=>`
                    <li class="agenda-block__place-item">
                      <button class="agenda-block__place-tab ${p.id===this.state.place?'active':''}" data-place-id="${p.id}">${p.name}</button>
                    </li>`).join('')}
                </ul>
              </div>
              <div class="agenda-block__pagination">${this.pagination()}</div>
            </div>
            <div class="agenda-block__watch-nav-row agenda-block__date-row">
              <div class="agenda-block__time-header">
                <div class="agenda-block__day-dropdown-container">
                  <button class="agenda-block__day-dropdown-toggle ${this.state.open?'open':''}" data-dropdown-toggle="day-dropdown" aria-expanded="${this.state.open}">
                    <span>${dayLbl}</span><span class="agenda-block__day-dropdown-chevron">▼</span>
                  </button>
                  <div class="agenda-block__day-dropdown ${this.state.open?'open':''}" id="day-dropdown">
                    ${this.state.days.map((d,i)=>`
                      <button class="agenda-block__day-dropdown-item ${i===this.state.curDay?'active':''}" data-day-index="${i}">
                        <span>${d.label}</span>${i===this.state.curDay?'<span class="agenda-block__day-checkmark">✓</span>':''}
                      </button>`).join('')}
                  </div>
                  <div class="agenda-block__timezone-label">${this.cfg.labels.timeZoneLabel} ${this.placeName()}</div>
                </div>
                ${this.state.days.length?this.timeHeader():''}
              </div>
            </div>
          </div>
        </div>
        ${this.state.days.length?this.body():`<div class="agenda-block__empty">${this.cfg.labels.noSessionsText}</div>`}
      `;
    }
  
    pagination(){
      const min=this.minOffset(), max=this.maxOffset();
      const canPrev=this.state.cursor>min || this.state.curDay>0;
      const canNext=this.state.cursor<max || this.state.curDay<this.state.days.length-1;
      return `
        <button class="agenda-block__pagination-btn prev" data-direction="prev" ${!canPrev?'disabled':''} aria-label="${this.cfg.labels.prevAriaLabel}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%"><path d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" fill="#747474"/></svg>
        </button>
        <button class="agenda-block__pagination-btn next" data-direction="next" ${!canNext?'disabled':''} aria-label="${this.cfg.labels.nextAriaLabel}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%"><path d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" fill="#747474"/></svg>
        </button>
      `;
    }
  
    body(){
      return `
        <div class="agenda-block__body">
          <div class="agenda-block__tracks-column">${this.tracksCol()}</div>
          <div class="agenda-block__grid-wrapper"><div class="agenda-block__grid-container">${this.grid()}</div></div>
        </div>`;
    }
  
    tracksCol(){
      const d=this.state.days[this.state.curDay]; if(!d) return '';
      const daySessions=this.daySessions();
      return this.state.tracks.map(t=>{
        const ts=daySessions.filter(s=>s.sessionTrack&&s.sessionTrack.tagId===t.tagId);
        const rows=this.rowsNeeded(ts,d);
        const h=rows*140+(rows-1)*6;
        return `<div class="agenda-block__track-label" style="border-left:4px solid ${t.color};height:${h}px;">
          <div class="agenda-block__track-title-in-label">${t.title}</div>
          ${t.description?`<div class="agenda-block__track-description-in-label">${t.description}</div>`:''}
        </div>`;
      }).join('');
    }
  
    grid(){
      const d=this.state.days[this.state.curDay]; if(!d) return `<div class="agenda-block__empty">${this.cfg.labels.noSessionsText}</div>`;
      const daySessions=this.daySessions();
      return this.state.tracks.map(t=>{
        const ts=daySessions.filter(s=>s.sessionTrack&&s.sessionTrack.tagId===t.tagId);
        return `<div class="agenda-block__track-row">${this.trackSessions(ts,d)}</div>`;
      }).join('');
    }
  
    timeHeader(){
      const slots=this.visibleSlots(), iana=getIana(this.state.place), now=this.state.now, h24=uses24h();
      return slots.map((ms,i)=>{
        const nxt=slots[i+1], d=new Date(ms), hh=d.getUTCHours(), mm=d.getUTCMinutes();
        const isLive=nxt?now>=ms&&now<nxt:now>=ms;
        const showIcon=h24 && mm===0 && (hh%12===0);
        return `<div class="agenda-block__time-cell ${isLive?'time-cell-live':''}">
          ${isLive?liveDot():''}${sunMoon(showIcon && hh>=12, showIcon && hh<12)}
          <span class="time-value">${fmtTime(ms,iana)}</span>
        </div>`;
      }).join('');
    }
  
    // ---- grid math ----
    trackSessions(sessions,day){
      const {tiles,rows,cells}=this.computeTiles(sessions,day);
      let html='';
      tiles.forEach(t=>{
        const dur=t.session.sessionDuration?parseInt(t.session.sessionDuration,10):Math.round((toMs(endIso(t.session))-toMs(t.session.sessionStartTime))/MINUTE);
        const durTxt=dur>=60?`${Math.floor(dur/60)} hr`:`${dur} min`;
        const st=t.session.sessionTrack?.title||'';
        html+=`<div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${t.end-t.start}" style="grid-area:${t.row}/${t.start}/${t.row+1}/${t.end};">
          <article class="agenda_tile" style="border-color:#d5d5d5;">
            <a href="${t.session.cardUrl||'#'}" class="title">${t.session.sessionTitle||'Untitled'}</a>
            ${(t.end-t.start)>2?`<footer><p class="duration">${durTxt}</p></footer>`:''}
          </article>
        </div>`;
      });
      for(let r=1;r<=rows;r++){
        for(let c=1;c<=VISIBLE_SLOTS;c++){
          const k=`${r}-${c}`; if(cells.has(k)) continue;
          html+=`<article class="agenda_tile empty" style="grid-area:${r}/${c}/${r+1}/${c+1};border-color:#d5d5d5;background-image:linear-gradient(135deg,#d5d5d5 4.5%,transparent 4.5%,transparent 50%,#d5d5d5 50%,#d5d5d5 54.55%,transparent 54.55%,transparent 100%);"></article>`;
        }
      }
      return `<section class="agenda_grid" style="grid-template-rows:repeat(${rows},140px);background:#f8f8f8;">${html}</section>`;
    }
  
    computeTiles(sessions,day){
      const place=this.state.place;
      const dayStart=tzMidnightMs(day.id,place);           // 00:00 local (as UTC ms)
      const visStart=dayStart + this.state.cursor*SLOT_MIN*MINUTE;
      const tiles=[], cells=new Set();
      (sessions||[]).forEach(s=>{
        const st=toMs(s.sessionStartTime), et=toMs(endIso(s));
        if(!Number.isFinite(st)||!Number.isFinite(et)) return;
        const startOffset=(st-visStart)/(SLOT_MIN*MINUTE);
        const endOffset=Math.ceil((et-visStart)/(SLOT_MIN*MINUTE))+1;
        if(endOffset>0 && startOffset<VISIBLE_SLOTS){
          const start=Math.max(1,Math.floor(startOffset)+1);
          const end=Math.min(Math.ceil(endOffset),VISIBLE_SLOTS+1);
          let row=1, placed=false;
          while(!placed&&row<=10){
            placed=true;
            for(let c=start;c<end;c++){ if(cells.has(`${row}-${c}`)){placed=false;row++;break;} }
          }
          for(let c=start;c<end;c++) cells.add(`${row}-${c}`);
          tiles.push({session:s,start,end,row});
        }
      });
      const rows=tiles.length?Math.max(...tiles.map(t=>t.row)):1;
      return {tiles,rows,cells};
    }
  
    visibleSlots(){
      const d=this.state.days[this.state.curDay]; if(!d) return [];
      const dayStart=tzMidnightMs(d.id,this.state.place);
      const start=dayStart + this.state.cursor*SLOT_MIN*MINUTE;
      const dayEnd=dayStart + (LAST_SLOT+1)*SLOT_MIN*MINUTE;
      const out=[]; for(let i=0;i<VISIBLE_SLOTS;i++){const t=start+i*SLOT_MIN*MINUTE; if(t>=dayEnd) break; out.push(t);} return out;
    }
  
    daySessions(){
      const d=this.state.days[this.state.curDay]; if(!d) return [];
      return this.state.sessions.filter(s=>dayKeyForPlace(toMs(s.sessionStartTime),this.state.place)===d.id);
    }
  
    minOffset(){
      const d=this.state.days[this.state.curDay]; if(!d) return 0;
      const dayStart=tzMidnightMs(d.id,this.state.place), list=this.daySessions();
      if(!list.length) return 0;
      const earliest=Math.min(...list.map(s=>toMs(s.sessionStartTime)));
      return Math.max(0,Math.floor((earliest-dayStart)/(SLOT_MIN*MINUTE)));
    }
    maxOffset(){ return LAST_SLOT - VISIBLE_SLOTS + 1; } // last page  (23:45 end)
  
    // ---- interactions ----
    bind(){
      this.el.querySelectorAll('.agenda-block__place-tab').forEach(b=>{
        b.addEventListener('click',e=>this.changePlace(e.currentTarget.dataset.placeId));
      });
      const dd=this.el.querySelector('.agenda-block__day-dropdown-toggle');
      if(dd) dd.addEventListener('click',e=>{e.stopPropagation();this.state.open=!this.state.open;this.render();this.bind();});
      this.el.querySelectorAll('.agenda-block__day-dropdown-item').forEach(b=>{
        b.addEventListener('click',e=>{
          e.stopPropagation(); const i=parseInt(e.currentTarget.dataset.dayIndex,10);
          this.changeDay(i);
        });
      });
      if(!this._outside){
        this._outside=(e)=>{ if(!this.el.contains(e.target)&&this.state.open){ this.state.open=false; this.render(); this.bind(); } };
        document.addEventListener('click',this._outside);
      }
      this.el.querySelectorAll('.agenda-block__pagination-btn').forEach(b=>{
        b.addEventListener('click',e=>this.paginate(e.currentTarget.dataset.direction));
      });
      const onResize=debounce(()=>{this.render();this.bind();},250);
      window.addEventListener('resize',onResize);
    }
  
    changePlace(place){
      if(place===this.state.place) return;
      this.state.place=place; this.rebuildDays(); this.state.curDay=0; this.initCursor(); this.render(); this.bind();
    }
    changeDay(i){
      if(i<0||i>=this.state.days.length) return;
      this.state.curDay=i; this.initCursor(); this.render(); this.bind();
    }
    paginate(dir){
      const min=this.minOffset(), max=this.maxOffset();
      if(dir==='next'){
        if(this.state.cursor>=max){
          if(this.state.curDay<this.state.days.length-1){ this.state.curDay++; this.initCursor(); this.render(); this.bind(); }
          return;
        }
        const nxt=this.state.cursor+PAGE_STEP; this.state.cursor = nxt>=max?max:nxt;
      }else{
        if(this.state.cursor>min){ this.state.cursor=Math.max(this.state.cursor-PAGE_STEP,min); }
        else if(this.state.curDay>0){ this.state.curDay--; this.state.cursor=this.maxOffset(); }
      }
      this.render(); this.bind();
    }
  
    pinHeader(){
      const h=this.el.querySelector('.agenda-block__header'); if(!h) return;
      const top=this.subnavH(); h.style.setProperty('top',`${top-1}px`);
      const obs=new IntersectionObserver(([e])=>{e.target.classList.toggle('agenda-block__header--pinned',e.intersectionRatio<1)}, {threshold:[1],rootMargin:`-${top}px 0px 0px 0px`});
      obs.observe(h);
    }
    subnavH(){ const g=document.querySelector('.global-navigation'); return (g&&!g.classList.contains('feds-header-wrapper--retracted'))?g.offsetHeight:0; }
  
    startTicker(){
      this._tick=setInterval(()=>{
        this.state.now=Date.now();
        this.state.sessions=this.state.sessions.map(s=>({...s,isLive:isLive(s),isOnDemand:isOD(s)}));
        const th=this.el.querySelector('.agenda-block__time-header'); if(!th) return;
        th.querySelectorAll('.agenda-block__time-cell').forEach(n=>n.remove());
        th.insertAdjacentHTML('beforeend',this.timeHeader());
      },5000);
    }
    placeName(){ return (this.cfg.places.find(p=>p.id===this.state.place)?.name)||''; }
    destroy(){ if(this._tick){clearInterval(this._tick);this._tick=null;} }
  }
  
  // ====== init ======
  export default function init(el){ return new VanillaAgenda(el); }
  