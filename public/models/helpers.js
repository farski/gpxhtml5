var velocityFromGoogleLatLngPair = function(s, e) {
  if (e) {
    var start = new LatLon(s.lat(), s.lng());
    var end = new LatLon(e.lat(), e.lng());
    var d = (end.distanceTo(start) * -1000);
    var t = (e.time - s.time) / 1000;
    return (d / t);    
  } else { return 0; }
}

var distanceFromGoogleLatLngPair = function(s, e) {
  if (e) {
    var start = new LatLon(s.lat(), s.lng());
    var end = new LatLon(e.lat(), e.lng());
    return (end.distanceTo(start) * 1000); 
  } else { return 0; }
}

var chronoFromSeconds = function(seconds) {
  var t = new Date(seconds * 1000);
  return t.getUTCHours() + ":" + t.getUTCMinutes() + ":" + t.getUTCSeconds();
}