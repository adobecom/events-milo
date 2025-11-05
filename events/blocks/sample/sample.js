/* =========================
   CONFIG & CONSTANTS
========================= */
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
      {id:'live',name:'Live',timezone:'PST'},
      {id:'americas',name:'Americas',timezone:'PST'},
      {id:'emea',name:'Europe, Middle East, and Africa',timezone:'CET'},
      {id:'apac',name:'Asia Pacific',timezone:'JST'}
    ],
    defaultPlace:'americas',
    labels:{
      liveLabel:'LIVE',onDemandLabel:'ON DEMAND',featuredLabel:'FEATURED',
      timeZoneLabel:'Times in',loadingText:'Loading agenda...',noSessionsText:'No sessions available for this day',
      prevAriaLabel:'Previous',nextAriaLabel:'Next'
    },
    styles:{primaryBackgroundColor:'#F5F5F5',cellBorderColor:'#E0E0E0',cornerRadius:4},
    api:{chimeraEndpoint:'https://chimera-api.adobe.io/collection',useMockData:true}
  };
  
  const MINUTE_MS=60*1000;
  const TIME_SLOT_MIN=15;
  const SLOTS_PER_DAY=96;           // 24h * 4 slots/hour
  const LAST_DAY_SLOT=95;           // 0..95  => last = 23:45
  const VISIBLE_TIME_SLOTS=5;       // paint 5 slots at a time
  const PAGE_STEP=VISIBLE_TIME_SLOTS;
  
  /* =========================
     HELPERS
  ========================= */
  const pad2=n=>String(n).padStart(2,'0');
  function formatDate(date){return date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
  function formatTime(ts){const d=new Date(ts);return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;}
  function getDayKey(ts){return new Date(ts).toISOString().split('T')[0];}
  
  // Return UTC timestamp that corresponds to 00:00 IST of isoDay (yyyy-mm-dd)
  function getIstMidnightUtcTs(isoDay){
    // Easiest/robust: construct date with +05:30 and read back UTC ms
    return new Date(`${isoDay}T00:00:00+05:30`).getTime();
  }
  
  function getSessionEndTime(s){
    if(s.sessionEndTime) return s.sessionEndTime;
    if(s.sessionStartTime && s.sessionDuration){
      const end=new Date(s.sessionStartTime).getTime()+parseInt(s.sessionDuration,10)*MINUTE_MS;
      return new Date(end).toISOString();
    }
    return s.sessionStartTime||new Date().toISOString();
  }
  function isSessionLive(s){
    const now=Date.now(),start=new Date(s.sessionStartTime).getTime(),end=new Date(getSessionEndTime(s)).getTime();
    return now>=start && now<=end;
  }
  function isSessionOnDemand(s){
    const now=Date.now(),end=new Date(getSessionEndTime(s)).getTime();
    return now>end;
  }
  function extractDaysFromSessions(sessions){
    const map=new Map();
    sessions.forEach(s=>{
      const startTs=new Date(s.sessionStartTime).getTime();
      const dayKey=getDayKey(startTs);
      if(!map.has(dayKey)){
        const d=new Date(startTs);
        map.set(dayKey,{id:dayKey,date:dayKey,label:formatDate(d),startTime:getIstMidnightUtcTs(dayKey)});
      }
    });
    return Array.from(map.values()).sort((a,b)=>a.startTime-b.startTime);
  }
  function debounce(fn,wait){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait);};}
  function renderDayNightIcon(showSun,showMoon){
    if(showSun) return `<div class="daytime_icon"><svg viewBox="0 0 14.5 14.5" xmlns="http://www.w3.org/2000/svg"><title>Sun</title><g transform="translate(-562 -997)"><circle cx="569.2" cy="1004.2" r="3.2" fill="currentColor"/></g></svg></div>`;
    if(showMoon) return `<div class="daytime_icon"><svg viewBox="0 0 8.1 11" xmlns="http://www.w3.org/2000/svg"><title>Moon</title><path d="M7.9,1.2C8,1.2,8.1,1,8.1,0.9c0,0,0,0,0,0s0,0,0,0c0-0.1-0.1-0.3-0.2-0.3C7.1,0.2,6.3,0,5.5,0L0,0c0.8,0,1.6-0.2,2.4-0.5c0.1-0.1,0.2-0.2,0.2-0.3c0,0,0,0,0,0s0,0,0,0C8.1,10,8,9.8,7.9,9.8C5.5,8.7,4.5,5.9,5.6,3.5C6.1,2.5,6.9,1.7,7.9,1.2L7.9,1.2z" fill="currentColor"/></svg></div>`;
    return '';
  }
  function localeUses24HourTime(){
    try{
      const parts=new Intl.DateTimeFormat(navigator.language,{hour:'numeric'}).formatToParts(new Date(2020,0,1,13));
      const h=parts.find(p=>p.type==='hour');return h && h.value.length===2;
    }catch{ return false; }
  }
  function getLiveIndicator(){
    return `<span class="agenda-block__live-indicator"><svg class="live-circle" width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg><span class="live-label">LIVE</span></span>`;
  }
  
  /* =========================
     MAIN CLASS
  ========================= */
  class VanillaAgendaBlock{
    constructor(el){
      this.element=el; this.config=AGENDA_CONFIG;
      this.state={
        sessions:[],tracks:this.config.tracks,days:[],
        currentDay:0,timeCursor:0,isMobile:window.innerWidth<768,
        isLoading:true,currentPlace:this.config.defaultPlace,
        isDropdownOpen:false,currentTime:Date.now()
      };
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
  
    /* ---------- DATA ---------- */
    async fetchSessions(){
      if(this.config.api.useMockData){
        await new Promise(r=>setTimeout(r,100));
        const data=(typeof MOCK_CHIMERA_API_RESPONSE!=='undefined')
          ? MOCK_CHIMERA_API_RESPONSE
          : (typeof window!=='undefined'?window.MOCK_CHIMERA_API_RESPONSE:null);
        if(!data||!Array.isArray(data.cards)) return {cards:[]};
        return data;
      }
      const res=await fetch(this.config.api.chimeraEndpoint);
      if(!res.ok) return {cards:[]};
      const json=await res.json();
      return Array.isArray(json.cards)?json:{cards:[]};
    }
  
    async fetchAndProcessData(){
      try{
        const response=await this.fetchSessions();
        this.state.sessions=(response.cards||[]).map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        this.state.days=extractDaysFromSessions(this.state.sessions);
        if(this.state.days.length){
          this.state.currentDay=Math.min(this.state.currentDay,this.state.days.length-1);
          this.initializeTimeCursorToEarliest();
        }else{
          this.state.currentDay=0; this.state.timeCursor=0;
        }
        this.state.isLoading=false;
      }catch(e){
        console.error('[Agenda] fetch error',e);
        this.state.sessions=[]; this.state.days=[]; this.state.currentDay=0; this.state.timeCursor=0; this.state.isLoading=false;
      }
    }
  
    /* ---------- SAFE GETTERS ---------- */
    getCurrentDay(){ return Array.isArray(this.state.days)?(this.state.days[this.state.currentDay]||null):null; }
    getDayStartUtcTs(day){
      if(!day||!day.date) return 0;
      return getIstMidnightUtcTs(day.date);
    }
  
    /* ---------- CURSOR ---------- */
    initializeTimeCursorToEarliest(){
      const day=this.getCurrentDay(); if(!day){this.state.timeCursor=0;return;}
      const daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length){ this.state.timeCursor=0; return; }
      const earliest=Math.min(...daySessions.map(s=>new Date(s.sessionStartTime).getTime()));
      const dayStart=this.getDayStartUtcTs(day);
      const earliestSlot=Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_MIN*MINUTE_MS)));
      this.state.timeCursor=earliestSlot; // no padding; snap to first session
    }
  
    /* ---------- RENDER ---------- */
    renderLoading(){
      this.element.innerHTML=`<div class="agenda-block__loading"><div class="agenda-block__spinner"></div><p>${this.config.labels.loadingText}</p></div>`;
    }
  
    render(){
      if(this.state.isLoading){ this.renderLoading(); return; }
      // Always paint header; grid may be empty
      this.element.innerHTML=`<div class="agenda-block__container">${this.renderHeader()}</div>`;
    }
  
    renderHeader(){
      const day=this.getCurrentDay();
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
              <div class="agenda-block__pagination">${this.renderPagination()}</div>
            </div>
            <div class="agenda-block__watch-nav-row agenda-block__date-row">
              <div class="agenda-block__time-header">
                <div class="agenda-block__day-dropdown-container">
                  <button class="agenda-block__day-dropdown-toggle ${this.state.isDropdownOpen?'open':''}" data-dropdown-toggle="day-dropdown" aria-expanded="${this.state.isDropdownOpen}">
                    <span>${day?.label||'Select day'}</span><span class="agenda-block__day-dropdown-chevron">▼</span>
                  </button>
                  <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen?'open':''}" id="day-dropdown">
                    ${this.state.days.map((d,i)=>`
                      <button class="agenda-block__day-dropdown-item ${i===this.state.currentDay?'active':''}" data-day-index="${i}">
                        <span>${d.label}</span>${i===this.state.currentDay?'<span class="agenda-block__day-checkmark">✓</span>':''}
                      </button>`).join('')}
                  </div>
                  <div class="agenda-block__timezone-label">Date and times in IST</div>
                </div>
                ${this.renderTimeHeader()}
              </div>
            </div>
          </div>
        </div>
        ${this.renderTracksColumnWithGrid()}
      `;
    }
  
    renderTracksColumnWithGrid(){
      return `
        <div class="agenda-block__body">
          <div class="agenda-block__tracks-column">${this.renderTracksColumn()}</div>
          <div class="agenda-block__grid-wrapper">
            <div class="agenda-block__grid-container">${this.renderGrid()}</div>
          </div>
        </div>`;
    }
  
    renderTracksColumn(){
      const day=this.getCurrentDay(); if(!day) return '';
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(track=>{
        const trackSessions=daySessions.filter(s=>s.sessionTrack.tagId===track.tagId);
        const rows=this.calculateNumberOfRowsForTrack(trackSessions,day);
        const h=rows*140+(rows-1)*6;
        return `
          <div class="agenda-block__track-label" style="border-left:4px solid ${track.color};height:${h}px;">
            <div class="agenda-block__track-title-in-label">${track.title}</div>
            ${track.description?`<div class="agenda-block__track-description-in-label">${track.description}</div>`:''}
          </div>`;
      }).join('');
    }
  
    renderTimeHeader(){
      const slots=this.getVisibleTimeSlots();
      const now=this.state.currentTime||Date.now(); const uses24=localeUses24HourTime();
      return slots.map((t,i)=>{
        const next=slots[i+1]; const d=new Date(t);
        const isLive=next?now>=t && now<next: now>=t;
        const showIcon=uses24 && d.getHours()%12===0 && d.getMinutes()===0;
        const isDay=d.getHours()>11;
        return `
          <div class="agenda-block__time-cell ${isLive?'time-cell-live':''}">
            ${isLive?getLiveIndicator():''}
            ${renderDayNightIcon(showIcon && isDay, showIcon && !isDay)}
            <span class="time-value">${formatTime(t)}</span>
          </div>`;
      }).join('');
    }
  
    renderGrid(){
      const day=this.getCurrentDay();
      if(!day) return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(track=>{
        const trackSessions=daySessions.filter(s=>s.sessionTrack.tagId===track.tagId);
        return `<div class="agenda-block__track-row">${this.renderTrackSessions(trackSessions,day)}</div>`;
      }).join('');
    }
  
    renderTrackSessions(sessions,day){
      const {sessionTiles,numberOfRows,occupied}=this.calculateSessionGridPositions(sessions,day);
      let html='';
      sessionTiles.forEach(t=>{
        const {session,startColumn,endColumn,rowNumber,shouldDisplayDuration}=t;
        const durationMin=parseInt(session.sessionDuration,10)||0;
        const durationText=durationMin>=60?`${Math.floor(durationMin/60)} hr ${durationMin%60?durationMin%60+' min':''}`:`${durationMin} min`;
        const trackIdx=this.state.tracks.findIndex(tt=>tt.tagId===session.sessionTrack.tagId)+1;
        const daaLh=`Logged Out|No Filter|${session.sessionTrack.title}-${trackIdx}|${session.isFeatured?'Featured':'Not Featured'}|${session.sessionId}|${session.isOnDemand?'On Demand':session.isLive?'Live':'Upcoming'}|${session.sessionTitle}`;
        html+=`
          <div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn-startColumn}" style="grid-area:${rowNumber} / ${startColumn} / ${rowNumber+1} / ${endColumn};">
            <article class="agenda_tile" daa-lh="${daaLh}" style="border-color:rgb(213,213,213);">
              <a href="${session.cardUrl}" class="title" daa-ll="${session.isOnDemand?'On Demand Session Title Click':'Session Title Click'}|${session.sessionTitle}">
                ${session.sessionTitle}
              </a>
              ${shouldDisplayDuration?`<footer><p class="duration">${durationText}</p></footer>`:''}
            </article>
          </div>`;
      });
      for(let row=1;row<=numberOfRows;row++){
        for(let col=1;col<=VISIBLE_TIME_SLOTS;col++){
          const k=`${row}-${col}`;
          if(!occupied.has(k)){
            html+=`<article class="agenda_tile empty" style="grid-area:${row} / ${col} / ${row+1} / ${col+1};border-color:rgb(213,213,213);background-image:linear-gradient(135deg,rgb(213,213,213) 4.5%,rgba(0,0,0,0) 4.5%,rgba(0,0,0,0) 50%,rgb(213,213,213) 50%,rgb(213,213,213) 54.55%,rgba(0,0,0,0) 54.55%,rgba(0,0,0,0) 100%);"></article>`;
          }
        }
      }
      return `<section class="agenda_grid" style="grid-template-rows:repeat(${numberOfRows},140px);background-color:rgb(248,248,248);">${html}</section>`;
    }
  
    /* ---------- GRID MATH ---------- */
    calculateSessionGridPositions(sessions,day){
      const dayStart=this.getDayStartUtcTs(day);
      const visibleStart=dayStart+this.state.timeCursor*TIME_SLOT_MIN*MINUTE_MS;
      const sessionTiles=[],occupied=new Set();
      sessions.forEach(s=>{
        const start=new Date(s.sessionStartTime).getTime();
        const end=new Date(getSessionEndTime(s)).getTime();
        const startOffset=(start-visibleStart)/(TIME_SLOT_MIN*MINUTE_MS);
        const endOffsetRaw=(end-visibleStart)/(TIME_SLOT_MIN*MINUTE_MS);
        const endOffset=Math.ceil(endOffsetRaw)+1; // include last slot fully
  
        if(endOffset>0 && startOffset<VISIBLE_TIME_SLOTS){
          const startCol=Math.max(1,Math.floor(startOffset)+1);
          const endCol=Math.min(Math.ceil(endOffset),VISIBLE_TIME_SLOTS+1);
          let row=1,found=false;
          while(!found && row<=20){
            found=true;
            for(let c=startCol;c<endCol;c++){
              if(occupied.has(`${row}-${c}`)){found=false;row++;break;}
            }
          }
          for(let c=startCol;c<endCol;c++) occupied.add(`${row}-${c}`);
          sessionTiles.push({session,startColumn:startCol,endColumn:endCol,rowNumber:row,shouldDisplayDuration:(endCol-startCol)>2});
        }
      });
      const numberOfRows=sessionTiles.length?Math.max(...sessionTiles.map(t=>t.rowNumber)):1;
      return {sessionTiles,numberOfRows,occupied};
    }
  
    /* ---------- SLOTS & PAGINATION ---------- */
    getVisibleTimeSlots(){
      const day=this.getCurrentDay(); if(!day) return [];
      const dayStart=this.getDayStartUtcTs(day);
      const start=dayStart+this.state.timeCursor*TIME_SLOT_MIN*MINUTE_MS;
      const dayEnd=dayStart+(LAST_DAY_SLOT+1)*TIME_SLOT_MIN*MINUTE_MS; // start of slot 96
      const out=[];
      for(let i=0;i<VISIBLE_TIME_SLOTS;i++){
        const t=start+i*TIME_SLOT_MIN*MINUTE_MS;
        if(t>=dayEnd) break;
        out.push(t);
      }
      return out;
    }
    getMinTimeOffset(){
      const daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length) return 0;
      const earliest=Math.min(...daySessions.map(s=>new Date(s.sessionStartTime).getTime()));
      const day=this.getCurrentDay(); const dayStart=this.getDayStartUtcTs(day);
      return Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_MIN*MINUTE_MS)));
    }
    getMaxTimeOffset(){ return LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1; } // 95-5+1=91 → shows 22:45–23:45
  
    renderPagination(){
      const min=this.getMinTimeOffset(),max=this.getMaxTimeOffset();
      const hasNextDay=this.state.currentDay<this.state.days.length-1;
      const hasPrevDay=this.state.currentDay>0;
      const canNext=this.state.timeCursor<max||hasNextDay;
      const canPrev=this.state.timeCursor>min||hasPrevDay;
      return `
        <button class="agenda-block__pagination-btn prev" data-direction="prev" ${!canPrev?'disabled':''} aria-label="${this.config.labels.prevAriaLabel}"><svg class="chevron" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg"><path d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" fill="#747474"/></svg></button>
        <button class="agenda-block__pagination-btn next" data-direction="next" ${!canNext?'disabled':''} aria-label="${this.config.labels.nextAriaLabel}"><svg class="chevron" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" fill="#747474"/></svg></button>
      `;
    }
  
    paginate(direction){
      const step=PAGE_STEP, min=this.getMinTimeOffset(), max=this.getMaxTimeOffset();
      if(direction==='next'){
        if(this.state.timeCursor>=max){
          if(this.state.currentDay<this.state.days.length-1){
            this.state.currentDay++;      // move to next day
            this.state.timeCursor=0;      // *** start at 00:00 ***
            this.render(); this.attachEventListeners(); return;
          }
          return;
        }
        const nextPos=this.state.timeCursor+step;
        this.state.timeCursor= nextPos>=max ? max : nextPos;
      }else if(direction==='prev'){
        if(this.state.timeCursor>min){
          this.state.timeCursor=Math.max(this.state.timeCursor-step,min);
        }else if(this.state.currentDay>0){
          // go to previous day's last page
          this.state.currentDay--;
          this.state.timeCursor=this.getMaxTimeOffset(); // 22:45..23:45
        }else return;
      }
      this.render(); this.attachEventListeners();
    }
  
    /* ---------- SESSIONS PER DAY ---------- */
    getSessionsForCurrentDay(){
      const day=this.getCurrentDay(); if(!day) return [];
      return this.state.sessions.filter(s=>getDayKey(new Date(s.sessionStartTime).getTime())===day.id);
    }
  
    /* ---------- EVENTS ---------- */
    attachEventListeners(){
      // places
      this.element.querySelectorAll('.agenda-block__place-tab').forEach(btn=>{
        btn.addEventListener('click',e=>{ this.state.currentPlace=e.currentTarget.dataset.placeId; this.render(); this.attachEventListeners(); });
      });
      // day dropdown
      const toggle=this.element.querySelector('.agenda-block__day-dropdown-toggle');
      if(toggle) toggle.addEventListener('click',e=>{e.stopPropagation(); this.toggleDropdown();});
      this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.stopPropagation(); const idx=parseInt(e.currentTarget.dataset.dayIndex,10);
          this.changeDay(idx); this.state.isDropdownOpen=false; this.render(); this.attachEventListeners();
        });
      });
      if(!this._outsideClickHandler){
        this._outsideClickHandler=e=>{
          if(!this.element.contains(e.target)&&this.state.isDropdownOpen){
            this.state.isDropdownOpen=false; this.render(); this.attachEventListeners();
          }
        };
        document.addEventListener('click',this._outsideClickHandler);
      }
      // pagination
      this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(btn=>{
        btn.addEventListener('click',e=>this.paginate(e.currentTarget.dataset.direction));
      });
      // resize
      const onResize=debounce(()=>{
        const was=this.state.isMobile; this.state.isMobile=window.innerWidth<768;
        if(was!==this.state.isMobile){ this.render(); this.attachEventListeners(); }
      },250);
      window.addEventListener('resize',onResize);
    }
  
    toggleDropdown(){ this.state.isDropdownOpen=!this.state.isDropdownOpen; this.render(); this.attachEventListeners(); }
    changeDay(idx){
      if(idx>=0 && idx<this.state.days.length){
        this.state.currentDay=idx;
        this.state.timeCursor=0; // start a chosen day at 00:00 IST
        this.render(); this.attachEventListeners();
      }
    }
  
    /* ---------- STICKY HEADER ---------- */
    setupStickyHeader(){
      const header=this.element.querySelector('.agenda-block__header'); if(!header) return;
      const top=this.getSubNavHeight();
      header.style.setProperty('top',`${top-1}px`);
      const obs=new IntersectionObserver(([entry])=>{
        entry.target.classList.toggle('agenda-block__header--pinned', entry.intersectionRatio<1);
      },{threshold:[1],rootMargin:`-${top}px 0px 0px 0px`});
      obs.observe(header);
    }
    getSubNavHeight(){
      let t=0; const sticky=document.querySelector('.global-navigation');
      if(sticky && !sticky.classList.contains('feds-header-wrapper--retracted')) t+=sticky.offsetHeight;
      return t;
    }
  
    /* ---------- LIVE UPDATES ---------- */
    startLiveUpdates(){
      this.updateInterval=setInterval(()=>{
        this.state.currentTime=Date.now();
        this.state.sessions=this.state.sessions.map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        const header=this.element.querySelector('.agenda-block__time-header'); if(!header) return;
        header.querySelectorAll('.agenda-block__time-cell').forEach(c=>c.remove());
        const html=this.renderTimeHeader(); if(html) header.insertAdjacentHTML('beforeend',html);
      },5000);
    }
    destroy(){ if(this.updateInterval){clearInterval(this.updateInterval); this.updateInterval=null;} }
  }
  
  /* =========================
     INIT
  ========================= */
  export default function init(el){ return new VanillaAgendaBlock(el); }
  
  /* =========================
     OPTIONAL: MOCK WIRING
     (ensure your mock exists)
  ========================= */
  // If you set AGENDA_CONFIG.api.useMockData=true, make sure a mock is present:
  if(typeof window!=='undefined' && typeof window.MOCK_CHIMERA_API_RESPONSE==='undefined' && typeof MOCK_CHIMERA_API_RESPONSE==='undefined'){
    window.MOCK_CHIMERA_API_RESPONSE={cards:[]}; // you will paste your real mock where you load this file
  }
  