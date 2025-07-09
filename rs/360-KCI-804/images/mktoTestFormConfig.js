// ##
// ## Test Module - Just a rough test module to set the config of the form.
// ##

if (typeof mkto_testing_loader != "function" && typeof mkto_testing_loader == "undefined") {
  function getMktToken() {
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

  window.getMktToken = getMktToken();

  let resourceLocation = ".adobe-connect";
  let resourceWatch = '.adobe-connect button[daa-ll*="Join"]';
  let mkto_testing_loader = () => {
    //hide Join button

    let cssFast = `
    button[daa-ll="Join the event-1--"] {
      visibility: hidden !important;
      opacity: 0 !important;
    }
    `;
    let cssLinkFast = document.createElement("style");
    cssLinkFast.innerHTML = cssFast;
    document.head.appendChild(cssLinkFast);

    const BASE_URL = "https://engage.marketo.com";
    const MUNCHKIN_ID = "360-KCI-804";

    let formID = 3131;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('formId')) {
      formID = urlParams.get('formId');
    }
    console.log('formID', formID);

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

    let marketoConfiguratorJSON = {};
    try {
      marketoConfiguratorJSON = JSON.parse(
        decodeURIComponent(escape(window.atob(marketoConfiguratorLink)))
      );
    } catch (e) {
      console.error("Error parsing Marketo Configurator JSON", e);
    }

    /*
    Example of marktoConfiguratorJSON:
    {
      "form.template": "request_for_information",
      "form.subtype": "request_for_information",
      "program.campaignids.sfdc": "70114000002XYvIAAW",
      "program.poi": "MARKETOENGAGEMENTPLATFORM",
      "form.success.content": "https://business.adobe.com/resources/ebooks/proving-the-impact-of-marketing-on-revenue/thank-you.html",
      "form.success.type": "",
      "program.content.type": "",
      "program.content.id": "",
      "field_visibility.name": "required",
      "field_visibility.phone": "required",
      "field_visibility.company": "required",
      "field_visibility.website": "required",
      "field_filters.functional_area": "Functional Area-DX",
      "field_visibility.state": "required",
      "field_visibility.postcode": "required",
      "field_visibility.company_size": "required",
      "field_filters.products": "hidden",
      "field_filters.industry": "hidden",
      "field_filters.job_role": "all",
      "field_visibility.comments": "hidden",
      "field_visibility.demo": "hidden",
      "program.copartnernames": "",
      "program.campaignids.external": "",
      "program.campaignids.retouch": "",
      "program.campaignids.onsite": "",
      "program.additional_form_id": "",
    }


    */

    let use_marketoConfiguratorLink = false;

    let mcz_marketoForm_pref_local = {
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
          id: "mczac114328",
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

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = marketoCSSresource;
    document.head.appendChild(cssLink);

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

    function sendRegSubmittedMessage() {
      let iframe = document.getElementById("mcz-marketo-segment-iframe");
      if (iframe) {
        iframe.contentWindow.postMessage({ type: "reg_submitted" }, "https://engage.adobe.com");
      }
    }

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
      sendRegSubmittedMessage();
    };

    function createProfileSyncIframe() {
      let mktToken = getMktToken();
      let pageFromEventId = mcz_marketoForm_pref.program.event.id || "";
      if (pageFromEventId == "") {
        console.log("No event id found, skipping profile sync iframe.");
        return;
      }
      let baseURL = `https://engage.adobe.com/${pageFromEventId}.html`;

      if (mktToken) {
        const iframe = document.createElement("iframe");
        let finalURL = `${baseURL}?mkt_tok=${mktToken}`;

        iframe.sandbox = "allow-scripts allow-same-origin";
        iframe.src = finalURL;
        iframe.style.display = "none";
        iframe.id = "mcz-marketo-segment-iframe";
        document.body.appendChild(iframe);
        console.log("Profile sync iframe added with URL:", iframe.src);
      } else {
        console.log(`No ${storageKey} found, skipping profile sync iframe.`);
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
      if (!allowedToPass) {
        return;
      }
      //segment update
      if (event.data && event.data.type === "profile_acc") {
        console.log("Received profile data from iframe:", event.data);
        if (event.data.mcz_marketoForm_pref) {
          window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || {};
          window.mcz_marketoForm_pref.profile = window.mcz_marketoForm_pref.profile || {};
          window.mcz_marketoForm_pref.profile.acc = event.data.mcz_marketoForm_pref;
        }
      }
      //membership update
      if (event.data && event.data.type === "program_profile") {
        console.log("Received membership data from iframe:", event.data);

        let description = event.data.description || "";
        if (description == "") {
          description = "program_profile";
        }

        if (event.data.mcz_marketoForm_pref) {
          window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || {};
          window.mcz_marketoForm_pref.program_profile =
            window.mcz_marketoForm_pref.program_profile || {};

          let dataLabel = "data-mcz-dl-status";
          let elements = document.querySelectorAll(`[${dataLabel}]`);
          let timeNow = new Date().getTime();
          for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.setAttribute(dataLabel, event.data.mcz_marketoForm_pref.program_profile.status);
            element.setAttribute(`${dataLabel}-dt`, timeNow);
          }
        }
      }
    });

    createProfileSyncIframe();
  };

  window.mkto_testing_loader = mkto_testing_loader;
  let maxTries = 1000;
  let checkResourceLocation = async () => {
    if (maxTries <= 0) {
      console.log("maxTries reached", maxTries);
      return;
    }
    maxTries--;
    if (document.querySelector(resourceWatch)) {
      window.mkto_testing_loader();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 25));
      checkResourceLocation();
    }
  };
  checkResourceLocation();
}

// ##
// ##
