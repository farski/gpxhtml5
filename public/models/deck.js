function Deck() {
  this.geocoder = new google.maps.Geocoder();
  this.maps = [];
  this.tracks = [];
  this.playbackRate = 100;
  this.swatches = ['red', 'blue', 'yellow', 'green'];
  this.playhead = 0;
  
  this.didLoadOrReceiveNewData = function () {
    if (this.tracks.length == 0) { $('.deck').addClass('empty'); } else {
      $('.deck').removeClass('empty');
      $('.deck #scopes').empty();
      var self = this;
      jQuery.each(this.tracks, function(i, track) {
        var scope = document.createElement('div');
        $('.deck #scopes').append($(scope).attr('id', 'track_' + i));
        track.publishWithScope(self.maps[0], scope);
        track.playheadMarker.setIcon('images/icons/pins/' + (i + 1) + '.png');
        track.setPlayheadByTimeElapsed(self.playhead);
      });
    }
  }
  
  // Return the duration of the longest (timewise) track in the deck
  this.duration = function() { return this.trackWithLongestDuration().duration(); }

  // Playback controls
  this.play = function() { this.playFrom(this.playhead); }
  this.pause = function() { this.playing = false; }
  this.rewind = function() { this.playing = false; this.scrubTo(0); }
  this.unwind = function() { this.playing = false; this.scrubTo(this.duration()); }

  // Play the deck starting a specific offset
  this.playFrom = function(duration) {
    this.scrubTo(duration);
    this.playing = true;
    this._play()
  }
  // Until playback is stopped, scrub to the next time (based on the playback rate) 40 times per second
  this._play = function() {
    var self = this;
    window.setTimeout(function() {
      var delta = (self.playbackRate / (1000 / 25));
      if (self.playing == true && (self.playhead + delta) < self.duration()) {
        self.scrubTo(self.playhead + delta);
        self._play();
      }
    }, 25)
  }
  
  // Move the playhead to a specific time and update all the assets to reflect the change
  this.scrubTo = function(duration) {
    this.playhead = duration;
    this.syncTrackPlayheads();
    this.syncMaps();
    this.syncControls();
  }
  
  // Update assets to match the current playhead
  this.syncTrackPlayheads = function() { var self = this; jQuery.each(this.tracks, function(i, track) { track.setPlayheadByTimeElapsed(self.playhead); }); }
  this.syncMaps = function() { var self = this; jQuery.each(this.maps, function(i, map) { map.setCenter(self.trackWithShortestDuration().playhead); }); }
  this.syncControls = function() {
    var self = this;
    $('.deck menu.playback input[type="range"]').attr('value', (100 * (this.playhead / self.trackWithLongestDuration().duration())));
    $('.deck menu.playback time.playhead').text(chronoFromSeconds(self.playhead));
  }

  // Based on duration, return the shortest and longest tracks in the deck
  this.trackWithShortestDuration = function() {
    var _track = this.tracks[0];
    jQuery.each(this.tracks, function(i, track) { if (track.duration() <= _track.duration()) { _track = track; } });
    return _track;
  }
  this.trackWithLongestDuration = function() {
    var _track = this.tracks[0];
    jQuery.each(this.tracks, function(i, track) { if (track.duration() >= _track.duration()) { _track = track; } });
    return _track;
  }
}
