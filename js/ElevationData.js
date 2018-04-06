class ElevationData {
  constructor(coordinates = "47.659064, -122.354199", scale = 1, radius = 0) {
    this.coordinates = coordinates
    this.scale = scale
    this.radius = radius
    this.requestLocations = this.getRequestLocations()
    this.responseArray = []
    this.dataMatrix = []
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
      let gridPositions = []
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
      console.log(`Receiving ${i+1}/${(this.radius*2+1)**2}`)
      document.title = `Receiving ${i+1}/${(this.radius*2+1)**2}`
      i++
      return await setTimeout(() => this.requestElevations(i, responseArray), 3000)
    } else {

      this.createElevationData()
      const id = `${this.coordinates} - ${this.scale} - ${this.radius}`
      this.renderCard(this.coordinates,this.scale,this.radius,this.dataMatrix,id)
      this.persistToStorage(this.coordinates,this.scale,this.radius,this.dataMatrix,id)
    }
  }

  googleMapsRequest(locations, responseArray) {
    // Initialize & call elevations API
    let elevator = new google.maps.ElevationService;

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

  createElevationData() {

    const tileLength = 21
    const tileSize = tileLength ** 2
    const gridLength = 2 * this.radius + 1
    const matrixRowLength = tileLength * gridLength
    let matrixRow = []
    let locationRow
    let elevationRow

    for (var l = 0; l < gridLength; l++) {
      locationRow = this.requestLocations.slice(l * gridLength, (l + 1) * gridLength)
      elevationRow = this.responseArray.slice(l * gridLength, (l + 1) * gridLength)

      for (var k = 0; k < tileLength; k++) {
        for (var i = 0; i < gridLength; i++) {
          for (var j = 0; j < tileLength; j++) {

            let newVertex = locationRow[i][tileLength * k + j]
            newVertex.elv = elevationRow[i][tileLength * k + j].elevation


            if (matrixRow.length === matrixRowLength) {
              matrixRow = []
              matrixRow.push(newVertex)
            } else {
              matrixRow.push(newVertex)
            }
            if (matrixRow.length === matrixRowLength) this.dataMatrix.push(matrixRow)

          }
        }
      }
    }
    console.log("elevation data complete")
    document.title = `Elevations - data received.`

  }


  renderCard(coordinates, scale, radius, dataMatrix, id) {
    const card = new Card(coordinates, scale, radius, dataMatrix, id)
  }

  persistToStorage(coordinates,scale,radius,dataMatrix,id){
    const storedCards = LocalStorage.get("elevations") ? LocalStorage.get("elevations") : []
    storedCards.push({coordinates,scale,radius,dataMatrix,id})
    LocalStorage.set("elevations",storedCards)
  }

}
