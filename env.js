var debug = false;

if (debug) {
  var domain = "http://localhost:7001/ydqt/miniprogram";
  var atKey = "access_token";
} else {
  var domain = "https://39.105.93.142:7001/ydqt/miniprogram";
  var atKey = "online_access_token";
}

export default {
    domain,
    atKey
}
