//Note to self: latitude is N-S, longitude i E-W


// Convert percentage into hexadecimal greyscale color
function Shade(pct) {
	pct = 1 - pct
	var rgbComponent = Math.round(255 * pct)
	var hexComponent
	if (rgbComponent < 16 ){
		hexComponent = "0" + rgbComponent.toString(16)
	} else {
		hexComponent = rgbComponent.toString(16)
	}
	var hex = "#" + hexComponent + hexComponent + hexComponent
	return hex
}

// Get User Inputs
var inputloc = prompt("Please enter coordinates (default is Lighthouse Roasters in Fremont):", "47.659064, -122.354199");
var scale = prompt("Please input scale: (1 corresponds to the length of one block N-S)", 1);
var loc = inputloc.split(", ");


// Defaults
var radius = 10;
var resolutionWidth = 0.001265; // Fremont city block length North-South

// Stage Grid
var step = resolutionWidth * scale;
var sampleSize = ( 2 * radius + 1 ) ** 2;
var anchorLocation = {
	lat: parseFloat(loc[0]), 
	lng: parseFloat(loc[1])
};
var topLeftLocation = {
	lat: anchorLocation.lat + radius * step, 
	lng: anchorLocation.lng - radius * step
};
var inputLocations = [];
for ( var i = 0; i < 2 * radius + 1; i++) {
	for (var j = 0; j < 2 * radius + 1; j ++){
		inputLocations.push({
				lat: topLeftLocation.lat - step * i , 
				lng: topLeftLocation.lng + step * j, 
		})
	}
}


var topLeftLocation2 = {
	lat: anchorLocation.lat + radius * step - (2 * radius + 1)*step, 
	lng: anchorLocation.lng - radius * step
};
var inputLocations2 = [];
for ( var i = 0; i < 2 * radius + 1; i++) {
	for (var j = 0; j < 2 * radius + 1; j ++){
		inputLocations2.push({
				lat: topLeftLocation2.lat - step * i , 
				lng: topLeftLocation2.lng + step * j, 
		})
	}
}


container = document.getElementById('container');

var elevations = [];
var vertices = [];

var elevations2 = [];
var vertices2 = [];

function initMap() {
	var elevator = new google.maps.ElevationService;
	elevator.getElevationForLocations({'locations': inputLocations}, function(results, status) {
		if (status === 'OK') {

			//Create elevation table, set negative elevations to -1.
			for (var i = 0; i < sampleSize; i++){
				elevations.push(Math.max(results[i].elevation,-1))
				vertices.push([inputLocations[i].lng,inputLocations[i].lat,elevations[i]])
				container.innerHTML += "<div class='cell' id='cell" + i +"''>"+Math.round(elevations[i])+"</div>";
			}

			// Shade cells by elevation
			maxElv = Math.max.apply(null, elevations)
			minElv = Math.min.apply(null, elevations)
			for (var i = 0; i < sampleSize; i++){
				document.getElementById('cell' + i).style.background = Shade( (elevations[i] - minElv) / (maxElv - minElv))
			}
			document.getElementById('cell'+(sampleSize-1)/2).style.color = '#ccffff';

			// Load THREEJS model
			loadScene()

		} else {
			console.log("Elevation service failed due to: " + status);
		}
	});


	elevator.getElevationForLocations({'locations': inputLocations2}, function(results, status) {
		if (status === 'OK') {

			//Create elevation table, set negative elevations to -1.
			for (var i = 0; i < sampleSize; i++){
				elevations2.push(Math.max(results[i].elevation,-1))
				vertices2.push([inputLocations[i].lng,inputLocations[i].lat,elevations2[i]])
				container.innerHTML += "<div class='cell' id='cell" + sampleSize + i +"''>"+Math.round(elevations2[i])+"</div>";
			}

			// Shade cells by elevation
			maxElv = Math.max.apply(null, elevations2)
			minElv = Math.min.apply(null, elevations2)
			for (var i = 0; i < sampleSize; i++){
				document.getElementById('cell' + sampleSize + i).style.background = Shade( (elevations2[i] - minElv) / (maxElv - minElv))
			}
			document.getElementById('cell'+ sampleSize+ (sampleSize-1)/2).style.color = '#ccffff';

			// Load THREEJS model
			//loadScene()

		} else {
			console.log("Elevation service failed due to: " + status);
		}
	});
}
	