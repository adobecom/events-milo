// config.js
const CONFIG = {
  ENDPOINTS: {
    local: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    dev: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    dev02: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    stage: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    stage02: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    prod: { host: 'https://www.adobe.com/api2/subscribe_v1' },
  },
  VALIDATION: {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    ERROR_MESSAGES: {
      REQUIRED: 'Required Field',
      INVALID_EMAIL: 'Must be a valid Email address',
      // ...
    },
  },
};

export default CONFIG;
