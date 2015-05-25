// create a new map with no base layer
var map = new L.Map("map", {
  center: new L.LatLng(42.3964631, -71.1205171),
  zoom: 16
});

// use Stamen's 'terrain' base layer
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);