(function(){
  var map;
  var nextMarkerNumber = 1;
  var catImg = '<img src="http://thecatapi.com/api/images/get?format=src&type=png&size=small">';

  function init() {
    // create a new map with no base layer
    map = new L.Map("map", {
      center: new L.LatLng(42.3964631, -71.1205171),
      zoom: 16
    });

    // use Stamen's 'terrain' base layer
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);

    // add a marker at the center of the map
    addMarker([42.3964631, -71.1205171]);

    // add a marker when the map is clicked
    map.on('singleclick', onClick);
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

  document.addEventListener('DOMContentLoaded', init);
})();
