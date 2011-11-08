function Scope(track, node) {
  this.track = track;
  this.update = function() {
    $(node).empty();
    $(node).append($(document.createElement('span')).addClass('velocity').text(Math.round(this.track.playhead.velocity*2.2369) + "mph"));
    $(node).append($(document.createElement('span')).addClass('elevation').text(this.track.playhead.elevation + "m"));
    $(node).append($(document.createElement('span')).addClass('distance').text(Math.round(this.track.playhead.distance) + "m"));
    $(node).append($(document.createElement('span')).addClass('distance').text(this.track.playhead.slope));
  }
}