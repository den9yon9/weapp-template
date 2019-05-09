var debug = true;

if (debug) {
  var domain = "http://localhost:7001/ydqt/miniprogram";
  var atKey = "access_token";
} else {
  var domain = "https://worldisland.vcloud03.freelycode.com";
  var atKey = "online_access_token";
}

export default {
    domain,
    atKey
}
