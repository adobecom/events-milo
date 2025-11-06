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
  
  /* constants */
  const MINUTE_MS=60*1000,HOUR_MS=60*MINUTE_MS;
  const TIME_SLOT_DURATION=15,VISIBLE_TIME_SLOTS=5;
  const SLOTS_PER_DAY=24*60/TIME_SLOT_DURATION; //96
  const LAST_DAY_SLOT=SLOTS_PER_DAY-1; //95 (23:45)
  const PAGINATION_STEP=VISIBLE_TIME_SLOTS;
  
  /* mock */
  const MOCK=typeof MOCK_CHIMERA_API_RESPONSE!=='undefined'?MOCK_CHIMERA_API_RESPONSE:{cards:[]};
  
  /* tz via place (fixed offsets; LOCAL uses browser tz offset at runtime) */
  const PLACE_OFFSETS_MIN={americas:-480,emea:60,apac:540,live:null}; // minutes; live=null means use browser
  const pad2=n=>String(n).padStart(2,'0');
  const toMs=v=>typeof v==='number'?v:(v?Date.parse(v):NaN);
  
  /* browser local offset (minutes) for a UTC ms instant */
  const browserOffsetMin=ms=>-new Date(ms).getTimezoneOffset();
  
  /* offset minutes for a placeId at an instant (no DST except LOCAL/browser) */
  function offsetMinForPlace(placeId,ms=Date.now()){
    const cfg=AGENDA_CONFIG.places.find(p=>p.id===placeId);
    if(!cfg||cfg.timezone==='LOCAL'||PLACE_OFFSETS_MIN[placeId]===null) return browserOffsetMin(ms);
    return PLACE_OFFSETS_MIN[placeId]??-480;
  }
  
  /* convert UTC ms -> local ms in place */
  const toLocalMs=(utcMs,placeId)=>utcMs + offsetMinForPlace(placeId,utcMs)*60*1000;
  /* convert local dateKey 00:00 (YYYY-MM-DD) in place -> UTC ms */
  const tzMidnightMs=(dateKey,placeId)=>Date.parse(`${dateKey}T00:00:00Z`) - offsetMinForPlace(placeId,Date.parse(`${dateKey}T12:00:00Z`))*60*1000;
  
  /* formatters using place offsets (keeps it consistent) */
  function fmtDatePlace(utcMs,placeId){
    const d=new Date(toLocalMs(utcMs,placeId));
    return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  }
  function dayKeyPlace(utcMs,placeId){
    const d=new Date(toLocalMs(utcMs,placeId));
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  }
  function fmtTimePlace(utcMs,placeId){
    const d=new Date(toLocalMs(utcMs,placeId));
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  
  /* misc helpers */
  function getSessionEndTime(s){
    if(s.sessionEndTime) return s.sessionEndTime;
    if(s.sessionStartTime&&s.sessionDuration){
      const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return s.sessionStartTime;
      return new Date(st+parseInt(s.sessionDuration,10)*MINUTE_MS).toISOString();
    }
    return s.sessionStartTime||new Date().toISOString();
  }
  const isSessionLive=s=>{const now=Date.now(),st=toMs(s.sessionStartTime),et=toMs(getSessionEndTime(s));return Number.isFinite(st)&&Number.isFinite(et)&&now>=st&&now<=et};
  const isSessionOnDemand=s=>{const now=Date.now(),et=toMs(getSessionEndTime(s));return Number.isFinite(et)&&now>et};
  const uses24hr=()=>{try{const p=new Intl.DateTimeFormat(navigator.language,{hour:'numeric'}).formatToParts(new Date(2020,0,1,13));return (p.find(x=>x.type==='hour')?.value||'').length===2;}catch{return false;}};
  const debounce=(fn,wait)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait)}};
  const liveIndicator=()=>`<span class="agenda-block__live-indicator"><svg class="live-circle" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg><span class="live-label">LIVE</span></span>`;
  const iconSun=()=>`<div class="daytime_icon"><svg viewBox="0 0 14.5 14.5"><circle cx="7.25" cy="7.25" r="3.2" fill="currentColor"/></svg></div>`;
  const iconMoon=()=>`<div class="daytime_icon"><svg viewBox="0 0 8.1 11"><path d="M7.9,1.2C8,1.2,8.1,1,8.1,0.9C8.1,10,8,9.8,7.9,9.8C5.5,8.7,4.5,5.9,5.6,3.5C6.1,2.5,6.9,1.7,7.9,1.2z" fill="currentColor"/></svg></div>`;
  
  /* days extraction (based on sessions + place) */
  function extractDaysFromSessions(sessions,placeId){
    const map=new Map();
    sessions.forEach(s=>{
      const st=toMs(s.sessionStartTime); if(!Number.isFinite(st)) return;
      const key=dayKeyPlace(st,placeId);
      if(!map.has(key)){
        const mid=tzMidnightMs(key,placeId);
        map.set(key,{id:key,date:key,label:fmtDatePlace(mid,placeId),startTime:mid});
      }
    });
    return Array.from(map.values()).sort((a,b)=>a.startTime-b.startTime);
  }
  
  /* component */
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
        const resp=await this.fetchSessions();
        this.state.sessions=(resp.cards||[]).map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        this.recomputeDaysForPlace(); // build days for current place
        if(this.state.days.length>0){this.state.currentDay=Math.min(this.state.currentDay,this.state.days.length-1);this.initializeTimeCursor();}
        this.state.isLoading=false;
      }catch(e){this.state.isLoading=false;}
    }
  
    async fetchSessions(){
      if(this.config.api?.useMockData){await new Promise(r=>setTimeout(r,150));return MOCK;}
      const r=await fetch(this.config.api.chimeraEndpoint);return await r.json();
    }
  
    /* place helpers */
    currentPlaceId(){return this.state.currentPlace}
    currentPlaceName(){return (this.config.places.find(p=>p.id===this.state.currentPlace)?.name)||''}
  
    recomputeDaysForPlace(){
      this.state.days=extractDaysFromSessions(this.state.sessions,this.currentPlaceId());
      if(this.state.currentDay>=this.state.days.length) this.state.currentDay=0;
    }
  
    initializeTimeCursor(){
      const d=this.state.days[this.state.currentDay]; if(!d) return;
      const place=this.currentPlaceId();
      const dayStart=tzMidnightMs(d.id,place)+8*HOUR_MS; // 08:00 local
      const daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length){this.state.timeCursor=0;return;}
      const earliest=Math.min(...daySessions.map(s=>toMs(s.sessionStartTime)));
      this.state.timeCursor=Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_DURATION*MINUTE_MS)));
    }
  
    renderLoading(){this.element.innerHTML=`<div class="agenda-block__loading"><div class="agenda-block__spinner"></div><p>${this.config.labels.loadingText}</p></div>`}
  
    render(){
      if(this.state.isLoading){this.renderLoading();return;}
      const max=this.getMaxTimeOffset(); if(this.state.timeCursor>max) this.state.timeCursor=max;
      this.element.innerHTML=`<div class="agenda-block__container">${this.renderHeader()}</div>`;
    }
  
    renderPagination(){
      const min=this.getMinTimeOffset(),max=this.getMaxTimeOffset();
      const hasPrevDay=this.state.currentDay>0,hasNextDay=this.state.currentDay<this.state.days.length-1;
      const canPrev=this.state.timeCursor>min||hasPrevDay;
      const canNext=this.state.timeCursor<max||hasNextDay;
      const L=this.config.labels||{};
      return `
        <button class="agenda-block__pagination-btn prev" data-direction="prev" ${!canPrev?'disabled':''} aria-label="${L.prevAriaLabel||'Previous'}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%"><path d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" fill="#747474"/></svg>
        </button>
        <button class="agenda-block__pagination-btn next" data-direction="next" ${!canNext?'disabled':''} aria-label="${L.nextAriaLabel||'Next'}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%"><path d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" fill="#747474"/></svg>
        </button>`;
    }
  
    renderHeader(){
      const dayLabel=this.state.days[this.state.currentDay]?.label||'Select day';
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
                    <span>${dayLabel}</span><span class="agenda-block__day-dropdown-chevron">▼</span>
                  </button>
                  <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen?'open':''}" id="day-dropdown">
                    ${this.state.days.map((d,i)=>`
                      <button class="agenda-block__day-dropdown-item ${i===this.state.currentDay?'active':''}" data-day-index="${i}">
                        <span>${d.label}</span>${i===this.state.currentDay?'<span class="agenda-block__day-checkmark">✓</span>':''}
                      </button>`).join('')}
                  </div>
                  <div class="agenda-block__timezone-label">Date and times in ${this.currentPlaceName()}</div>
                </div>
                ${this.state.days.length?this.renderTimeHeader():''}
              </div>
            </div>
          </div>
        </div>
        ${this.state.days.length?this.renderTracksColumnWithGrid():''}`;
    }
  
    renderTimeHeader(){
      const slots=this.getVisibleTimeSlots(),now=this.state.currentTime,hrs24=uses24hr();
      return slots.map((t,i)=>{
        const next=slots[i+1];
        const local=new Date(toLocalMs(t,this.currentPlaceId()));
        const isLive=next?now>=t&&now<next:now>=t;
        const showIcon=hrs24&&local.getMinutes()===0&&local.getHours()%12===0;
        const showSun=showIcon&&local.getHours()>=12,showMoon=showIcon&&!showSun;
        return `<div class="agenda-block__time-cell ${isLive?'time-cell-live':''}">
          ${isLive?liveIndicator():''}${showSun?iconSun():''}${showMoon?iconMoon():''}
          <span class="time-value">${fmtTimePlace(t,this.currentPlaceId())}</span>
        </div>`;
      }).join('');
    }
  
    renderTracksColumnWithGrid(){
      const currentDay=this.state.days[this.state.currentDay];
      if(!currentDay) return '<div class="agenda-block__body"></div>';
      return `
        <div class="agenda-block__body">
          <div class="agenda-block__tracks-column">${this.renderTracksColumn()}</div>
          <div class="agenda-block__grid-wrapper"><div class="agenda-block__grid-container">${this.renderGrid()}</div></div>
        </div>`;
    }
  
    renderTracksColumn(){
      const currentDay=this.state.days[this.state.currentDay]; if(!currentDay) return '';
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(track=>{
        const trackSessions=daySessions.filter(s=>s.sessionTrack&&s.sessionTrack.tagId===track.tagId);
        const rows=this.calculateNumberOfRowsForTrack(trackSessions,currentDay);
        const h=rows*140+(rows-1)*6;
        return `
          <div class="agenda-block__track-label" style="border-left:4px solid ${track.color};height:${h}px;">
            <div class="agenda-block__track-title-in-label">${track.title}</div>
            ${track.description?`<div class="agenda-block__track-description-in-label">${track.description}</div>`:''}
          </div>`;
      }).join('');
    }
  
    renderGrid(){
      const currentDay=this.state.days[this.state.currentDay];
      if(!currentDay) return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(track=>{
        const trackSessions=daySessions.filter(s=>s.sessionTrack&&s.sessionTrack.tagId===track.tagId);
        return `<div class="agenda-block__track-row">${this.renderTrackSessions(trackSessions,currentDay)}</div>`;
      }).join('');
    }
  
    renderTrackSessions(sessions,currentDay){
      const {sessionTiles,numberOfRows,occupiedCells}=this.calculateSessionGridPositions(sessions,currentDay);
      let html='';
      sessionTiles.forEach(t=>{
        const {session,startColumn,endColumn,rowNumber,shouldDisplayDuration}=t;
        const durMin=parseInt(session.sessionDuration||'0',10);
        const durText=durMin>=60?`${Math.floor(durMin/60)} hr ${durMin%60?durMin%60+' min':''}`:`${durMin} min`;
        const idx=this.state.tracks.findIndex(x=>x.tagId===session.sessionTrack?.tagId)+1;
        const state=session.isOnDemand?'On Demand':session.isLive?'Live':'Upcoming';
        const daa=`Logged Out|No Filter|${session.sessionTrack?.title||''}-${idx}|${session.isFeatured?'Featured':'Not Featured'}|${session.sessionId}|${state}|${session.sessionTitle}`;
        html+=`<div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn-startColumn}" style="grid-area:${rowNumber}/${startColumn}/${rowNumber+1}/${endColumn};">
          <article class="agenda_tile" daa-lh="${daa}" style="border-color:${this.config.styles?.cellBorderColor||'#d5d5d5'};">
            <a href="${session.cardUrl}" class="title" daa-ll="${session.isOnDemand?'On Demand Session Title Click':'Session Title Click'}|${session.sessionTitle}">${session.sessionTitle}</a>
            ${shouldDisplayDuration?`<footer><p class="duration">${durText}</p></footer>`:''}
          </article>
        </div>`;
      });
      for(let r=1;r<=numberOfRows;r++){
        for(let c=1;c<=VISIBLE_TIME_SLOTS;c++){
          const key=`${r}-${c}`; if(occupiedCells.has(key)) continue;
          html+=`<article class="agenda_tile empty" style="grid-area:${r}/${c}/${r+1}/${c+1};border-color:${this.config.styles?.cellBorderColor||'#d5d5d5'};background-image:linear-gradient(135deg,#d5d5d5 4.5%,transparent 4.5%,transparent 50%,#d5d5d5 50%,#d5d5d5 54.55%,transparent 54.55%,transparent 100%);"></article>`;
        }
      }
      return `<section class="agenda_grid" style="grid-template-rows:repeat(${numberOfRows},140px);background-color:${this.config.styles?.primaryBackgroundColor||'#f8f8f8'};">${html}</section>`;
    }
  
    /* calculations */
    getSessionsForCurrentDay(){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      return this.state.sessions.filter(s=>dayKeyPlace(toMs(s.sessionStartTime),this.currentPlaceId())===d.id);
    }
  
    getVisibleTimeSlots(){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      const place=this.currentPlaceId();
      const dayStart=tzMidnightMs(d.id,place)+8*HOUR_MS; // 08:00 local
      const start=dayStart + this.state.timeCursor*TIME_SLOT_DURATION*MINUTE_MS;
      const dayEnd=tzMidnightMs(d.id,place) + 24*HOUR_MS; // next local midnight
      const a=[];
      for(let i=0;i<VISIBLE_TIME_SLOTS;i++){
        const t=start+i*TIME_SLOT_DURATION*MINUTE_MS;
        if(t>=dayEnd) break;
        a.push(t);
      }
      return a;
    }
  
    getMinTimeOffset(){
      const d=this.state.days[this.state.currentDay]; if(!d) return 0;
      const place=this.currentPlaceId();
      const dayStart=tzMidnightMs(d.id,place)+8*HOUR_MS;
      const daySessions=this.getSessionsForCurrentDay();
      if(!daySessions.length) return 0;
      const earliest=Math.min(...daySessions.map(s=>toMs(s.sessionStartTime)));
      return Math.max(0,Math.floor((earliest-dayStart)/(TIME_SLOT_DURATION*MINUTE_MS)));
    }
  
    getMaxTimeOffset(){
      // last 5 slots of day (23:00..23:45 → 5 slots) relative to 08:00 start view
      // but our page starts at 08:00; for simplicity keep classic: last window ending at local 24:00
      return (24*60/TIME_SLOT_DURATION) - VISIBLE_TIME_SLOTS; // 96-5=91
    }
  
    calculateSessionGridPositions(sessions,currentDay){
      if(!currentDay) return {sessionTiles:[],numberOfRows:1,occupiedCells:new Set()};
      const place=this.currentPlaceId();
      const dayStart08=tzMidnightMs(currentDay.id,place)+8*HOUR_MS;
      const visibleStart=dayStart08 + this.state.timeCursor*TIME_SLOT_DURATION*MINUTE_MS;
  
      const sessionTiles=[];const occupied=new Set();
      (sessions||[]).forEach(s=>{
        const st=toMs(s.sessionStartTime),en=toMs(getSessionEndTime(s));
        if(!Number.isFinite(st)||!Number.isFinite(en)) return;
        const startOff=(st-visibleStart)/(TIME_SLOT_DURATION*MINUTE_MS);
        const endOff=Math.ceil((en-visibleStart)/(TIME_SLOT_DURATION*MINUTE_MS))+1;
        if(endOff>0&&startOff<VISIBLE_TIME_SLOTS){
          const startCol=Math.max(1,Math.floor(startOff)+1);
          const endCol=Math.min(Math.ceil(endOff),VISIBLE_TIME_SLOTS+1);
          let row=1,ok=false;
          while(!ok&&row<=10){
            ok=true;for(let c=startCol;c<endCol;c++){if(occupied.has(`${row}-${c}`)){ok=false;row++;break;}}
          }
          for(let c=startCol;c<endCol;c++) occupied.add(`${row}-${c}`);
          sessionTiles.push({session:s,startColumn:startCol,endColumn:endCol,rowNumber:row,shouldDisplayDuration:(endCol-startCol)>2});
        }
      });
      const rows=sessionTiles.length?Math.max(...sessionTiles.map(t=>t.rowNumber)):1;
      return {sessionTiles,numberOfRows:rows,occupiedCells:occupied};
    }
  
    calculateNumberOfRowsForTrack(sessions,currentDay){return this.calculateSessionGridPositions(sessions,currentDay).numberOfRows}
  
    /* events */
    attachEventListeners(){
      this.element.querySelectorAll('.agenda-block__place-tab').forEach(b=>{
        b.addEventListener('click',e=>this.changePlace(e.currentTarget.dataset.placeId));
      });
      const dd=this.element.querySelector('.agenda-block__day-dropdown-toggle');
      if(dd){dd.addEventListener('click',e=>{e.stopPropagation();this.toggleDropdown();});}
      this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(b=>{
        b.addEventListener('click',e=>{
          e.stopPropagation();
          const i=parseInt(e.currentTarget.dataset.dayIndex,10);
          this.changeDay(i);
          this.state.isDropdownOpen=false;this.render();this.attachEventListeners();
        });
      });
      if(!this._outside){
        this._outside=(e)=>{if(!this.element.contains(e.target)&&this.state.isDropdownOpen){this.state.isDropdownOpen=false;this.render();this.attachEventListeners();}};
        document.addEventListener('click',this._outside);
      }
      this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(b=>{
        b.addEventListener('click',e=>this.paginate(e.currentTarget.dataset.direction));
      });
      const onResize=debounce(()=>{
        const was=this.state.isMobile;this.state.isMobile=window.innerWidth<768;
        if(was!==this.state.isMobile){this.render();this.attachEventListeners();}
      },250);
      window.addEventListener('resize',onResize);
    }
  
    toggleDropdown(){this.state.isDropdownOpen=!this.state.isDropdownOpen;this.render();this.attachEventListeners();}
    changePlace(placeId){
      if(placeId===this.state.currentPlace) return;
      this.state.currentPlace=placeId;
      this.recomputeDaysForPlace();
      this.state.currentDay=0;this.initializeTimeCursor();
      this.render();this.attachEventListeners();
    }
    changeDay(i){
      if(i<0||i>=this.state.days.length) return;
      this.state.currentDay=i;this.initializeTimeCursor();this.render();this.attachEventListeners();
    }
  
    paginate(dir){
      const step=PAGINATION_STEP,min=this.getMinTimeOffset(),max=this.getMaxTimeOffset();
      if(dir==='next'){
        if(this.state.timeCursor>=max){
          if(this.state.currentDay<this.state.days.length-1){this.state.currentDay++;this.initializeTimeCursor();this.render();this.attachEventListeners();}
          return;
        }
        const next=this.state.timeCursor+step;
        this.state.timeCursor=next>=max?max:next;
      }else if(dir==='prev'){
        if(this.state.timeCursor>min){this.state.timeCursor=Math.max(this.state.timeCursor-step,min);}
        else if(this.state.currentDay>0){this.state.currentDay--;this.state.timeCursor=this.getMaxTimeOffset();}
      }
      this.render();this.attachEventListeners();
    }
  
    setupStickyHeader(){
      const header=this.element.querySelector('.agenda-block__header'); if(!header) return;
      const top=this.getSubNavHeight();header.style.setProperty('top',`${top-1}px`);
      const obs=new IntersectionObserver(([e])=>{e.target.classList.toggle('agenda-block__header--pinned',e.intersectionRatio<1)},{threshold:[1],rootMargin:`-${top}px 0px 0px 0px`});
      obs.observe(header);
    }
    getSubNavHeight(){
      let top=0;const sticky=document.querySelector('.global-navigation');
      if(sticky&&!sticky.classList.contains('feds-header-wrapper--retracted')) top+=sticky.offsetHeight;
      return top;
    }
  
    startLiveUpdates(){
      this.updateInterval=setInterval(()=>{
        this.state.currentTime=Date.now();
        this.state.sessions=this.state.sessions.map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        const th=this.element.querySelector('.agenda-block__time-header');
        if(!th) return;
        th.querySelectorAll('.agenda-block__time-cell').forEach(n=>n.remove());
        th.insertAdjacentHTML('beforeend',this.renderTimeHeader());
      },5000);
    }
    destroy(){if(this.updateInterval){clearInterval(this.updateInterval);this.updateInterval=null;}}
  }
  
  /* init */
  export default function init(el){return new VanillaAgendaBlock(el);}
  