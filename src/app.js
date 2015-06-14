(function(){
  var map;
  var nextMarkerNumber = 1;
  var catImg = '<img src="http://thecatapi.com/api/images/get?format=src&type=png&size=small">';
  var isDrawing = false;
  var isClustered = false;
  var polygons = {};
  var nextPolygonId = 0;
  var markers = [];
  var clusters = [];
  var colors = ["#ff0000", "#a67f53", "#40ff8c", "#004b8c", "#fbbfff", "#bf0000", "#594f43", "#6cd998", "#7c92a6", "#bf00b3", "#400000", "#cc8800", "#004022", "#0066ff", "#731d62", "#ff8080", "#f2c200", "#4d665a", "#1a2433", "#a65395", "#331a1a", "#665200", "#8fbfaf", "#162859", "#73566d", "#a65e53", "#403610", "#238c77", "#7999f2", "#40303a", "#cca099", "#999126", "#00f2e2", "#0022ff", "#f23d9d", "#806460", "#f2ea79", "#003c40", "#6060bf", "#cc99b4", "#ffa280", "#7d8060", "#30b6bf", "#0f0073", "#591631", "#4c3026", "#c3e639", "#00add9", "#a099cc", "#f20041", "#4c1f00", "#414d13", "#006680", "#7033cc", "#cc335c", "#ff8c40", "#d2e6ac", "#303d40", "#210d33", "#804051", "#e6c3ac", "#93bf60", "#0080bf", "#583973", "#73000f", "#995200", "#52cc00", "#004466", "#ca79f2", "#ffc480", "#208039", "#bfeaff", "#cc00ff"];

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
    util.onById('toggleClustering', 'click', toggleClustering);

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
    if (isClustered) {
      var cluster = assignMarkerToCluster(marker);
      if (cluster) {
        updateCluster(cluster);
      }
    }
  }

  function onClick(e) {
    addMarker(e.latlng);
  }

  function onDrawingStart(e) {
    isDrawing = true;
    util.changeTextById('toggleDrawing', 'Stop Drawing');
    var polygon = e.layer;
    polygon.polygonId = nextPolygonId++;
    var id = polygon.polygonId;
    polygon.setStyle({fillColor: colors[(id < colors.length? id: colors.length - 1)]});
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
      m.ownedBy = undefined;
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
        setMarkerColor(m, id);
        markers.splice(i, 1);
        i--;
      }
    }
  }

  function setMarkerColor(marker, id) {
    marker._icon.style.backgroundColor = colors[(id < colors.length? id: colors.length - 1)];
  }
  function onDrawingEnd(e) {
    isDrawing = false;
    util.changeTextById('toggleDrawing', 'Draw');
  }

  function toggleDrawing() {
    if (isDrawing) {
      map.editTools.stopDrawing();
    } else {
      map.editTools.startPolygon();
    }
  }

  function toggleClustering() {
    if (isClustered) {
      markers.forEach(function(m) {
        if (!map.hasLayer(m)) {
          map.addLayer(m);
          setMarkerColor(m, m.ownedBy);
        }
      });
      clusters.forEach(function(c) {
        map.removeLayer(c.marker);
      });
      clusters = [];
      util.changeTextById('toggleClustering', 'Cluster');
      isClustered = false;
    } else {
      markers.forEach(assignMarkerToCluster);
      clusters.forEach(updateCluster);
      isClustered = true;
      util.changeTextById('toggleClustering', 'Uncluster');
    }
  }
  function assignMarkerToCluster(m) {
    if (typeof m.ownedBy !== 'undefined') {
      clusters[m.ownedBy] = clusters[m.ownedBy] || {id: m.ownedBy, marker: null, contained: []};
      clusters[m.ownedBy].contained.push(m);
      map.removeLayer(m);
      return clusters[m.ownedBy];
    }
  }
  function updateCluster(c) {
    var points = turf.featurecollection(c.contained.map(function(m) {
      return turf.point([m._latlng.lng, m._latlng.lat]);
    }));
    var avg = turf.center(points);
    var coords = avg.geometry.coordinates;
    var marker = c.marker || (c.marker = L.marker());
    marker.setLatLng([coords[1], coords[0]]);
    if (!map.hasLayer(marker)) {
      map.addLayer(marker);
    }
    setMarkerColor(marker, c.id);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
