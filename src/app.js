(function(){
  var map;
  var nextMarkerNumber = 1;
  var catImg = '<img src="http://thecatapi.com/api/images/get?format=src&type=png&size=small">';
  var isDrawing = false;
  var polygons = {};
  var nextPolygonId = 0;
  var markers = [];
  var colors = ['green', 'red', 'blue', 'orange', 'black', 'yellow'];

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

    map.on('editable:drawing:start', onDrawingStart);
    map.on('editable:drawing:end', onDrawingEnd);
    map.on('editable:vertex:dragend', assignContainedPoints);
    map.on('editable:drawing:click', assignContainedPoints);
  }

  /**
   * add a marker with a popup at the specified coordinates
   */
  function addMarker(coords) {
    var marker = L.marker(coords);
    marker.bindPopup('<h3>I\'m #' + nextMarkerNumber++ + '</h3>' + catImg);
    marker.addTo(map);
    markers.push(marker);
    for (var k in polygons) {
      if (polygons.hasOwnProperty(k)) {
        markContainedPoints([marker], polygons[k]);
      }
    }
  }

  function onClick(e) {
    addMarker(e.latlng);
  }

  function onDrawingStart(e) {
    isDrawing = true;
    util.getById('toggleDrawing').innerText = 'Stop Drawing';
    var polygon = e.layer;
    polygon.polygonId = nextPolygonId++;
    polygons[polygon.polygonId] = polygon;
  }

  function assignContainedPoints() {
    var markersCopy = [];
    for (var i = 0; i < markers.length; i++) {
      markersCopy.push(markers[i]);
    }
    for (var k in polygons) {
      if (polygons.hasOwnProperty(k)) {
        markContainedPoints(markersCopy, polygons[k]); 
      }
    }
    markersCopy.forEach(function(m) {
      m._icon.style.backgroundColor = 'transparent';
    });
  }

  function markContainedPoints(markers, poly) {
    var id = poly.polygonId;
    for(var i = 0; i < markers.length; i++) {
      var m = markers[i];
      var point = m.getLatLng();
      point = [point.lng, point.lat];
      if (turf.inside(turf.point(point), poly.toGeoJSON())) {
        m.ownedBy = id;
        m._icon.style.backgroundColor = colors[(id < colors.length? id: colors.length - 1)];
        markers.splice(i, 1);
        i--;
      }
    }
  }

  function onDrawingEnd(e) {
    isDrawing = false;
    util.getById('toggleDrawing').innerText = 'Draw';
  }

  function toggleDrawing() {
    if (isDrawing) {
      map.editTools.stopDrawing();
    } else {
      map.editTools.startPolygon();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
