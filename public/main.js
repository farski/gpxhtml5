$(function() {
  deck = new Deck();
  deck.didLoadOrReceiveNewData();

  $('address.map').each(function() {
    var self = this;
    deck.geocoder.geocode({'address': $(this).text()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        var zoom = 13;
        var type = google.maps.MapTypeId.TERRAIN;
        deck.maps.push(new google.maps.Map(self, { center: center, zoom: zoom, mapTypeId: type }));
      }
    });
  });
  
  $('form .filer').each(function() { (new Filer(this)).initialize(); });
  
  $('menu input[type="range"]').change(function(e) {
    e.preventDefault();
    deck.playing = false;
    var duration = deck.duration() * (this.value / 100);
    deck.scrubTo(duration);
  })
  
  $('menu a[href="/play"]').click(function(e) {
    e.preventDefault();
    deck.play();
  });
  
  $('menu a[href="/pause"]').click(function(e) {
    e.preventDefault();
    deck.pause();
  });
  
  $('menu a[href="/rewind"]').click(function(e) {
    e.preventDefault();
    deck.rewind();
  });
});