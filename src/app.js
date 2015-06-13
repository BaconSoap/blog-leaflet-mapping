(function(){
  var map;
  var nextMarkerNumber = 1;
  var catImg = '<img src="http://thecatapi.com/api/images/get?format=src&type=png&size=small">';
  var isDrawing = false;

  function init() {
    // create a new map with no base layer
    map = new L.Map("map", {
      center: new L.LatLng(42.3964631, -71.1205171),
      zoom: 16,
      editable: true
    });

    // use Stamen's 'terrain' base layer
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);

    // add a marker at the center of the map
    addMarker([42.3964631, -71.1205171]);

    // add a marker when the map is clicked
    map.on('singleclick', onClick);

    util.onById('toggleDrawing', 'click', toggleDrawing);
  }

  /**
   * add a marker with a popup at the specified coordinates
   */
  function addMarker(coords) {
    var marker = L.marker(coords);
    marker.bindPopup('<h3>I\'m #' + nextMarkerNumber++ + '</h3>' + catImg);
    marker.addTo(map);
  }

  function onClick(e) {
    addMarker(e.latlng);
  }

  function toggleDrawing() {
    if (isDrawing) {
      util.getById('toggleDrawing').innerText = 'Draw';
      map.editTools.stopDrawing();
      isDrawing = false;
    } else {
      util.getById('toggleDrawing').innerText = 'Stop Drawing';
      map.editTools.startPolygon();
      isDrawing = true;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
