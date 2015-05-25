(function(){
  var map;

  function init() {
    // create a new map with no base layer
    map = new L.Map("map", {
      center: new L.LatLng(42.3964631, -71.1205171),
      zoom: 16
    });

    // use Stamen's 'terrain' base layer
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);

    addMarker();
  }

  function addMarker() {
    L.marker([42.3964631, -71.1205171]).addTo(map);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
