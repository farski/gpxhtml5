// Returns google LatLng's for the first and last points in the track
google.maps.Polyline.prototype.head = function() { return this.pointAtIndex(0); }
google.maps.Polyline.prototype.tail = function() { return this.pointAtIndex(this.getPath().getLength() - 1); }

// TODO Returns the total length of the track (in meters?)
google.maps.Polyline.prototype.distance = function() { return this.tail().distance ; }

// Returns the Date for the head and tail
google.maps.Polyline.prototype.starts_at = function() { return this.head().time; }
google.maps.Polyline.prototype.ends_at = function() { return this.tail().time; }

// Returns the total duration of the track in seconds
google.maps.Polyline.prototype.duration = function() { return (this.ends_at() - this.starts_at()) / 1000; }

// Keeps track of which point in the track is the current playhead
// also updates the playhead marker position to match
google.maps.Polyline.prototype.setPlayhead = function(index) {
  this._playhead_index = index;
  this.playhead = this.pointAtIndex(index);
  if (!this.playheadMarker) { this.playheadMarker = new google.maps.Marker(); }
  if (this.scope) { this.scope.update(); }
  this.playheadMarker.setPosition(this.playhead);
}
google.maps.Polyline.prototype.setPlayheadByTimeElapsed = function(duration) { this.setPlayhead(this.pathIndexAfterTimeElapsed(duration)); }

google.maps.Polyline.prototype.pointAtIndex = function(index) { return this.getPath().getAt(index); }
google.maps.Polyline.prototype.pathIndexAfterTimeElapsed = function(duration) {
  var self = this;
  var points = this.getPath();
  // not doing this up front slows things down a LOT
  var track_duration = this.duration();
  
  for (i = 0; i <= points.getLength(); i++) {
    if (duration <= track_duration && points.getAt(i).runningTime >= duration) {
      return i;
      break;
    } else if (duration > track_duration) {
      return points.length - 1;
      break;
    }
  }
}

// Populate the polyline with stored XML data
google.maps.Polyline.prototype.buildFromGpx = function() {
  if (this.xml) {
    var self = this;
    $('gpx trk trkpt', this.xml).each(function(i, point) {
      var latlng = new google.maps.LatLng($(point).attr('lat'), $(point).attr('lon'));
      latlng.time = new Date($('time', point).text());
      latlng.elevation = parseFloat($('ele', point).text());
      if (self.head()) {
        var previous_point = self.getPath().getAt(self.getPath().length - 1);        
        latlng.velocity = velocityFromGoogleLatLngPair(latlng, previous_point);
        latlng.runningTime = (latlng.time - self.starts_at()) / 1000;
        latlng.segment = distanceFromGoogleLatLngPair(latlng, previous_point);
        latlng.distance = previous_point.distance + latlng.segment;
        latlng.slope = ((latlng.elevation - previous_point.elevation) / latlng.segment);
      } else {
        latlng.velocity = 0;
        latlng.distance = 0;
        latlng.segment = 0;
        latlng.slope = 0;
        latlng.runningTime = 0;
      }
      self.getPath().push(latlng);
    });
    this.setPlayhead(0);
  }
}

// Publish the polyline to a google map
// along with the playhead marker
google.maps.Polyline.prototype.publish = function(map) {
  if (this.getPath().getLength() == 0) { this.buildFromGpx(); }
  this.setMap(map);
  this.playheadMarker.setMap(map);
}
google.maps.Polyline.prototype.publishWithScope = function(map, node) {
  this.scope = new Scope(this, node);
  this.publish(map);
}