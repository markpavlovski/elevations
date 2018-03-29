// Get User Inputs
// var inputloc = prompt("Please enter coordinates (default is Lighthouse Roasters in Fremont):", "47.659064, -122.354199");
// var scale = prompt("Please input scale: (1 corresponds to the length of one block N-S)", 1);
// var gridRadius = prompt("Please enger grid radius (0 is equivalent to 1 x 1 tiling, gridRadius of 2 equivalent to 5 x 5 tiling, etc.)",0);

var inputloc = "47.659064, -122.354199"
var scale = 1
var gridRadius = 1
var loc = inputloc.split(", ")
let responseArray = []





//Note to self: latitude is N-S, longitude i E-W

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


// Convert percentage into hexadecimal greyscale color
function Shade(pct) {
  pct = 1 - pct
  var rgbComponent = Math.round(255 * pct)
  var hexComponent
  if (rgbComponent < 16) {
    hexComponent = "0" + rgbComponent.toString(16)
  } else {
    hexComponent = rgbComponent.toString(16)
  }
  var hex = "#" + hexComponent + hexComponent + hexComponent
  return hex
}


// Defaults
var tileRadius = 10;
var tileLength = 2 * tileRadius + 1;
var resolutionWidth = 0.001265; // Fremont city block length North-South
var gridLength = 2 * gridRadius + 1;
var step = resolutionWidth * scale;
var tileSize = tileLength ** 2;
var gridSize = gridLength ** 2;

// Set Up Display
container = document.getElementById('container');
container.style.width = 25 * tileLength * gridLength + "px";
progressBar = document.getElementById('progressBar');
progressBar.style.width = 25 * tileLength * gridLength + "px";

// Stage Request Inputs
var middleTileCenter = {
  lat: parseFloat(loc[0]),
  lng: parseFloat(loc[1])
};

var middleTileTopLeft = {
  lat: middleTileCenter.lat + tileRadius * step,
  lng: middleTileCenter.lng - tileRadius * step
};

var gridTopLeft = {
  lat: middleTileTopLeft.lat + gridRadius * tileLength * step,
  lng: middleTileTopLeft.lng - gridRadius * tileLength * step
};

var tileAnchors = [];
for (var i = 0; i < gridLength; i++) {
  for (var j = 0; j < gridLength; j++) {
    tileAnchors.push({
      lat: gridTopLeft.lat - tileLength * step * i,
      lng: gridTopLeft.lng + tileLength * step * j
    })
  }
}


var multipleResults = []



// Init Map function is the data collection routine

function initMap(inputTopLeft) {


  // first the set of locations is created based on teh input location, then requestLocations array is populated.
  // requestLocations array is a parameter in the API call

  var requestLocations = [];
  for (var i = 0; i < 2 * tileRadius + 1; i++) {
    for (var j = 0; j < 2 * tileRadius + 1; j++) {
      requestLocations.push({
        lat: inputTopLeft.lat - step * i,
        lng: inputTopLeft.lng + step * j,
      })
    }
  }

  // Initialize & call elevations API
  var elevator = new google.maps.ElevationService;

  console.log('getElevationForLocations')
  return new Promise((resolve, reject) => {
    elevator.getElevationForLocations({
      'locations': requestLocations
    }, function(results, status) {
      // var elevations = [];
      if (status === 'OK') {
        //Create elevation table
        for (var i = 0; i < tileSize; i++) {
          // elevations.push(results[i].elevation)
          requestLocations[i].elv = results[i].elevation
        }
        multipleResults.push(requestLocations)
      } else {
        console.log("Elevation service failed due to: " + status)
      }

      resolve()
    })
  }).then(() => requestLocations)

}



// This loop calls elevation api for a specific set of locations
//
// var deltaTime = 4000; // in milliseconds
// var j = 0;
//
//
// for (var i = 0; i < tileAnchors.length; i++){
// 	setTimeout(function(){
// 		initMap(tileAnchors[j]);
// 		progressBar.innerHTML = "Gathering Data: " + Math.round(j / tileAnchors.length * 100) +"%"
// 		j++;
// 	},i*deltaTime);
// }
//
//
// setTimeout(function(){visualizeResults();},tileAnchors.length*deltaTime);

//
//
//  Trying something crazy here
//
// let apiCall = (i)=>{
//   initMap(tileAnchors[i]);
//   progressBar.innerHTML = "Gathering Data: " + Math.round(i / tileAnchors.length * 100) +"%"
// }
//
//
//
// async function vizzyResBoi(i){
//   await apiCall(i)
//   // return i < tileAnchors.length ? vizzyResBoi(i++) : visualizeResults()
// }
//
// vizzyResBoi(0)
//
//
//







//
// console.log(tileAnchors.length)
//
//
//
// // setTimeout(,tileAnchors.length*deltaTime);
async function vizzyResBoi(i) {
  if (i < tileAnchors.length) {
    let response = await initMap(tileAnchors[i])
    console.log('after initMap')
    responseArray.push(response)
    i++
    return await setTimeout(() => vizzyResBoi(i), 3000)
  }
}
vizzyResBoi(0)

// let k = 0
// vizzyResBoi(k)
//   .then(() => {
//     console.log('done?');
//   })




var minElv = Number.MAX_VALUE
var maxElv = -1
var elevationData = []

function visualizeResults() {
  progressBar.innerHTML = "Gathering Data: 100%"

  var row = []
  tableHTMLString = ""
  tableHTMLStringNoElv = ""
  for (var l = 0; l < gridLength; l++) {
    row = multipleResults.slice(l * gridLength, (l + 1) * gridLength)

    for (var k = 0; k < tileLength; k++) {
      for (var i = 0; i < gridLength; i++) {
        for (var j = 0; j < tileLength; j++) {

          var newVertex = row[i][tileLength * k + j]
          var cellNumber = l * tileSize * gridLength + k * gridLength * tileLength + i * tileLength + j

          elevationData.push(newVertex);
          tableHTMLString += "<div class='cell' id='cell" + cellNumber + "''>" + Math.max(Math.round(newVertex.elv), -1) + "</div>";
          tableHTMLStringNoElv += "<div class='cell' id='cell" + cellNumber + "''> </div>";

          if (newVertex.elv < minElv) {
            minElv = newVertex.elv
          }
          if (newVertex.elv > maxElv) {
            maxElv = newVertex.elv
          }
        }
      }
    }
  }
  container.innerHTML = tableHTMLString;

  progressBar.innerHTML = "Rendering Elevation Table"
  for (var i = 0; i < elevationData.length; i++) {
    cellColor = Shade((elevationData[i].elv - minElv) / (maxElv - minElv))
    document.getElementById('cell' + i).style.background = cellColor
  }
  document.getElementById('cell' + Math.floor((elevationData.length) / 2)).style.color = '#ccffff';
  progressBar.innerHTML = "Done"
  // Download Elevation Data
  // download('testss', JSON.stringify(elevationData));
  myString = JSON.stringify(elevationData);
  // Load THREEJS model
  loadScene()
}
