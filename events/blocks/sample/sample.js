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
  
  // ----- constants
  const MINUTE_MS=60*1000,HOUR_MS=60*MINUTE_MS;
  const TIME_SLOT_DURATION=15; // minutes
  const VISIBLE_TIME_SLOTS=5;  // columns per page
  const SLOTS_PER_DAY=24*60/TIME_SLOT_DURATION; // 96
  const LAST_DAY_SLOT=SLOTS_PER_DAY-1;          // 95 (23:45)
  const PAGINATION_STEP=VISIBLE_TIME_SLOTS;     // page step
  
  // ===== MOCK: replace with your feed when ready
  // (keep your provided MOCK_CHIMERA_API_RESPONSE in scope)
  const MOCK=typeof MOCK_CHIMERA_API_RESPONSE!=='undefined'?MOCK_CHIMERA_API_RESPONSE:{cards:[]};
  
  // ----- tz helpers
  const TZ_MAP={PST:'America/Los_Angeles',CET:'Europe/Berlin',JST:'Asia/Tokyo'};
  const getIana=(place)=>{
    const p=AGENDA_CONFIG.places.find(x=>x.id===place);
    if(!p) return Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(p.timezone==='LOCAL') return Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TZ_MAP[p.timezone]||p.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  const fmtDateTz=(ms,tz)=>new Date(ms).toLocaleDateString('en-US',{timeZone:tz,weekday:'short',month:'short',day:'numeric'});
  const fmtTimeTz=(ms,tz)=>new Date(ms).toLocaleTimeString([],{timeZone:tz,hour:'2-digit',minute:'2-digit'});
  const dayKeyTz=(ms,tz)=>new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ms)); // YYYY-MM-DD
  const tzMidnightMs=(yyyyMmDd,tz)=>new Date(new Date(`${yyyyMmDd}T00:00:00`).toLocaleString('en-US',{timeZone:tz})).getTime();
  const toMs=(v)=>typeof v==='number'?v:(v?Date.parse(v):NaN);
  
  // ----- misc helpers
  const getSessionEndTime=(s)=>{
    if(s.sessionEndTime) return s.sessionEndTime;
    if(s.sessionStartTime&&s.sessionDuration){
      const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return s.sessionStartTime;
      return new Date(st+parseInt(s.sessionDuration,10)*MINUTE_MS).toISOString();
    }
    return s.sessionStartTime||new Date().toISOString();
  };
  const isSessionLive=(s)=>{
    const now=Date.now(),st=toMs(s.sessionStartTime),et=toMs(getSessionEndTime(s));
    return Number.isFinite(st)&&Number.isFinite(et)&&now>=st&&now<=et;
  };
  const isSessionOnDemand=(s)=>{
    const now=Date.now(),et=toMs(getSessionEndTime(s));
    return Number.isFinite(et)&&now>et;
  };
  const uses24hr=()=>{try{const p=new Intl.DateTimeFormat(navigator.language,{hour:'numeric'}).formatToParts(new Date(2020,0,1,13));return (p.find(x=>x.type==='hour')?.value||'').length===2;}catch{return false;}};
  const renderSunMoon=(showSun,showMoon)=>showSun?`<div class="daytime_icon"><svg viewBox="0 0 14.5 14.5" xmlns="http://www.w3.org/2000/svg"><circle cx="7.25" cy="7.25" r="3.2" fill="currentColor"/></svg></div>`:showMoon?`<div class="daytime_icon"><svg viewBox="0 0 8.1 11" xmlns="http://www.w3.org/2000/svg"><path d="M7.9,1.2C8,1.2,8.1,1,8.1,0.9C8.1,10,8,9.8,7.9,9.8C5.5,8.7,4.5,5.9,5.6,3.5C6.1,2.5,6.9,1.7,7.9,1.2z" fill="currentColor"/></svg></div>`:'';
  const liveIndicator=()=>`<span class="agenda-block__live-indicator"><svg class="live-circle" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg><span class="live-label">LIVE</span></span>`;
  const debounce=(fn,wait)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait)}};
  
  // ============================================================================
  
  class VanillaAgendaBlock{
    constructor(el){
      this.element=el; this.config=AGENDA_CONFIG;
      this.state={sessions:[],tracks:this.config.tracks,days:[],currentDay:0,timeCursor:0,isMobile:window.innerWidth<768,isLoading:true,currentPlace:this.config.defaultPlace,isDropdownOpen:false,currentTime:Date.now()};
      this.updateInterval=null;
      this.init();
    }
  
    async init(){
      this.renderLoading();
      await this.fetchAndProcessData();
      this.render();
      this.attachEventListeners();
      this.setupStickyHeader();
      this.startLiveUpdates();
    }
  
    async fetchAndProcessData(){
      try{
        const resp=this.config.api.useMockData?await(new Promise(r=>setTimeout(()=>r(MOCK),300))):await fetch(this.config.api.chimeraEndpoint).then(r=>r.json());
        this.state.sessions=(resp.cards||[]).map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        this.recomputeDaysForPlace(); // tz-aware
        if(this.state.days.length) this.initializeTimeCursor();
        this.state.isLoading=false;
      }catch{ this.state.isLoading=false; }
    }
  
    currentTz(){ return getIana(this.state.currentPlace); }
    currentPlaceName(){ return (this.config.places.find(p=>p.id===this.state.currentPlace)?.name)||''; }
  
    recomputeDaysForPlace(){
      const tz=this.currentTz(),map=new Map();
      this.state.sessions.forEach(s=>{
        const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return;
        const key=dayKeyTz(st,tz);
        if(!map.has(key)) map.set(key,{id:key,date:key,label:fmtDateTz(tzMidnightMs(key,tz),tz),startTime:tzMidnightMs(key,tz)});
      });
      this.state.days=[...map.values()].sort((a,b)=>a.startTime-b.startTime);
      if(this.state.currentDay>=this.state.days.length) this.state.currentDay=0;
    }
  
    initializeTimeCursor(){
      const d=this.state.days[this.state.currentDay]; if(!d) return;
      const tz=this.currentTz(),dayStart=tzMidnightMs(d.id,tz);
      const daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length){ this.state.timeCursor=0; return; }
      const earliest=Math.min(...daySessions.map(s=>toMs(s.sessionStartTime)));
      const slot=Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_DURATION*MINUTE_MS)));
      this.state.timeCursor=slot;
    }
  
    renderLoading(){ this.element.innerHTML=`<div class="agenda-block__loading"><div class="agenda-block__spinner"></div><p>${this.config.labels.loadingText}</p></div>`; }
  
    render(){
      if(this.state.isLoading){ this.renderLoading(); return; }
      const max=this.getMaxTimeOffset(); if(this.state.timeCursor>max) this.state.timeCursor=max;
      this.element.innerHTML=`
        <div class="agenda-block__container">
          ${this.renderHeader()}
        </div>`;
    }
  
    renderHeader(){
      const tz=this.currentTz();
      return `
        <div class="agenda-block__header">
          <div class="agenda-block__watch-nav">
            <div class="agenda-block__watch-nav-row agenda-block__geo-row">
              <span class="agenda-block__watch-label">Watch:</span>
              <div class="agenda-block__place-selector">
                <ul class="agenda-block__place-list">
                  ${this.config.places.map(p=>`
                    <li class="agenda-block__place-item">
                      <button class="agenda-block__place-tab ${p.id===this.state.currentPlace?'active':''}" data-place-id="${p.id}">${p.name}</button>
                    </li>`).join('')}
                </ul>
              </div>
              <div class="agenda-block__timezone-label">${this.config.labels.timeZoneLabel} ${this.currentPlaceName()}</div>
              <div class="agenda-block__pagination">${this.renderPagination()}</div>
            </div>
            <div class="agenda-block__watch-nav-row agenda-block__date-row">
              <div class="agenda-block__time-header">
                <div class="agenda-block__day-dropdown-container">
                  <button class="agenda-block__day-dropdown-toggle ${this.state.isDropdownOpen?'open':''}" data-dropdown-toggle="day-dropdown" aria-expanded="${this.state.isDropdownOpen}">
                    <span>${this.state.days[this.state.currentDay]?.label||'Select day'}</span><span class="agenda-block__day-dropdown-chevron">▼</span>
                  </button>
                  <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen?'open':''}" id="day-dropdown">
                    ${this.state.days.map((d,i)=>`
                      <button class="agenda-block__day-dropdown-item ${i===this.state.currentDay?'active':''}" data-day-index="${i}">
                        <span>${d.label}</span>${i===this.state.currentDay?'<span class="agenda-block__day-checkmark">✓</span>':''}
                      </button>`).join('')}
                  </div>
                  <div class="agenda-block__timezone-help">Date and times in ${this.currentPlaceName()}</div>
                </div>
                ${this.renderTimeHeader(tz)}
              </div>
            </div>
          </div>
        </div>
        ${this.renderTracksColumnWithGrid(tz)}
      `;
    }
  
    renderTracksColumnWithGrid(tz){
      return `
        <div class="agenda-block__body">
          <div class="agenda-block__tracks-column">${this.renderTracksColumn(tz)}</div>
          <div class="agenda-block__grid-wrapper"><div class="agenda-block__grid-container">${this.renderGrid(tz)}</div></div>
        </div>`;
    }
  
    renderTracksColumn(tz){
      const d=this.state.days[this.state.currentDay],daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(tr=>{
        const s=daySessions.filter(x=>x.sessionTrack?.tagId===tr.tagId);
        const rows=this.calculateNumberOfRowsForTrack(s,d,tz);
        const h=rows*140+(rows-1)*6;
        return `<div class="agenda-block__track-label" style="border-left:4px solid ${tr.color};height:${h}px;">
          <div class="agenda-block__track-title-in-label">${tr.title}</div>
          ${tr.description?`<div class="agenda-block__track-description-in-label">${tr.description}</div>`:''}
        </div>`;
      }).join('');
    }
  
    renderTimeHeader(tz){
      const slots=this.getVisibleTimeSlots(tz),now=this.state.currentTime,hrs24=uses24hr();
      return slots.map((t,i)=>{
        const next=slots[i+1],d=new Date(t);
        const isLive=next?now>=t&&now<next:now>=t;
        const showIcon=hrs24&&d.getHours()%12===0&&d.getMinutes()===0;
        const showSun=showIcon&&d.getHours()>=12,showMoon=showIcon&&!showSun;
        return `<div class="agenda-block__time-cell ${isLive?'time-cell-live':''}">
          ${isLive?liveIndicator():''}${renderSunMoon(showSun,showMoon)}
          <span class="time-value">${fmtTimeTz(t,tz)}</span>
        </div>`;
      }).join('');
    }
  
    renderGrid(tz){
      const d=this.state.days[this.state.currentDay]; if(!d) return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(tr=>{
        const ts=daySessions.filter(s=>s.sessionTrack?.tagId===tr.tagId);
        return `<div class="agenda-block__track-row">${this.renderTrackSessions(ts,d,tz)}</div>`;
      }).join('');
    }
  
    calculateSessionGridPositions(sessions,currentDay,tz){
      const dayStart=tzMidnightMs(currentDay.id,tz);
      const visibleStart=dayStart+(this.state.timeCursor*TIME_SLOT_DURATION*MINUTE_MS);
      const tiles=[],occ=new Set();
      sessions.forEach(s=>{
        const st=toMs(s.sessionStartTime),et=toMs(getSessionEndTime(s)); if(!Number.isFinite(st)||!Number.isFinite(et)) return;
        const startOff=(st-visibleStart)/(TIME_SLOT_DURATION*MINUTE_MS);
        const endOffRaw=(et-visibleStart)/(TIME_SLOT_DURATION*MINUTE_MS);
        const endOff=Math.ceil(endOffRaw)+1;
        if(endOff<=0||startOff>=VISIBLE_TIME_SLOTS) return;
        const startCol=Math.max(1,Math.floor(startOff)+1),endCol=Math.min(Math.ceil(endOff),VISIBLE_TIME_SLOTS+1);
        let row=1,ok=false; while(!ok&&row<=10){ ok=true; for(let c=startCol;c<endCol;c++){ if(occ.has(`${row}-${c}`)){ ok=false; row++; break; } } }
        for(let c=startCol;c<endCol;c++) occ.add(`${row}-${c}`);
        tiles.push({session:s,startColumn:startCol,endColumn:endCol,rowNumber:row,track:this.state.tracks.find(t=>t.tagId===s.sessionTrack?.tagId),shouldDisplayDuration:(endCol-startCol)>2});
      });
      const rows=tiles.length?Math.max(...tiles.map(t=>t.rowNumber)):1;
      return {sessionTiles:tiles,numberOfRows:rows,occupiedCells:occ};
    }
  
    calculateNumberOfRowsForTrack(sessions,currentDay,tz){ return this.calculateSessionGridPositions(sessions,currentDay,tz).numberOfRows; }
  
    renderTrackSessions(sessions,currentDay,tz){
      const {sessionTiles,numberOfRows,occupiedCells}=this.calculateSessionGridPositions(sessions,currentDay,tz);
      let html='';
      sessionTiles.forEach(t=>{
        const {session,startColumn,endColumn,rowNumber,shouldDisplayDuration}=t;
        const durText=session.sessionDuration>=60?`${Math.floor(session.sessionDuration/60)} hr`:`${session.sessionDuration} min`;
        const idx=this.state.tracks.findIndex(x=>x.tagId===session.sessionTrack?.tagId)+1;
        const state=session.isOnDemand?'On Demand':session.isLive?'Live':'Upcoming';
        const daa=`Logged Out|No Filter|${session.sessionTrack?.title||''}-${idx}|${session.isFeatured?'Featured':'Not Featured'}|${session.sessionId}|${state}|${session.sessionTitle}`;
        html+=`<div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn-startColumn}" style="grid-area:${rowNumber}/${startColumn}/${rowNumber+1}/${endColumn};">
          <article class="agenda_tile" daa-lh="${daa}" style="border-color:rgb(213,213,213);">
            <a href="${session.cardUrl}" class="title" daa-ll="${session.isOnDemand?'On Demand Session Title Click':'Session Title Click'}|${session.sessionTitle}">${session.sessionTitle}</a>
            ${shouldDisplayDuration?`<footer><p class="duration">${durText}</p></footer>`:''}
          </article>
        </div>`;
      });
      for(let r=1;r<=numberOfRows;r++){
        for(let c=1;c<=VISIBLE_TIME_SLOTS;c++){
          const key=`${r}-${c}`; if(occupiedCells.has(key)) continue;
          html+=`<article class="agenda_tile empty" style="grid-area:${r}/${c}/${r+1}/${c+1};border-color:rgb(213,213,213);background-image:linear-gradient(135deg,rgb(213,213,213)4.5%,rgba(0,0,0,0)4.5%,rgba(0,0,0,0)50%,rgb(213,213,213)50%,rgb(213,213,213)54.55%,rgba(0,0,0,0)54.55%,rgba(0,0,0,0)100%);"></article>`;
        }
      }
      return `<section class="agenda_grid" style="grid-template-rows:repeat(${numberOfRows},140px);background-color:rgb(248,248,248);">${html}</section>`;
    }
  
    getSessionsForCurrentDay(){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      const tz=this.currentTz();
      return this.state.sessions.filter(s=>dayKeyTz(toMs(s.sessionStartTime),tz)===d.id);
    }
  
    getVisibleTimeSlots(tz){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      const dayStart=tzMidnightMs(d.id,tz),start=dayStart+(this.state.timeCursor*TIME_SLOT_DURATION*MINUTE_MS);
      const dayEnd=dayStart+((LAST_DAY_SLOT+1)*TIME_SLOT_DURATION*MINUTE_MS);
      const a=[]; for(let i=0;i<VISIBLE_TIME_SLOTS;i++){const t=start+i*TIME_SLOT_DURATION*MINUTE_MS; if(t>=dayEnd) break; a.push(t);} return a;
    }
  
    getMinTimeOffset(){
      const d=this.state.days[this.state.currentDay]; if(!d) return 0;
      const tz=this.currentTz(),dayStart=tzMidnightMs(d.id,tz),daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length) return 0;
      const earliest=Math.min(...daySessions.map(s=>toMs(s.sessionStartTime)));
      return Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_DURATION*MINUTE_MS)));
    }
    getMaxTimeOffset(){
      // last page (22:45→23:45) regardless of content
      return LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1; // 95-5+1 = 91
    }
  
    attachEventListeners(){
      this.element.querySelectorAll('.agenda-block__place-tab').forEach(b=>{
        b.addEventListener('click',e=>{this.changePlace(e.currentTarget.dataset.placeId);});
      });
      const dd=this.element.querySelector('.agenda-block__day-dropdown-toggle');
      if(dd){ dd.addEventListener('click',e=>{e.stopPropagation();this.toggleDropdown();}); }
      this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(b=>{
        b.addEventListener('click',e=>{
          e.stopPropagation();
          const i=parseInt(e.currentTarget.dataset.dayIndex,10);
          this.changeDay(i);
          this.state.isDropdownOpen=false; this.render(); this.attachEventListeners();
        });
      });
      if(!this._outside){ this._outside=(e)=>{ if(!this.element.contains(e.target)&&this.state.isDropdownOpen){ this.state.isDropdownOpen=false; this.render(); this.attachEventListeners(); } }; document.addEventListener('click',this._outside);}
      this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(b=>{
        b.addEventListener('click',e=>{this.paginate(e.currentTarget.dataset.direction);});
      });
      const onResize=debounce(()=>{
        const was=this.state.isMobile; this.state.isMobile=window.innerWidth<768;
        if(was!==this.state.isMobile){ this.render(); this.attachEventListeners(); }
      },250);
      window.addEventListener('resize',onResize);
    }
  
    toggleDropdown(){ this.state.isDropdownOpen=!this.state.isDropdownOpen; this.render(); this.attachEventListeners(); }
  
    changePlace(placeId){
      if(placeId===this.state.currentPlace) return;
      this.state.currentPlace=placeId;
      this.recomputeDaysForPlace();
      this.state.currentDay=0; this.initializeTimeCursor();
      this.render(); this.attachEventListeners();
    }
  
    changeDay(i){
      if(i<0||i>=this.state.days.length) return;
      this.state.currentDay=i; this.initializeTimeCursor(); this.render(); this.attachEventListeners();
    }
  
    paginate(dir){
      const step=PAGINATION_STEP,min=this.getMinTimeOffset(),max=this.getMaxTimeOffset();
      if(dir==='next'){
        if(this.state.timeCursor>=max){
          if(this.state.currentDay<this.state.days.length-1){ this.state.currentDay++; this.initializeTimeCursor(); this.render(); this.attachEventListeners(); }
          return;
        }
        const next=this.state.timeCursor+step;
        this.state.timeCursor=next>=max?max:next;
      }else if(dir==='prev'){
        if(this.state.timeCursor>min){
          this.state.timeCursor=Math.max(this.state.timeCursor-step,min);
        }else if(this.state.currentDay>0){
          this.state.currentDay--; this.state.timeCursor=this.getMaxTimeOffset();
        }
      }
      this.render(); this.attachEventListeners();
    }
  
    setupStickyHeader(){
      const header=this.element.querySelector('.agenda-block__header'); if(!header) return;
      const top=this.getSubNavHeight(); header.style.setProperty('top',`${top-1}px`);
      const obs=new IntersectionObserver(([entry])=>{entry.target.classList.toggle('agenda-block__header--pinned',entry.intersectionRatio<1)}, {threshold:[1],rootMargin:`-${top}px 0px 0px 0px`});
      obs.observe(header);
    }
    getSubNavHeight(){
      let top=0; const sticky=document.querySelector('.global-navigation');
      if(sticky&&!sticky.classList.contains('feds-header-wrapper--retracted')) top+=sticky.offsetHeight;
      return top;
    }
  
    startLiveUpdates(){
      this.updateInterval=setInterval(()=>{
        this.state.currentTime=Date.now();
        this.state.sessions=this.state.sessions.map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        const th=this.element.querySelector('.agenda-block__time-header'); if(!th) return;
        th.querySelectorAll('.agenda-block__time-cell').forEach(n=>n.remove());
        th.insertAdjacentHTML('beforeend',this.renderTimeHeader(this.currentTz()));
      },5000);
    }
    destroy(){ if(this.updateInterval){clearInterval(this.updateInterval); this.updateInterval=null;} }
  }
  
  // ----- init
  export default function init(el){ return new VanillaAgendaBlock(el); }
  