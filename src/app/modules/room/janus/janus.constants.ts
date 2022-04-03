import adapter from 'webrtc-adapter';

/*eslint-disable */

// global Janus lib variables
(window as any).adapter = adapter;
export const Janus = (window as any).Janus;


export const acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null);

export const vcodec = (getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null);

export const vprofile = (getQueryStringValue("vprofile") !== "" ? getQueryStringValue("vprofile") : null);

export const doOpusred = (getQueryStringValue("opusred") === "yes" || getQueryStringValue("opusred") === "true");

export const doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");

export const doDtx = (getQueryStringValue("dtx") === "yes" || getQueryStringValue("dtx") === "true");

export const doSvc = getQueryStringValue("svc") || null;


// Helper to parse query string
function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
