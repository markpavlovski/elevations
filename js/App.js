console.log("custom js loaded")

const newDataCard = (coordinates, scale, radius) => new ElevationData(coordinates, scale, radius)

document.querySelector("#gather-data").addEventListener("click", (event) => {
  const coordinates = document.querySelector("input#coordinates").value
  const scale = document.querySelector("input#scale").value
  const radius = document.querySelector("input#radius").value
  newDataCard(coordinates, scale, radius)
})

// Load existing cards
LocalStorage.get("elevations").forEach(({coordinates,scale,radius,dataMatrix,id})=>new Card(coordinates,scale,radius,dataMatrix,id))

// Create 2d heatmap object
// const heatmap = new Geometry2D(document.querySelector(".heatmap"))
// console.log(heatmap)
