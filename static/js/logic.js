    
// adding tile layer/map
var streetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var darkmap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap, 
    "Darkmap":darkmap
  };

var earthquake_data = new L.LayerGroup()
  // Create an overlayMaps object to hold the bikeStations layer.
  var overlayMaps = {
    "Earthquakes": earthquake_data,  
    "Tectonic Plates": earthquake_data, 
  };

  // Create the map object with options.
  var map = L.map("map", {
    center: [34.043087, -118.267616],
    zoom: 2,
    layers: [streetmap, earthquake_data]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
// var streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

// grabbing the data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create object for mapstyle
var mapStyle = {

        color: 'black',
        fillColor: 'red',
        fillopactity: 0.4,
        weight: 1.2
}

function buildRadius (depth){
    if (depth == 0) {
        return 1;
    } else {
        return depth * 2;
    }
}

function selColour (mag) {
    if (mag > 6) {
        return 'black'
    } else {
        return 'red'
    }
    
}

function buildStyle(feature) {
    console.log(feature)
    return {
        color: 'black',
        fillColor: selColour(feature.properties.mag),
        fillopactity: 0.4,
        radius: buildRadius(feature.geometry.coordinates[2]),
        weight: 1.2
    }
}

// create a function to pick color based on borough
// read in the data
d3.json(link).then(function(data) {
    L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style : buildStyle
}).addTo(earthquake_data)
});

// added legend
var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"];

    // Loop through our intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + colors[i]
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // We add our legend to the map.
  legend.addTo(map);

