/* ======================
   CONFIG (kept from you)
======================= */
const AGENDA_CONFIG = {
    tracks: [
      { id:'live-broadcast',tagId:'caas:events/max/primary-track/live-broadcast',title:'Mainstage Broadcast',description:"Don't miss the Mainstage Broadcast of Keynotes, Sneaks, Creativity Super Sessions, and Luminary Sessions.",color:'#FF6B00' },
      { id:'adobe-live-at-max',tagId:'caas:events/max/primary-track/adobe-live-at-max',title:'Adobe Live @ MAX',description:'Visit your favorite MAX speakers online to get your questions answered.',color:'#1473E6' },
      { id:'creativity-and-design-in-business',tagId:'caas:events/max/primary-track/creativity-and-design-in-business',title:'Creativity and Design in Business',description:'Inspiring speakers share their expertise and insights about creative leadership.',color:'#00A38F' },
      { id:'video-audio-and-motion',tagId:'caas:events/max/primary-track/video-audio-and-motion',title:'Video, Audio, and Motion',description:'Learn how to edit your first video and transform static graphics into motion.',color:'#9C27B0' },
      { id:'photography',tagId:'caas:events/max/primary-track/photography',title:'Photography',description:'Spark your passion for photography with sessions that will help you build your skills.',color:'#795548' },
      { id:'social-media-and-marketing',tagId:'caas:events/max/primary-track/social-media-and-marketing',title:'Social Media and Marketing',description:'Leverage the power of social media and marketing to elevate your brand.',color:'#3F51B5' },
      { id:'education',tagId:'caas:events/max/primary-track/education',title:'Education',description:'Get essential creative and generative AI skills that open doors to a brighter future.',color:'#FF9800' },
      { id:'3d',tagId:'caas:events/max/primary-track/3d',title:'3D',description:'Add the power of 3D to your design skillset and take your career to new heights.',color:'#FF5722' },
    ],
    places:[
      { id:'live',name:'Live',timezone:'PST' },
      { id:'americas',name:'Americas',timezone:'PST' },
      { id:'emea',name:'Europe, Middle East, and Africa',timezone:'CET' },
      { id:'apac',name:'Asia Pacific',timezone:'JST' },
    ],
    defaultPlace:'americas',
    labels:{
      liveLabel:'LIVE',
      onDemandLabel:'ON DEMAND',
      featuredLabel:'FEATURED',
      timeZoneLabel:'Times in',
      loadingText:'Loading agenda...',
      noSessionsText:'No sessions available for this day',
      prevAriaLabel:'Previous',
      nextAriaLabel:'Next',
    },
    styles:{
      primaryBackgroundColor:'#F5F5F5',
      cellBorderColor:'#E0E0E0',
      cornerRadius:4,
    },
    api:{
      chimeraEndpoint:'https://chimera-api.adobe.io/collection',
      useMockData:true,
    },
  };
  
  /* ======================
     CONSTANTS (updated)
  ======================= */
  const MINUTE_MS = 60*1000;
  const TIME_SLOT_MIN = 15;
  const TIME_SLOT_MS = TIME_SLOT_MIN*MINUTE_MS;
  const VISIBLE_TIME_SLOTS = 5;
  
  /* Full day in 15-min slots => 24 * 60 / 15 = 96 slots (0..95) */
  const LAST_DAY_SLOT = 95;
  const TARGET_LAST_PAGE_OFFSET = LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1; // 91
  
  /* ======================
     HELPERS
  ======================= */
  function formatDate(date){return date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
  
  /* Force IST formatting regardless of user tz */
  const fmtIST = new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Kolkata'});
  function formatTimeIST(ts){return fmtIST.format(new Date(ts));}
  
  /* Day start at 00:00:00 **IST** but we compute via UTC by subtracting IST offset */
  function getIstMidnightUtcTs(isoDay){ // isoDay = 'YYYY-MM-DD'
    // 00:00 IST equals 18:30:00 of the previous day UTC
    // Simpler: construct Date in IST via offset math.
    // We'll compute UTC timestamp for ISO 'YYYY-MM-DDT00:00:00' as if in IST:
    const utcTs = Date.parse(isoDay+'T00:00:00Z'); // midnight UTC
    const IST_OFFSET_MS = 5.5*60*60*1000;
    // We want IST midnight, i.e., UTC time = isoDayT00:00Z - 5:30
    return utcTs - IST_OFFSET_MS;
  }
  
  function getDayKey(ts){return new Date(ts).toISOString().split('T')[0];}
  
  function getSessionEndTime(session){
    if(session.sessionEndTime) return session.sessionEndTime;
    if(session.sessionStartTime && session.sessionDuration){
      const start = Date.parse(session.sessionStartTime);
      const durMin = parseInt(session.sessionDuration,10);
      return new Date(start + durMin*MINUTE_MS).toISOString();
    }
    return session.sessionStartTime || new Date().toISOString();
  }
  
  function isSessionLive(s){
    const now = Date.now();
    const start = Date.parse(s.sessionStartTime);
    const end = Date.parse(getSessionEndTime(s));
    return now>=start && now<=end;
  }
  function isSessionOnDemand(s){
    const now = Date.now();
    const end = Date.parse(getSessionEndTime(s));
    return now>end;
  }
  
  function extractDaysFromSessions(sessions){
    const m=new Map();
    sessions.forEach(s=>{
      const start = Date.parse(s.sessionStartTime);
      const dayKey = getDayKey(start);
      if(!m.has(dayKey)){
        const d = new Date(start);
        m.set(dayKey,{id:dayKey,date:dayKey,label:formatDate(d),startTime:getIstMidnightUtcTs(dayKey)});
      }
    });
    return Array.from(m.values()).sort((a,b)=>a.startTime-b.startTime);
  }
  
  function debounce(fn,wait){let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait);}}
  
  /* ======================
     MAIN CLASS
  ======================= */
  class VanillaAgendaBlock{
    constructor(element){
      this.element=element;
      this.config=AGENDA_CONFIG;
      this.state={
        sessions:[],
        tracks:this.config.tracks,
        days:[],
        currentDay:0,
        timeCursor:0, // slot offset (0..91)
        isMobile:window.innerWidth<768,
        isLoading:true,
        currentPlace:this.config.defaultPlace,
        isDropdownOpen:false,
        currentTime:Date.now(),
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
  
    async fetchAndProcessData(){
      try{
        const resp = await this.fetchSessions();
        this.state.sessions = resp.cards.map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        this.state.days = extractDaysFromSessions(this.state.sessions);
  
        // initialize cursor to first session of day 0 (but slots start from IST 00:00 baseline)
        if(this.state.days.length>0) this.initializeTimeCursorToEarliest();
        this.state.isLoading=false;
      }catch(e){
        this.state.isLoading=false;
      }
    }
  
    async fetchSessions(){
      if(this.config.api.useMockData){
        await new Promise(r=>setTimeout(r,200));
        return MOCK_CHIMERA_API_RESPONSE; // provided by you
      }
      const r = await fetch(this.config.api.chimeraEndpoint);
      return await r.json();
    }
  
    renderLoading(){
      this.element.innerHTML = `
        <div class="agenda-block__loading">
          <div class="agenda-block__spinner"></div>
          <p>${this.config.labels.loadingText}</p>
        </div>`;
    }
  
    /* ====== TIME MATH (IST midnight baseline) ====== */
  
    getDayStartUtcTs(currentDay){ return getIstMidnightUtcTs(currentDay.date); }
  
    /* When landing on a day (via dropdown), show earliest session. */
    initializeTimeCursorToEarliest(){
      const day=this.state.days[this.state.currentDay]; if(!day){this.state.timeCursor=0;return;}
      const daySessions=this.getSessionsForCurrentDay();
      if(daySessions.length===0){ this.state.timeCursor=0; return; }
      const earliest = Math.min(...daySessions.map(s=>Date.parse(s.sessionStartTime)));
      const dayStart = this.getDayStartUtcTs(day);
      const earliestSlot = Math.max(0, Math.floor((earliest - dayStart)/TIME_SLOT_MS));
      this.state.timeCursor = Math.min(earliestSlot, TARGET_LAST_PAGE_OFFSET);
    }
  
    /* ====== RENDER ====== */
  
    render(){
      if(this.state.isLoading){ this.renderLoading(); return; }
      // cap cursor
      if(this.state.timeCursor > TARGET_LAST_PAGE_OFFSET) this.state.timeCursor = TARGET_LAST_PAGE_OFFSET;
  
      this.element.innerHTML = `
        <div class="agenda-block__container">
          ${this.renderHeader()}
        </div>`;
    }
  
    renderHeader(){
      return `
        <div class="agenda-block__header">
          <div class="agenda-block__watch-nav">
            <div class="agenda-block__watch-nav-row agenda-block__geo-row">
              <span class="agenda-block__watch-label">Watch:</span>
              <div class="agenda-block__place-selector">
                <ul class="agenda-block__place-list">
                  ${this.config.places.map(p=>`
                    <li class="agenda-block__place-item">
                      <button class="agenda-block__place-tab ${p.id===this.state.currentPlace?'active':''}" data-place-id="${p.id}">
                        ${p.name}
                      </button>
                    </li>`).join('')}
                </ul>
              </div>
              <div class="agenda-block__pagination">
                ${this.renderPagination()}
              </div>
            </div>
            <div class="agenda-block__watch-nav-row agenda-block__date-row">
              <div class="agenda-block__time-header">
                <div class="agenda-block__day-dropdown-container">
                  <button
                    class="agenda-block__day-dropdown-toggle ${this.state.isDropdownOpen?'open':''}"
                    data-dropdown-toggle="day-dropdown"
                    aria-expanded="${this.state.isDropdownOpen}"
                    aria-controls="day-dropdown">
                    <span>${this.state.days[this.state.currentDay]?.label || 'Select day'}</span>
                    <span class="agenda-block__day-dropdown-chevron">▼</span>
                  </button>
                  <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen?'open':''}" id="day-dropdown">
                    ${this.state.days.map((d,i)=>`
                      <button class="agenda-block__day-dropdown-item ${i===this.state.currentDay?'active':''}" data-day-index="${i}">
                        <span>${d.label}</span>
                        ${i===this.state.currentDay?'<span class="agenda-block__day-checkmark">✓</span>':''}
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
          <div class="agenda-block__tracks-column">
            ${this.renderTracksColumn()}
          </div>
          <div class="agenda-block__grid-wrapper">
            <div class="agenda-block__grid-container">
              ${this.renderGrid()}
            </div>
          </div>
        </div>`;
    }
  
    renderTracksColumn(){
      const currentDay=this.state.days[this.state.currentDay];
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map((track,idx)=>{
        const trackSessions = daySessions.filter(s=>s.sessionTrack.tagId===track.tagId);
        const rows = this.calculateNumberOfRowsForTrack(trackSessions,currentDay);
        const h = rows*140 + (rows-1)*6;
        return `
          <div class="agenda-block__track-label" style="border-left:4px solid ${track.color}; height:${h}px;">
            <div class="agenda-block__track-title-in-label">${track.title}</div>
            ${track.description?`<div class="agenda-block__track-description-in-label">${track.description}</div>`:''}
          </div>`;
      }).join('');
    }
  
    renderTimeHeader(){
      const slots = this.getVisibleTimeSlots();
      const now = this.state.currentTime || Date.now();
      return slots.map((t,i)=>{
        const next = slots[i+1];
        const isLive = next ? (now>=t && now<next) : (now>=t);
        const dt = new Date(t);
        const showIcon = dt.getMinutes()===0 && (dt.getHours()%12===0);
        const isDay = dt.getHours()>11;
        return `
          <div class="agenda-block__time-cell ${isLive?'time-cell-live':''}">
            ${isLive?`
              <div class="time_column_badge">
                <svg width="10" height="10" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>
                ${this.config.labels.liveLabel||'LIVE'}
              </div>`:''}
            ${renderDayNightIcon(showIcon && isDay, showIcon && !isDay)}
            <span class="time-value">${formatTimeIST(t)}</span>
          </div>`;
      }).join('');
    }
  
    renderGrid(){
      const currentDay=this.state.days[this.state.currentDay];
      if(!currentDay) return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
      const daySessions=this.getSessionsForCurrentDay();
      return this.state.tracks.map(track=>{
        const trackSessions = daySessions.filter(s=>s.sessionTrack.tagId===track.tagId);
        return `
          <div class="agenda-block__track-row">
            ${this.renderTrackSessions(trackSessions,currentDay)}
          </div>`;
      }).join('');
    }
  
    calculateSessionGridPositions(sessions,currentDay){
      const dayStart = this.getDayStartUtcTs(currentDay);
      const visibleStart = dayStart + (this.state.timeCursor*TIME_SLOT_MS);
  
      const sessionTiles=[];
      const occupied=new Set();
  
      sessions.forEach(session=>{
        const start = Date.parse(session.sessionStartTime);
        const end = Date.parse(getSessionEndTime(session));
        const startOffset = (start - visibleStart)/TIME_SLOT_MS;
        const endOffset = Math.ceil((end - visibleStart)/TIME_SLOT_MS) + 1;
  
        if(endOffset>0 && startOffset<VISIBLE_TIME_SLOTS){
          const visibleStartCol=Math.max(1,Math.floor(startOffset)+1);
          const visibleEndCol=Math.min(Math.ceil(endOffset),VISIBLE_TIME_SLOTS+1);
          let row=1,found=false;
          while(!found && row<=10){
            found=true;
            for(let c=visibleStartCol;c<visibleEndCol;c++){
              if(occupied.has(`${row}-${c}`)){found=false;row++;break;}
            }
          }
          for(let c=visibleStartCol;c<visibleEndCol;c++) occupied.add(`${row}-${c}`);
  
          sessionTiles.push({
            session,startColumn:visibleStartCol,endColumn:visibleEndCol,rowNumber:row,
            shouldDisplayDuration:(visibleEndCol-visibleStartCol)>2
          });
        }
      });
  
      const numberOfRows = sessionTiles.length? Math.max(...sessionTiles.map(t=>t.rowNumber)) : 1;
      return {sessionTiles,numberOfRows,occupiedCells:occupied};
    }
  
    calculateNumberOfRowsForTrack(sessions,currentDay){
      return this.calculateSessionGridPositions(sessions,currentDay).numberOfRows;
    }
  
    renderTrackSessions(sessions,currentDay){
      const {sessionTiles,numberOfRows,occupiedCells}=this.calculateSessionGridPositions(sessions,currentDay);
      let html='';
      sessionTiles.forEach(tile=>{
        const {session,startColumn,endColumn,rowNumber,shouldDisplayDuration}=tile;
        const start = Date.parse(session.sessionStartTime);
        const end = Date.parse(getSessionEndTime(session));
        const durMin = session.sessionDuration?parseInt(session.sessionDuration,10):Math.round((end-start)/MINUTE_MS);
        const durationText = durMin>=60 ? `${Math.floor(durMin/60)} hr ${durMin%60?`${durMin%60} min`:''}`.trim() : `${durMin} min`;
  
        const isLive=session.isLive, isOD=session.isOnDemand;
        html+=`
          <div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn-startColumn}" style="grid-area:${rowNumber} / ${startColumn} / ${rowNumber+1} / ${endColumn};">
            <article class="agenda_tile" style="border-color: rgb(213,213,213);">
              <a href="${session.cardUrl}" class="title" daa-ll="${isOD?'On Demand Session Title Click':'Session Title Click'}|${session.sessionTitle}">
                ${session.sessionTitle}
              </a>
              ${shouldDisplayDuration?`<footer>
                ${isLive?`
                  <div class="duration_badge">
                    <p class="duration">${durationText}</p>
                    <span class="marker marker-live">
                      <svg width="12" height="12" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>
                      ${this.config.labels.liveLabel||'LIVE'}
                    </span>
                  </div>`:`<p class="duration">${durationText}</p>`}
              </footer>`:''}
            </article>
          </div>`;
      });
  
      for(let row=1;row<=numberOfRows;row++){
        for(let col=1;col<=VISIBLE_TIME_SLOTS;col++){
          const key=`${row}-${col}`;
          if(!occupiedCells.has(key)){
            html+=`<article class="agenda_tile empty" style="grid-area:${row} / ${col} / ${row+1} / ${col+1}; border-color:#d5d5d5; background-image:linear-gradient(135deg,#d5d5d5 4.5%,rgba(0,0,0,0) 4.5%,rgba(0,0,0,0) 50%,#d5d5d5 50%,#d5d5d5 54.55%,rgba(0,0,0,0) 54.55%,rgba(0,0,0,0) 100%);"></article>`;
          }
        }
      }
  
      return `<section class="agenda_grid" style="grid-template-rows: repeat(${numberOfRows}, 140px); background-color: rgb(248,248,248);">
        ${html}
      </section>`;
    }
  
    renderPagination(){
      const minOff=this.getMinTimeOffset();
      const maxOff=this.getMaxTimeOffset();
      const hasNextDay=this.state.currentDay<this.state.days.length-1;
      const hasPrevDay=this.state.currentDay>0;
      const canNext=this.state.timeCursor<maxOff || hasNextDay;
      const canPrev=this.state.timeCursor>minOff || hasPrevDay;
  
      return `
        <button class="agenda-block__pagination-btn prev" data-direction="prev" ${!canPrev?'disabled':''} aria-label="${this.config.labels.prevAriaLabel||'Previous'}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" fill="#747474"/></svg>
        </button>
        <button class="agenda-block__pagination-btn next" data-direction="next" ${!canNext?'disabled':''} aria-label="${this.config.labels.nextAriaLabel||'Next'}">
          <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" fill="#747474"/></svg>
        </button>`;
    }
  
    /* ====== DAY & SLOTS ====== */
  
    getSessionsForCurrentDay(){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      return this.state.sessions.filter(s=>getDayKey(Date.parse(s.sessionStartTime))===d.id);
    }
  
    /* Visible slots always start from IST midnight baseline + timeCursor*15min, 5 slots wide */
    getVisibleTimeSlots(){
      const d=this.state.days[this.state.currentDay]; if(!d) return [];
      const dayStart=this.getDayStartUtcTs(d);
      const start=dayStart + (this.state.timeCursor*TIME_SLOT_MS);
      const dayEnd = dayStart + ((LAST_DAY_SLOT+1)*TIME_SLOT_MS);
      const out=[];
      for(let i=0;i<VISIBLE_TIME_SLOTS;i++){
        const t = start + i*TIME_SLOT_MS;
        if(t>=dayEnd) break;
        out.push(t);
      }
      return out;
    }
  
    getMinTimeOffset(){
      const daySessions=this.getSessionsForCurrentDay();
      if(daySessions.length===0) return 0;
      const earliest = Math.min(...daySessions.map(s=>Date.parse(s.sessionStartTime)));
      const dayStart = this.getDayStartUtcTs(this.state.days[this.state.currentDay]);
      return Math.max(0, Math.floor((earliest - dayStart)/TIME_SLOT_MS));
    }
  
    getMaxTimeOffset(){
      // Show the last page ending at 23:45 IST
      return TARGET_LAST_PAGE_OFFSET; // 91
    }
  
    /* ====== EVENTS ====== */
  
    attachEventListeners(){
      // Place tabs
      this.element.querySelectorAll('.agenda-block__place-tab').forEach(b=>{
        b.addEventListener('click',e=>{
          this.changePlace(e.currentTarget.dataset.placeId);
        });
      });
  
      // Day dropdown toggle
      const tgl=this.element.querySelector('.agenda-block__day-dropdown-toggle');
      if(tgl){
        tgl.addEventListener('click',e=>{
          e.stopPropagation();
          this.toggleDropdown();
        });
      }
  
      // Day items
      this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.stopPropagation();
          const idx=parseInt(e.currentTarget.dataset.dayIndex,10);
          this.changeDay(idx); // set to earliest session of the selected day
          this.state.isDropdownOpen=false;
          this.render(); this.attachEventListeners();
        });
      });
  
      if(!this._outsideClickHandler){
        this._outsideClickHandler=(e)=>{
          if(!this.element.contains(e.target) && this.state.isDropdownOpen){
            this.state.isDropdownOpen=false; this.render(); this.attachEventListeners();
          }
        };
        document.addEventListener('click',this._outsideClickHandler);
      }
      if(!this._escHandler){
        this._escHandler=(e)=>{
          if(e.key==='Escape' && this.state.isDropdownOpen){
            this.state.isDropdownOpen=false; this.render(); this.attachEventListeners();
          }
        };
        document.addEventListener('keydown',this._escHandler);
      }
  
      // Pagination
      this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(btn=>{
        btn.addEventListener('click',e=>{
          this.paginate(e.currentTarget.dataset.direction);
        });
      });
  
      // Resize
      const onResize=debounce(()=>{
        const prev=this.state.isMobile;
        this.state.isMobile = window.innerWidth<768;
        if(prev!==this.state.isMobile){ this.render(); this.attachEventListeners(); }
      },250);
      window.addEventListener('resize',onResize);
    }
  
    toggleDropdown(){ this.state.isDropdownOpen=!this.state.isDropdownOpen; this.render(); this.attachEventListeners(); }
    changePlace(id){ this.state.currentPlace=id; this.render(); this.attachEventListeners(); }
    changeDay(i){
      if(i>=0 && i<this.state.days.length){
        this.state.currentDay=i;
        this.initializeTimeCursorToEarliest();
        this.render(); this.attachEventListeners();
      }
    }
  
    /* Pagination rules:
       - normal pages: +5/-5 slots
       - from last page of a day, Next -> next day at 00:00 (timeCursor=0)
       - from first page of a day and Prev -> previous day last page (offset=91)
    */
    paginate(direction){
      const step = VISIBLE_TIME_SLOTS; // 5 slots
      const minOff=this.getMinTimeOffset();
      const maxOff=this.getMaxTimeOffset();
  
      if(direction==='next'){
        if(this.state.timeCursor>=maxOff){
          // move to next day at 00:00 (your required behavior)
          if(this.state.currentDay < this.state.days.length-1){
            this.state.currentDay++;
            this.state.timeCursor = 0; // <<< key fix for your 00:00,00:15,...
            this.render(); this.attachEventListeners(); return;
          }
          return;
        }
        const nextPos=this.state.timeCursor+step;
        this.state.timeCursor = nextPos>=maxOff? maxOff : nextPos;
      }else if(direction==='prev'){
        if(this.state.timeCursor>minOff){
          this.state.timeCursor=Math.max(this.state.timeCursor-step,minOff);
        }else{
          // go to previous day's last page
          if(this.state.currentDay>0){
            this.state.currentDay--;
            this.state.timeCursor = TARGET_LAST_PAGE_OFFSET; // 23:45 view
          }
        }
      }
      this.render(); this.attachEventListeners();
    }
  
    setupStickyHeader(){
      const header=this.element.querySelector('.agenda-block__header'); if(!header) return;
      const top=this.getSubNavHeight();
      header.style.setProperty('top',`${top-1}px`);
      const obs=new IntersectionObserver(([entry])=>{
        entry.target.classList.toggle('agenda-block__header--pinned',entry.intersectionRatio<1);
      },{threshold:[1],rootMargin:`-${top}px 0px 0px 0px`});
      obs.observe(header);
    }
  
    getSubNavHeight(){
      let t=0;
      const sticky=document.querySelector('.global-navigation');
      if(sticky && !sticky.classList.contains('feds-header-wrapper--retracted')) t+=sticky.offsetHeight;
      return t;
    }
  
    startLiveUpdates(){
      this.updateInterval=setInterval(()=>{
        this.state.currentTime=Date.now();
        this.state.sessions=this.state.sessions.map(s=>({...s,isLive:isSessionLive(s),isOnDemand:isSessionOnDemand(s)}));
        const th=this.element.querySelector('.agenda-block__time-header');
        if(th){
          th.querySelectorAll('.agenda-block__time-cell').forEach(c=>c.remove());
          th.insertAdjacentHTML('beforeend',this.renderTimeHeader());
        }
      },5000);
    }
  
    destroy(){ if(this.updateInterval){clearInterval(this.updateInterval); this.updateInterval=null;} }
  }
  
  /* ======================
     INIT
  ======================= */
  export default function init(el){ return new VanillaAgendaBlock(el); }
  
  /* ======================
     MOCK (your sample)
  ======================= */
  // Put your MOCK_CHIMERA_API_RESPONSE here (as provided in your message)
  