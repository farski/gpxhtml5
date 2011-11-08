google.maps.Map.prototype.node = function() { return this.getDiv(); }
google.maps.Map.prototype.latitude = function() { return this.getCenter().lat(); }
google.maps.Map.prototype.longitude = function() { return this.getCenter().lng(); }
