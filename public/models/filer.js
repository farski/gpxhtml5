function Filer(node) {
  this.node = node;
  this.initialize = function() {
    this.node.addEventListener('dragover', this.dragover, false);
    this.node.addEventListener('dragleave', this.dragleave, false);
    this.node.addEventListener('drop', this.drop, false);
  }
  this.dragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).css('border-style', 'solid');
    $(this).text('Drop files here');
  }
  this.dragleave = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).css('border-style', 'dashed');
    $(this).text('Drag files here');
  }
  this.drop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).css('border-style', 'dashed');
    $(this).text('Drag files here');
    jQuery.each(e.dataTransfer.files, function(i, file) {
      var reader = new FileReader();

			// reader.addEventListener('loadend', function(e) {
			// 	var track = new google.maps.Polyline({strokeColor: '#77f'});
			// 	track.xml = (new DOMParser()).parseFromString(e.target.result,"text/xml");
			// 	deck.tracks.push(track);
			// }, false)

      reader.onload = (function(_tracks) {
        return function(e) {
          var track = new google.maps.Polyline({strokeColor: '#77f'});
          track.xml = (new DOMParser()).parseFromString(e.target.result,"text/xml")
          _tracks.push(track);
        };
      })(deck.tracks);

      reader.readAsText(file);
      window.setTimeout(function() {deck.didLoadOrReceiveNewData()}, 20);
    });
  }
}