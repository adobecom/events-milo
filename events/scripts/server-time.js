/** Akamai service time */
const akamaiServerTimePath = 'https://time.akamai.com';

/** set servertime defaults here for reject and resolve cases */
window.northstar = window.northstar || {};
window.northstar.servertime = {};
window.northstar.servertime.enabled = true;
window.northstar.servertime.failed = false;

// Add the param to test servertime
const searchParams = new URLSearchParams(window.location.search);
const possibleDate = parseInt(searchParams.get('servertime'), 10) || 0;
const isServerTimeParam = possibleDate > 0;

if (isServerTimeParam) {
  /** this is the way we are making the response available for State to pick up */
  const epoch = possibleDate;

  window.northstar = window.northstar || {};
  window.northstar.servertime = {
    dateFormat: null,
    epoch,
    currentTime: (function (epoch, pageLandingTime) {
      const timeMachine = function (epoch, pageLandingTime) {
        const epochClosure = epoch;
        const pageLandingTimeClosure = pageLandingTime;

        // Instance stores a reference to the Singleton
        let instance;

        function init(epoch, pageLandingTime) {
          // private
          const initialTime = epoch || Date.now();

          return {
            initialTime,
            getTime() {
              return Date.now() - pageLandingTime + epoch;
            },
          };
        }

        return {
          getInstance() {
            if (!instance) {
              instance = init(epochClosure, pageLandingTimeClosure);
            }
            return instance;
          },
        };
      };
      return timeMachine(epoch, pageLandingTime);
    }(epoch, Date.now())),
  };

  /** notify to state and other components to get servertime */
  window.dispatchEvent(new Event('northstar:serverTime'));
}

if (!isServerTimeParam) {
  /* If Akamai does not responde by 3 secs, terminate request */
  const servertimeTimeoutPromise = new Promise((res, rej) => {
    setTimeout(rej, 3000, 'servertime timeout');
  });

  /* add a race to Servertime Called or a one second timer */
  const raceAkamaiPromises = Promise.race([fetch(akamaiServerTimePath), servertimeTimeoutPromise]);

  raceAkamaiPromises
    .then((res) => {
      /* get reponse headers */
      const dateFromHeaders = res && res.headers && res.headers.get
        ? res.headers.get('Date')
        : null;

      if (dateFromHeaders) {
        const epoch = Date.parse(dateFromHeaders);
        /** this is the way we are making the response avaialbe for State to pick up */
        window.northstar = window.northstar || {};
        window.northstar.servertime = {
          dateFormat: dateFromHeaders,
          epoch,
          currentTime: (function (epoch, pageLandingTime) {
            const timeMachine = function (epoch, pageLandingTime) {
              const epochClosure = epoch;
              const pageLandingTimeClosure = pageLandingTime;

              // Instance stores a reference to the Singleton
              let instance;

              function init(epoch, pageLandingTime) {
                // private
                const initialTime = epoch || Date.now();

                return {
                  initialTime,
                  getTime() {
                    return Date.now() - pageLandingTime + epoch;
                  },
                };
              }

              return {
                getInstance() {
                  if (!instance) {
                    instance = init(epochClosure, pageLandingTimeClosure);
                  }
                  return instance;
                },
              };
            };
            return timeMachine(epoch, pageLandingTime);
          }(epoch, Date.now())),
        };
      }
      /** notify to state and other components to get servertime */
      window.dispatchEvent(new Event('northstar:serverTime'));
    })
    .catch(() => {
      /** notify failure and release state / components from waiting */
      window.northstar.servertime.failed = true;
      window.dispatchEvent(new Event('northstar:serverTime'));
    });
}
