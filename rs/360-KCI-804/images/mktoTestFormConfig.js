// ##
// ## Test Module - Just a rough test module to set the config of the form.11
// ##

if (
  typeof mczFrm_mkto_testing_loader != "function" &&
  typeof mczFrm_mkto_testing_loader == "undefined"
) {
  //*
  //*
  async function getMktToken() {
    const storageKey = "mkt_tok";
    let mktToken = "";

    if (window.__mktTokVal && window.__mktTokVal?.trim()?.length > 0) {
      return window.__mktTokVal;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(storageKey)) {
      mktToken = urlParams.get(storageKey);
      try {
        sessionStorage.setItem(storageKey, mktToken);
        localStorage.setItem(storageKey, mktToken);
      } catch (e) {
        console.warn(`Could not save ${storageKey} to storage`, e);
      }
    } else {
      mktToken = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey) || "";
    }

    window.__mktTokVal = mktToken;
    return mktToken;
  }

  window.getMktToken = await getMktToken();

  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*

  //hide Join button

  var BASE_URL = "https://engage.marketo.com";
  var MUNCHKIN_ID = "360-KCI-804";
  var resourceLocation = ".chrono-box";
  var resourceWatch = 'main .section .chrono-box';
  let mczFrm_mkto_testing_loader = () => {
    let cssFast = `
   button[daa-ll="Join the event-1--"] {
     visibility: hidden !important;
     opacity: 0 !important;
   }
   `;
    let cssLinkFast = document.createElement("style");
    cssLinkFast.innerHTML = cssFast;
    document.head.appendChild(cssLinkFast);

    let formID = 3131;
    let resourceFormHTML = `
   <div class="marketo show-warnings">
   <section class="marketo-form-wrapper">
   <span id="mktoForms2BaseStyle" style="display:none;"></span>
   <span id="mktoForms2ThemeStyle" style="display:none;"></span>
     <form id="mktoForm_${formID}" class="hide-errors show-warnings" style="opacity:0;visibility:hidden;"></form>
   </section>
   </div>
   `;

    const marketoCSSresource = "https://business.adobe.com/libs/blocks/marketo/marketo.css";

    let marketoConfiguratorLink =
      "eyJmb3JtLnRlbXBsYXRlIjoicmVxdWVzdF9mb3JfaW5mb3JtYXRpb24iLCJmb3JtLnN1YnR5cGUiOiJyZXF1ZXN0X2Zvcl9pbmZvcm1hdGlvbiIsInByb2dyYW0uY2FtcGFpZ25pZHMuc2ZkYyI6IjcwMTE0MDAwMDAyWFl2SUFBVyIsInByb2dyYW0ucG9pIjoiTUFSS0VUT0VOR0FHRU1FTlRQTEFURk9STSIsImZvcm0uc3VjY2Vzcy5jb250ZW50IjoiaHR0cHM6Ly9idXNpbmVzcy5hZG9iZS5jb20vcmVzb3VyY2VzL2Vib29rcy9wcm92aW5nLXRoZS1pbXBhY3Qtb2YtbWFya2V0aW5nLW9uLXJldmVudWUvdGhhbmsteW91Lmh0bWwiLCJmb3JtLnN1Y2Nlc3MudHlwZSI6IiIsInByb2dyYW0uY29udGVudC50eXBlIjoiIiwicHJvZ3JhbS5jb250ZW50LmlkIjoiIiwiZmllbGRfdmlzaWJpbGl0eS5uYW1lIjoicmVxdWlyZWQiLCJmaWVsZF92aXNpYmlsaXR5LnBob25lIjoicmVxdWlyZWQiLCJmaWVsZF92aXNpYmlsaXR5LmNvbXBhbnkiOiJyZXF1aXJlZCIsImZpZWxkX3Zpc2liaWxpdHkud2Vic2l0ZSI6InJlcXVpcmVkIiwiZmllbGRfZmlsdGVycy5mdW5jdGlvbmFsX2FyZWEiOiJGdW5jdGlvbmFsIEFyZWEtRFgiLCJmaWVsZF92aXNpYmlsaXR5LnN0YXRlIjoicmVxdWlyZWQiLCJmaWVsZF92aXNpYmlsaXR5LnBvc3Rjb2RlIjoicmVxdWlyZWQiLCJmaWVsZF92aXNpYmlsaXR5LmNvbXBhbnlfc2l6ZSI6InJlcXVpcmVkIiwiZmllbGRfZmlsdGVycy5wcm9kdWN0cyI6ImhpZGRlbiIsImZpZWxkX2ZpbHRlcnMuaW5kdXN0cnkiOiJoaWRkZW4iLCJmaWVsZF9maWx0ZXJzLmpvYl9yb2xlIjoiYWxsIiwiZmllbGRfdmlzaWJpbGl0eS5jb21tZW50cyI6ImhpZGRlbiIsImZpZWxkX3Zpc2liaWxpdHkuZGVtbyI6ImhpZGRlbiIsInByb2dyYW0uY29wYXJ0bmVybmFtZXMiOiIiLCJwcm9ncmFtLmNhbXBhaWduaWRzLmV4dGVybmFsIjoiIiwicHJvZ3JhbS5jYW1wYWlnbmlkcy5yZXRvdWNoIjoiIiwicHJvZ3JhbS5jYW1wYWlnbmlkcy5vbnNpdGUiOiIiLCJwcm9ncmFtLmFkZGl0aW9uYWxfZm9ybV9pZCI6IiIsImZvcm0gaWQiOiIxNzIzIiwibWFya2V0byBtdW5ja2luIjoiMzYwLUtDSS04MDQiLCJtYXJrZXRvIGhvc3QiOiJlbmdhZ2UuYWRvYmUuY29tIiwiZm9ybSB0eXBlIjoibWFya2V0b19mb3JtIn0";
    let marketoConfiguratorHTML = `
   <div class="marketo">
     <div>
       <div><a href="https://milo.adobe.com/tools/marketo#=${marketoConfiguratorLink}">Marketo Configurator</a></div>
     </div>
     <div>
       <div>Marketo Configurator</div>
     </div>
   </div>
   `;

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = marketoCSSresource;
    document.head.appendChild(cssLink);

    let marketoConfiguratorJSON = {};
    try {
      marketoConfiguratorJSON = JSON.parse(
        decodeURIComponent(escape(window.atob(marketoConfiguratorLink)))
      );
    } catch (e) {
      console.error("Error parsing Marketo Configurator JSON", e);
    }

    let use_marketoConfiguratorLink = false;

    let mcz_marketoForm_pref_local = {
      sync_profiles: {},
      "marketo munckin": "360-KCI-804",
      "marketo host": "engage.adobe.com",
      "form id": "3131",
      form: {
        template: "flex_event",
        success: {
          type: "adobe_connect",
          content: "https://livekitqe.dev.adobeconnect.com/paxlkm0gwsj4",
          delay: 5000,
          confirm: false,
        },
        baseSite: "https://business.adobe.com",
        id: 3131,
      },
      program: {
        campaignids: {
          sfdc: "7015Y000004BWOnQAO",
          external: "",
          retouch: "",
          onsite: "",
          cgen: "",
          cuid: "",
        },
        poi: "MARKETOENGAGEMENTPLATFORM",
        additional_form_id: "",
        copartnernames: "",
        marketo_asset: {
          name: "",
          id: "",
        },
        event: {
          type: "adobe_connect", //connect_recording or video
          subtype: "flex_event",
          id: "mcz114328",
          status: {
            viewport: {
              width: 1024,
              height: 768,
              active: true,
              audio: true,
            },
            activity: {
              start: "2025-06-07-10:00",
              end: "2025-06-07-10:00",
              duration_ticks: 1000,
              active_ticks: 1000,
              log: [
                {
                  type: "adobe_connect",
                  subtype: "flex_event",
                  id: "ACTEST4242",
                },
              ],
            },
            activities: [],
          },
        },
        status: {
          label: "invited",
          milestone: "responded",
          is: "1001",
          dateTime: "2025-06-07-10:00",
        },
        status_previous: {
          label: "invited",
          milestone: "responded",
          is: "1001",
          dateTime: "2025-06-07-10:00",
        },
      },
      field_visibility: {
        name: "required",
        phone: "hidden",
        company: "visible",
        website: "hidden",
        state: "hidden",
        postcode: "hidden",
      },
      field_filters: {
        functional_area: "Functional Area-DX",
        products: "hidden",
        industry: "hidden",
        job_role: "hidden",
        comments: "hidden",
        demo: "hidden",
      },
    };

    if (use_marketoConfiguratorLink) {
      for (let key in marketoConfiguratorJSON) {
        let keyArray = key.split(".");
        let obj = mcz_marketoForm_pref_local;
        for (let i = 0; i < keyArray.length - 1; i++) {
          if (!obj[keyArray[i]]) {
            obj[keyArray[i]] = {};
          }
          obj = obj[keyArray[i]];
        }
        obj[keyArray[keyArray.length - 1]] = marketoConfiguratorJSON[key];
      }
    }

    if (!window.location.search.includes("preview=1")) {
      history.pushState({}, "", `${window.location.pathname}?preview=1`);
    }

    window.mcz_marketoForm_pref = JSON.parse(JSON.stringify(mcz_marketoForm_pref_local));

    var loadScript = (url, type, { mode } = {}) =>
      new Promise((resolve, reject) => {
        let script = document.querySelector(`head > script[src="${url}"]`);
        if (!script) {
          const { head } = document;
          script = document.createElement("script");
          script.setAttribute("src", url);
          if (type) {
            script.setAttribute("type", type);
          }
          if (["async", "defer"].includes(mode)) script.setAttribute(mode, true);
          head.append(script);
        }

        if (script.dataset.loaded) {
          resolve(script);
          return;
        }

        const onScript = (event) => {
          script.removeEventListener("load", onScript);
          script.removeEventListener("error", onScript);

          if (event.type === "error") {
            reject(new Error(`error loading script: ${script.src}`));
          } else if (event.type === "load") {
            script.dataset.loaded = true;
            resolve(script);
          }
        };

        script.addEventListener("load", onScript);
        script.addEventListener("error", onScript);
      });

    const resourceForm = document.createElement("div");
    resourceForm.innerHTML = resourceFormHTML;
    if (document.querySelector(resourceLocation)) {
      document.querySelector(resourceLocation).appendChild(resourceForm);
    } else {
      console.log("resourceLocation not found", resourceLocation);
    }

    loadScript(`${BASE_URL}/js/forms2/js/forms2.min.js`)
      .then(() => {
        const { MktoForms2 } = window;
        if (!MktoForms2) throw new Error("Marketo forms not loaded");

        MktoForms2.loadForm(`${BASE_URL}`, MUNCHKIN_ID, formID);
        MktoForms2.whenReady((form) => {
          console.log("Marketo Form Thinks it's Ready", form);
        });
      })
      .catch(() => {
        console.error("Error loading Marketo form");
      });

    window.addMunchkin = async function (
      munchkinId = "360-KCI-804",
      pageFromEventId = "",
      mktToken = ""
    ) {
      loadScript(`https://munchkin.marketo.net/munchkin.js`)
        .then(() => {
          Munchkin.init(munchkinId, {
            customName: `Testing BACOM Connect UX ${pageFromEventId}`,
            mkt_tok: mktToken,
          });
        })
        .catch(() => {
          console.error("Error loading Munchkin.js");
        });
    };

    mczFrm_createProgramSyncIframe();
  };

  window.mcz_marketoForm_adobe_connect_event = (event_url = "") => {
    let final_url = "";
    if (event_url != "") {
      final_url = event_url.trim();
    }

    if (document.querySelector(".marketo-form-wrapper")) {
      document.querySelector(".marketo-form-wrapper").classList.add("hide");
    }
    if (document.querySelector('.adobe-connect button[daa-ll*="Join"]')) {
      document.querySelector('.adobe-connect button[daa-ll*="Join"]').click();
    }
    console.log("adobe_connect_event", final_url);
    mczFrm_sendMessage("reg_submitted", "root.program_profile");
    
    const resource = document.querySelector(resourceWatch);
    if (resource) {
      resource.setAttribute('data-mcz-dl-status', 'active');
    } else {
      console.log('resourceWatch not found', resourceWatch);
    }
  };

  //
  //
  //
  //
  //
  //

  function mczFrm_getTimeUntil(targetDate, nowDate) {
    const timeUntil = targetDate - nowDate;

    if (timeUntil <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, timeUntil };
    }

    const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, timeUntil };
  }

  function mczFrm_currentMarketoTime() {
    let serverTimeOffset;
    let serverTimeRaw = mcz_marketoForm_pref?.program?.marketo_asset?.time?.systemDateTime || null;
    try {
      if (serverTimeRaw) {
        let serverTimeInitial = new Date(serverTimeRaw).getTime();
        if (!isNaN(serverTimeInitial)) {
          let clientTimeInitial = new Date().getTime();
          serverTimeOffset = serverTimeInitial - clientTimeInitial;
        }
      } else {
        serverTimeOffset = 0;
      }
    } catch (e) {
      console.warn("Error getting server time offset", e);
      serverTimeOffset = 0;
    }
    if (typeof serverTimeOffset === "undefined") {
      return new Date();
    }
    return new Date(new Date().getTime() + serverTimeOffset);
  }

  var timeUntilInterval = null;
  function mczFrm_updateTimeUntil() {
    let base = window?.mcz_marketoForm_pref || {};
    let endDateTime = base?.program?.event?.dateTime?.pst?.dateTimeEnd || null;
    let startDateTime = base?.program?.event?.dateTime?.pst?.dateTimeStart || null;
    let nowDateTime = mczFrm_currentMarketoTime();
    let general_status = "pending";
    if (endDateTime == null || startDateTime == null || nowDateTime == null) {
      console.warn("No end or now date time found for this event");
      return null;
    }

    let adobe_connect_status = base?.program?.event?.adobe_connect?.status || null;

    if (adobe_connect_status == null) {
      adobe_connect_status = {};
    }

    let endDate = new Date(endDateTime);
    let startDate = new Date(startDateTime);
    let nowDate = new Date(nowDateTime);
    let timeUntilEnds = mczFrm_getTimeUntil(endDate, nowDate);
    let timeUntilStart = mczFrm_getTimeUntil(startDate, nowDate);

    let stillReview = true;

    // Reset status flags
    adobe_connect_status.is_starting_soon = false;
    adobe_connect_status.is_starting_in_5_minutes = false;
    adobe_connect_status.is_starting_in_1_minute = false;
    adobe_connect_status.is_halfway_through = false;
    adobe_connect_status.about_to_end = false;
    adobe_connect_status.has_ended = false;
    adobe_connect_status.has_finished = false;
    adobe_connect_status.can_enter = false;
    adobe_connect_status.can_attend = false;
    adobe_connect_status.can_register = false;
    adobe_connect_status.has_started = false;
    adobe_connect_status.is_reg_open = false;
    adobe_connect_status.is_reg_closed = false;
    general_status = "register";

    if (timeUntilInterval) {
      clearInterval(timeUntilInterval);
    }

    // Set timing status flags based on time until start
    if (timeUntilStart.timeUntil > 0 && stillReview) {
      if (timeUntilStart.minutes <= 10) {
        adobe_connect_status.is_starting_soon = true;
      }
      if (timeUntilStart.minutes <= 5) {
        adobe_connect_status.is_starting_in_5_minutes = true;
      }
      if (timeUntilStart.minutes <= 1) {
        adobe_connect_status.is_starting_in_1_minute = true;
      }
    }

    let duration = mczFrm_getTimeUntil(endDate, startDate);
    base.program.event.dateTime.duration = duration;

    let remaining = mczFrm_getTimeUntil(endDate, nowDate);
    base.program.event.dateTime.remaining = remaining;

    // Calculate halfway point using total milliseconds for accuracy
    if (duration?.timeUntil > 0 && stillReview) {
      let half_duration_ms = duration.timeUntil / 2;
      if (remaining?.timeUntil <= half_duration_ms && remaining?.timeUntil > 0) {
        adobe_connect_status.is_halfway_through = true;
      }
    }

    // Check if event is about to end
    if (remaining?.timeUntil > 0 && remaining.minutes <= 10 && stillReview) {
      adobe_connect_status.about_to_end = true;
    }

    //check if finished
    if (
      adobe_connect_status.has_started &&
      remaining?.timeUntil > 0 &&
      remaining.minutes <= 2 &&
      stillReview
    ) {
      adobe_connect_status.has_ended = true;
      adobe_connect_status.has_finished = true;
      adobe_connect_status.is_reg_open = false;
      adobe_connect_status.is_reg_closed = true;
      adobe_connect_status.can_enter = false;
      adobe_connect_status.can_attend = false;
      adobe_connect_status.can_register = false;
      adobe_connect_status.has_started = true;
      general_status = "finished";
      stillReview = false;
    }

    //open_minutes and close_minutes
    let open_minutes = base?.program?.event?.dateTime?.pst?.open_minutes || 10; //you can join 10 minutes before the event starts
    let close_minutes = base?.program?.event?.dateTime?.pst?.close_minutes || 999; //you can join 999 minutes after the event starts

    //workout if the event is open or closed
    let doorsOpen = false;
    if (timeUntilStart?.minutes > 0 && stillReview) {
      if (timeUntilStart?.minutes <= open_minutes) {
        doorsOpen = true;
        adobe_connect_status.can_enter = true;
        adobe_connect_status.can_attend = true;
        adobe_connect_status.can_register = true;
        adobe_connect_status.has_started = true;
        adobe_connect_status.has_ended = false;
        adobe_connect_status.is_reg_open = true;
        adobe_connect_status.is_reg_closed = false;
        general_status = "live";
        stillReview = false;
      }
    }
    if (doorsOpen) {
      if (duration?.minutes >= close_minutes && stillReview) {
        doorsOpen = false;
        adobe_connect_status.can_enter = false;
        adobe_connect_status.can_attend = false;
        adobe_connect_status.can_register = false;
        adobe_connect_status.has_started = true;
        adobe_connect_status.is_reg_open = false;
        adobe_connect_status.is_reg_closed = true;
        general_status = "live";
        stillReview = false;
      }
    }

    base.program.event.dateTime.timeUntil = {
      starts: timeUntilStart,
      ends: timeUntilEnds,
    };
    adobe_connect_status.overall = general_status;
    base.program.event.status = general_status;
    base.program.event.id = window?.programId || null;

    console.log("timeUntilStart", timeUntilStart);

    if (timeUntilStart.minutes <= 30) {
      if (!timeUntilInterval) {
        timeUntilInterval = setInterval(mczFrm_updateTimeUntil, 1000);
      }
    } else {
      if (timeUntilInterval) {
        clearInterval(timeUntilInterval);
        timeUntilInterval = null;
      }
    }
  }

  function mczFrm_ACE_confirmURL(url_name = "", url = "") {
    try {
      let confirmLocation =
        window.mcz_marketoForm_pref?.program?.event?.adobe_connect?.urls?.[url_name] || null;
      if (confirmLocation == null) {
        return false;
      }

      let current_status = confirmLocation?.valid_url || false;
      if (current_status) {
        return true;
      }

      if (url.trim() == "") {
        //get the url from the config and we will validate it.
        url = confirmLocation.url || "";
        if (url.trim() == "") {
          return false;
        }
      }

      confirmLocation.url = url;

      try {
        confirmLocation.url_obj = new URL(url);
        confirmLocation.valid_url = true;
      } catch (e) {
        confirmLocation.valid_url = false;
        confirmLocation.url_obj = {};
        confirmLocation.url = "";
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  //*
  //*
  //*
  //* Communication frunctions
  //*
  async function mczFrm_createProgramSyncIframe() {
    let mktToken = window.getMktToken;
    let pageFromEventId = mcz_marketoForm_pref.program.event.id || "";
    if (pageFromEventId == "") {
      console.log("No event id found, skipping profile sync iframe.");
      return;
    }

    let munchkinId = MUNCHKIN_ID || "360-KCI-804";
    addMunchkin(munchkinId, pageFromEventId, mktToken);
    let programIDOnly = pageFromEventId.replace(/[^0-9]/g, "");
    let programfromStorage = await mczFrm_aquireFromStorage(`ev__${programIDOnly}`);
    if (programfromStorage) {
      console.log("MCZ Form, Updating DL from storage:", programfromStorage);
      mczFrm_updateDL(programfromStorage);
    }

    let baseURL = `https://engage.adobe.com/${pageFromEventId}.html`;
    if (mktToken) {
      baseURL = `${baseURL}?mkt_tok=${mktToken}`;
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-scripts allow-same-origin";
    iframe.src = baseURL;
    iframe.style.display = "none";
    iframe.id = "mcz-marketo-program-iframe";
    document.body.appendChild(iframe);
    console.log("Profile sync iframe added with URL:", iframe.src);
  }

  function mczFrm_aquireFromStorage(lookupKey = null) {
    const now = new Date().getTime();

    let itemStr = null;
    itemStr = sessionStorage.getItem(lookupKey);
    if (!itemStr) {
      itemStr = localStorage.getItem(lookupKey);
    }
    if (!itemStr) {
      return null;
    }

    try {
      const item = JSON.parse(itemStr);
      const shelfLife = item?.shelf_life || 0;
      const timestamp = item?.timestamp || 0;
      const expires = item?.expires || 0;

      if (now - timestamp > shelfLife || now > expires) {
        sessionStorage.removeItem(lookupKey);
        localStorage.removeItem(lookupKey);
        console.log(`MCZ RefData: Expired program removed from ${lookupKey}`);
        return null;
      }
      return item;
    } catch (e) {
      return null;
    }
  }

  async function mczFrm_saveRefs(baseAlias = null, refStorageKey = null) {
    if (!refStorageKey) {
      console.warn("No reference storage key found");
      return;
    }

    let existingRefs = [];
    let newRefs = [];
    try {
      existingRefs = JSON.parse(localStorage.getItem(refStorageKey) || "[]");
    } catch (e) {
      console.warn("Error parsing refStorage", e);
      existingRefs = [];
    }

    const dataProfileKeys = existingRefs || [];
    const now = new Date().getTime();

    for (let key of dataProfileKeys) {
      const lookupKey = key;
      let itemStr = null;
      itemStr = sessionStorage.getItem(lookupKey);
      if (!itemStr) {
        itemStr = localStorage.getItem(lookupKey);
      }
      if (!itemStr) {
        continue;
      }

      try {
        const item = JSON.parse(itemStr);
        const shelfLife = item?.shelf_life || 0;
        const timestamp = item?.timestamp || 0;
        const expires = item?.expires || 0;

        if (now - timestamp > shelfLife || now > expires) {
          sessionStorage.removeItem(lookupKey);
          localStorage.removeItem(lookupKey);
          console.log(`MCZ RefData: Expired ref removed from ${lookupKey}`);
        } else {
          newRefs.push(lookupKey);
        }
      } catch (e) {
        console.warn(`Error parsing dataProfile for key: ${lookupKey}`, e);
        sessionStorage.removeItem(lookupKey);
        localStorage.removeItem(lookupKey);
      }
    }

    if (
      baseAlias != null &&
      newRefs.indexOf(baseAlias) == -1 &&
      existingRefs.indexOf(baseAlias) == -1
    ) {
      newRefs.push(baseAlias);
    }

    localStorage.setItem(refStorageKey, JSON.stringify(newRefs));
    console.log("MCZ RefData: Updated refs in refStorage", newRefs);
  }

  async function mczFrm_saveMsg(message) {
    try {
      const saveAlias = message?.alias || null;
      const refStorageKey = message?.refStorage || null;
      const location = message?.location || "local";
      const dataStr = JSON.stringify(message);
      const sizeInBytes = new Blob([dataStr]).size;
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 2) {
        console.warn(`MCZ RefData: Large data size (${sizeInMB.toFixed(2)}MB)`);
      }
      if (!saveAlias) {
        console.warn("No save alias found");
        return;
      }

      if (location == "session") {
        sessionStorage.setItem(saveAlias, dataStr);
      } else {
        localStorage.setItem(saveAlias, dataStr);
      }

      mczFrm_saveRefs(saveAlias, refStorageKey);
    } catch (storageError) {
      console.warn("Storage error:", storageError);
    }
  }

  window.addEventListener("message", (event) => {
    let config = {
      allowedOrigins: ["https://engage.adobe.com", "https://business.adobe.com"],
    };
    let eventOrigin = new URL(event.origin);
    let allowedToPass = false;
    for (let i = 0; i < config.allowedOrigins.length; i++) {
      let allowedOriginURL = new URL(config.allowedOrigins[i]);
      if (
        eventOrigin.host === allowedOriginURL.host &&
        eventOrigin.protocol === allowedOriginURL.protocol &&
        eventOrigin.port === allowedOriginURL.port
      ) {
        allowedToPass = true;
        break;
      }
    }
    if (event.data && event?.data?.type !== "mcz_marketoForm_pref_sync") {
      allowedToPass = false;
    }
    if (!allowedToPass) {
      return;
    }
    console.log("MCZ RefData Received:", event.data);
    if (event.data && event?.data?.target_path !== null && event?.data?.target_attribute !== null) {
      let save = event?.data?.save || false;
      mczFrm_updateDL(event?.data);
      if (save) {
        mczFrm_saveMsg(event?.data);
      }
    }
  });

  function mczFrm_updateDL(data = null) {
    if (data == null) {
      return;
    }
    let targetPath = data?.target_path || null;
    if (targetPath == null) {
      return;
    }
    let program_type = data?.data?.program?.type || "default";
    let program_status = "default";

    let this_data = JSON.parse(JSON.stringify(data?.data));
    if (targetPath == "root.program_profile") {
      window.mcz_marketoForm_pref.program_profile = this_data;
    } else if (targetPath == "root.profile") {
      window.mcz_marketoForm_pref.profile = this_data;
    } else if (targetPath == "root.form") {
      window.mcz_marketoForm_pref.form = this_data;
    } else if (targetPath == "root.profile.acc") {
      window.mcz_marketoForm_pref.profile.acc = this_data;
    } else if (targetPath == "root.program") {
      window.mcz_marketoForm_pref.program = this_data;
      program_type = this_data?.type || "default";
    } else if (targetPath == "root.program.event") {
      window.mcz_marketoForm_pref.program.event = this_data;
      program_type = this_data?.type || "default";
    }

    if (window.mcz_marketoForm_pref?.program?.type == "event") {
      mczFrm_updateTimeUntil();
      if (window.mcz_marketoForm_pref?.program?.event?.type == "adobe_connect") {
        program_type = "adobe_connect";
        program_status =
          window.mcz_marketoForm_pref?.program?.event?.adobe_connect?.status?.overall || "default";
      }
    }

    function mczFrm_statusLbls(program_type = "", program_status = "") {
      if (program_type == "" || program_status == "") {
        console.log("No program type or status found");
        return;
      }

      let dataLabel = "data-mcz-dl-status";
      let elements = document.querySelectorAll(`[${dataLabel}]`);
      let timeNow = new Date().getTime();
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        element.setAttribute(`${dataLabel}-dt`, timeNow);
        element.setAttribute(`${dataLabel}-type`, program_type);
        element.setAttribute(`${dataLabel}`, program_status);
      }
    }

    console.log("Status Labels:", program_type, program_status);

    mczFrm_statusLbls(program_type, program_status);
  }

  function mczFrm_sendMessage(msgName = null, targetPath = "root.program", data = {}) {
    let iframe = document.getElementById("mcz-marketo-program-iframe");
    if (iframe) {
      let message = {
        type: "mcz_marketoForm_pref_sync",
        data: {
          target_path: targetPath,
          data: data,
        },
      };

      iframe.contentWindow.postMessage(message, "https://engage.adobe.com");
    } else {
      console.warn("No iframe found");
    }
  }

  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  //*
  let maxTries = 1000;
  let checkResourceLocation = async () => {
    if (maxTries <= 0) {
      console.log("maxTries reached", maxTries);
      return;
    }
    maxTries--;
    if (document.querySelector(resourceWatch)) {
      mczFrm_mkto_testing_loader();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 25));
      checkResourceLocation();
    }
  };
  checkResourceLocation();
}

// ##
// ##