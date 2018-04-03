console.log("custom js loaded")

const gatherData = (coordinates, scale, radius) => {
  const data = {
    name: "new data",
    random: Math.random()
  }
  new Card(coordinates, scale, radius, data)
}

document.querySelector("#gather-data").addEventListener("click", (event) => {
  const coordinates = document.querySelector("input#coordinates").value
  const scale = document.querySelector("input#scale").value
  const radius = document.querySelector("input#radius").value
  gatherData(coordinates, scale, radius)
})

class Card {
  constructor(coordinates = "47.659064, -122.354199", scale = "1", radius = "0", data = {}) {

    this.data = data

    const main = document.querySelector("main")
    const card = document.createElement("div")
    card.classList.add("data-card")
    card.innerHTML = `
      <div class="card-left">
        <p class="label">Location:</p>
        <p id="coordinates">${coordinates}</p>
        <p class="label">Scale:</p>
        <p id="scale">${scale}</p>
        <p class="label">Radius:</p>
        <p id="radius">${radius}</p>
      </div>
      <div class="card-right"><div class="button" id="load-data">load</div><div class="button" id="remove-card">remove</div></div>
    `
    main.appendChild(card)

    card.querySelector("#remove-card").addEventListener("click", () => card.parentNode.removeChild(card))
    card.querySelector("#load-data").addEventListener("click", () => this.renderCard(this.data))
  }

  renderCard(data) {
    console.log(data)
  }
}





class ElevationData {
  constructor(coordinates = "47.659064, -122.354199", scale = 1, radius = 1) {
    this.coordinates = coordinates
    this.scale = scale
    this.radius = radius
    this.requestLocations = this.getRequestLocations()
    this.responseArray = []
    this.multipleResults = []

    console.log({
      coordinates,
      scale,
      radius
    })
    console.log(this.requestLocations)

    this.requestElevations()

  }

  getRequestLocations() {
    const requestLocations = []
    const tileAnchors = []

    const gridRadius = this.radius
    const tileRadius = 10
    const tileLength = 2 * tileRadius + 1
    const resolutionWidth = 0.001265 // Fremont city block length North-South
    const gridLength = 2 * gridRadius + 1
    const step = resolutionWidth * this.scale
    const tileSize = tileLength ** 2
    const gridSize = gridLength ** 2

    const middleTileCenter = {}
    const middleTileTopLeft = {}
    const gridTopLeft = {}

    // Center coordinate of center tile is the coordinate requested by the user
    middleTileCenter.lat = parseFloat(this.coordinates.split(",")[0])
    middleTileCenter.lng = parseFloat(this.coordinates.split(",")[1])

    // Top left coordinate of the center tile is the starting anchor for the elevation coordinate 'matrix'
    middleTileTopLeft.lat = middleTileCenter.lat + tileRadius * step
    middleTileTopLeft.lng = middleTileCenter.lng - tileRadius * step

    // Top left coordinate of the entir grid, teh same as the top left coordinate of the top left tile
    gridTopLeft.lat = middleTileTopLeft.lat + gridRadius * tileLength * step
    gridTopLeft.lng = middleTileTopLeft.lng - gridRadius * tileLength * step
    //


    // Tile anchors are all of the top left coordinates of al of the tiles, tiled one row at a time
    for (let i = 0; i < gridLength; i++) {
      for (let j = 0; j < gridLength; j++) {
        tileAnchors.push({
          lat: gridTopLeft.lat - tileLength * step * i,
          lng: gridTopLeft.lng + tileLength * step * j
        })
      }
    }

    // Location matrix for each tile is created using the same process, just different anchor coordinate
    tileAnchors.forEach(el => {
      let locations = []
      for (var i = 0; i < 2 * tileRadius + 1; i++) {
        for (var j = 0; j < 2 * tileRadius + 1; j++) {
          locations.push({
            lat: el.lat - step * i,
            lng: el.lng + step * j,
            elv: null
          })
        }
      }
      requestLocations.push(locations)
    })

    // requestLocations is an array of arrays. Each sub-array is an array of coordinates for each tile, row-by-row
    return requestLocations
  }


  async requestElevations(i = 0, responseArray = this.responseArray) {
    if (i < this.requestLocations.length) {
      let response = await this.googleMapsRequest(this.requestLocations[i], responseArray)
      console.log('after initMap')
      i++
      return await setTimeout(() => this.requestElevations(i, responseArray), 3000)
    }
  }

  googleMapsRequest(locations, responseArray) {
    console.log(locations)
    // Initialize & call elevations API
    let elevator = new google.maps.ElevationService;

    console.log('getElevationForLocations')
    return new Promise((resolve, reject) => {
      elevator.getElevationForLocations({
        'locations': locations
      }, function(results, status) {
        if (status === 'OK') {
          responseArray.push(results)
        } else {
          console.log("Elevation service failed due to: " + status)
        }
        resolve()
      })
    }).then(() => locations)
  }




  //
  // // Get User Inputs
  // // var inputloc = prompt("Please enter coordinates (default is Lighthouse Roasters in Fremont):", "47.659064, -122.354199");
  // // var scale = prompt("Please input scale: (1 corresponds to the length of one block N-S)", 1);
  // // var gridRadius = prompt("Please enger grid radius (0 is equivalent to 1 x 1 tiling, gridRadius of 2 equivalent to 5 x 5 tiling, etc.)",0);
  //
  // var inputloc = "47.659064, -122.354199"
  // var scale = 1
  // var gridRadius = 1
  // var loc = inputloc.split(", ")
  // let responseArray = []
  //
  //
  //
  //
  //
  // //Note to self: latitude is N-S, longitude i E-W
  //
  // function download(filename, text) {
  //   var element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  //   element.setAttribute('download', filename);
  //
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //
  //   element.click();
  //
  //   document.body.removeChild(element);
  // }
  //
  //
  // // Convert percentage into hexadecimal greyscale color
  // function Shade(pct) {
  //   pct = 1 - pct
  //   var rgbComponent = Math.round(255 * pct)
  //   var hexComponent
  //   if (rgbComponent < 16) {
  //     hexComponent = "0" + rgbComponent.toString(16)
  //   } else {
  //     hexComponent = rgbComponent.toString(16)
  //   }
  //   var hex = "#" + hexComponent + hexComponent + hexComponent
  //   return hex
  // }
  //
  //
  // // Defaults
  // var tileRadius = 10;
  // var tileLength = 2 * tileRadius + 1;
  // var resolutionWidth = 0.001265; // Fremont city block length North-South
  // var gridLength = 2 * gridRadius + 1;
  // var step = resolutionWidth * scale;
  // var tileSize = tileLength ** 2;
  // var gridSize = gridLength ** 2;
  //
  // // Set Up Display
  // container = document.getElementById('container');
  // container.style.width = 25 * tileLength * gridLength + "px";
  // progressBar = document.getElementById('progressBar');
  // progressBar.style.width = 25 * tileLength * gridLength + "px";
  //
  // Stage Request Inputs
  // var middleTileCenter = {
  //   lat: at(loc[0]),
  //   lng: at(loc[1])
  // };
  //
  // var middleTileTopLeft = {
  //   lat: middleTileCenter.lat + tileRadius * step,
  //   lng: middleTileCenter.lng - tileRadius * step
  // };
  //
  // var gridTopLeft = {
  //   lat: middleTileTopLeft.lat + gridRadius * tileLength * step,
  //   lng: middleTileTopLeft.lng - gridRadius * tileLength * step
  // };
  //
  // var tileAnchors = [];
  // for (var i = 0; i < gridLength; i++) {
  //   for (var j = 0; j < gridLength; j++) {
  //     tileAnchors.push({
  //       lat: gridTopLeft.lat - tileLength * step * i,
  //       lng: gridTopLeft.lng + tileLength * step * j
  //     })
  //   }
  // }

  //
  // var multipleResults = []
  //
  //
  //
  // // Init Map function is the data collection routine
  //
  // function initMap(inputTopLeft) {
  //
  //
  //   // first the set of locations is created based on teh input location, then requestLocations array is populated.
  //   // requestLocations array is a parameter in the API call
  //
  //   var requestLocations = [];
  //   for (var i = 0; i < 2 * tileRadius + 1; i++) {
  //     for (var j = 0; j < 2 * tileRadius + 1; j++) {
  //       requestLocations.push({
  //         lat: inputTopLeft.lat - step * i,
  //         lng: inputTopLeft.lng + step * j,
  //       })
  //     }
  //   }
  //
  //   // Initialize & call elevations API
  //   var elevator = new google.maps.ElevationService;
  //
  //   console.log('getElevationForLocations')
  //   return new Promise((resolve, reject) => {
  //     elevator.getElevationForLocations({
  //       'locations': requestLocations
  //     }, function(results, status) {
  //       // var elevations = [];
  //       if (status === 'OK') {
  //         //Create elevation table
  //         for (var i = 0; i < tileSize; i++) {
  //           // elevations.push(results[i].elevation)
  //           requestLocations[i].elv = results[i].elevation
  //         }
  //         multipleResults.push(requestLocations)
  //       } else {
  //         console.log("Elevation service failed due to: " + status)
  //       }
  //
  //       resolve()
  //     })
  //   }).then(() => requestLocations)
  // }
  //
  //
  // //
  // // // This loop calls elevation api for a specific set of locations
  // // //
  // // // var deltaTime = 4000; // in milliseconds
  // // // var j = 0;
  // // //
  // // //
  // // // for (var i = 0; i < tileAnchors.length; i++){
  // // // 	setTimeout(function(){
  // // // 		initMap(tileAnchors[j]);
  // // // 		progressBar.innerHTML = "Gathering Data: " + Math.round(j / tileAnchors.length * 100) +"%"
  // // // 		j++;
  // // // 	},i*deltaTime);
  // // // }
  // // //
  // // //
  // // // setTimeout(function(){visualizeResults();},tileAnchors.length*deltaTime);
  // //
  // // //
  // // //
  // // //  Trying something crazy here
  // // //
  // // // let apiCall = (i)=>{
  // // //   initMap(tileAnchors[i]);
  // // //   progressBar.innerHTML = "Gathering Data: " + Math.round(i / tileAnchors.length * 100) +"%"
  // // // }
  // // //
  // // //
  // // //
  // // // async function vizzyResBoi(i){
  // // //   await apiCall(i)
  // // //   // return i < tileAnchors.length ? vizzyResBoi(i++) : visualizeResults()
  // // // }
  // // //
  // // // vizzyResBoi(0)
  // // //
  // // //
  // // //
  // //
  // //
  //



  //
  // //
  // // console.log(tileAnchors.length)
  // //
  // //
  // //
  // // // setTimeout(,tileAnchors.length*deltaTime);
  // async function vizzyResBoi(i) {
  //   if (i < tileAnchors.length) {
  //     let response = await initMap(tileAnchors[i])
  //     console.log('after initMap')
  //     responseArray.push(response)
  //     i++
  //     return await setTimeout(() => vizzyResBoi(i), 3000)
  //   }
  // }
  // vizzyResBoi(0)

  // let k = 0
  // vizzyResBoi(k)
  //   .then(() => {
  //     console.log('done?');
  //   })


  //
  //
  // var minElv = Number.MAX_VALUE
  // var maxElv = -1
  // var elevationData = []
  //
  // function visualizeResults() {
  //   progressBar.innerHTML = "Gathering Data: 100%"
  //
  //   var row = []
  //   tableHTMLString = ""
  //   tableHTMLStringNoElv = ""
  //   for (var l = 0; l < gridLength; l++) {
  //     row = multipleResults.slice(l * gridLength, (l + 1) * gridLength)
  //
  //     for (var k = 0; k < tileLength; k++) {
  //       for (var i = 0; i < gridLength; i++) {
  //         for (var j = 0; j < tileLength; j++) {
  //
  //           var newVertex = row[i][tileLength * k + j]
  //           var cellNumber = l * tileSize * gridLength + k * gridLength * tileLength + i * tileLength + j
  //
  //           elevationData.push(newVertex);
  //           tableHTMLString += "<div class='cell' id='cell" + cellNumber + "''>" + Math.max(Math.round(newVertex.elv), -1) + "</div>";
  //           tableHTMLStringNoElv += "<div class='cell' id='cell" + cellNumber + "''> </div>";
  //
  //           if (newVertex.elv < minElv) {
  //             minElv = newVertex.elv
  //           }
  //           if (newVertex.elv > maxElv) {
  //             maxElv = newVertex.elv
  //           }
  //         }
  //       }
  //     }
  //   }
  //   container.innerHTML = tableHTMLString;
  //
  //   progressBar.innerHTML = "Rendering Elevation Table"
  //   for (var i = 0; i < elevationData.length; i++) {
  //     cellColor = Shade((elevationData[i].elv - minElv) / (maxElv - minElv))
  //     document.getElementById('cell' + i).style.background = cellColor
  //   }
  //   document.getElementById('cell' + Math.floor((elevationData.length) / 2)).style.color = '#ccffff';
  //   progressBar.innerHTML = "Done"
  //   // Download Elevation Data
  //   // download('testss', JSON.stringify(elevationData));
  //   myString = JSON.stringify(elevationData);
  //   // Load THREEJS model
  //   loadScene()
  // }



}
