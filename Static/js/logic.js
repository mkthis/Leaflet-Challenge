var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson  '

d3.json(url).then(function (data) {
  
  createFeatures(data.features);
});

function circleRadius(feature) {
 
  return feature.properties.mag <= 0 ? 0: feature.properties.mag * 5;
  
}

function circleColor(depth) {

  return depth <= 5 ? "#33FF76":
          depth <= 10 ? "#33D2FF":
          depth <= 15 ? "#C233FF":
          depth <= 20 ? "#FF33D0":
          depth <= 25 ? "#FF33FF":
                          "#00FFFF";
}

function createFeatures(earthquakeData) {

  function circles(feature, latlng) {
        
    var geojsonMarkerOptions = {
        radius: circleRadius(feature),
        fillColor: circleColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.8
    };

    
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

  function onEachFeature(feature, layer) {
    layer.bindPopup(
        "<h3>Location: " + feature.properties.place + "<br> Magnitude: " + 
        feature.properties.mag +"<br>Depth: " + feature.geometry.coordinates[2] + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
}

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: circles,
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
  
}

function createMap(earthquakes) {

var topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  
  var baseMaps = {
    "Street Map": topo
  };

   
  var overlayMaps = {
    Earthquakes: earthquakes
  };
   
  
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [topo, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
      categories = [2.5, 5, 10, 15, 20, 25],
      labels = [],
      from, to;
    for (var i = 0; i < categories.length; i++) {
      from = categories[i];
      to = categories[i + 1];
      labels.push(
        '<i style="background:' + circleColor(from + 1) + '">Depth (m)</i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(myMap);
}
