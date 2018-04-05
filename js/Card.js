class Card {
  constructor(coordinates = "47.659064, -122.354199", scale = "1", radius = "0", data = {}, id = "0") {
    this.coordinates = coordinates
    this.scale = scale
    this.radius = radius
    this.data = data
    this.id = id

    const main = document.querySelector("main")
    const card = document.createElement("div")
    card.id = id
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
      <div class="card-right"><div class="button" id="load-data">RENDER</div><div class="button" id="remove-card">remove</div></div>
    `
    main.appendChild(card)

    card.querySelector("#remove-card").addEventListener("click", () => {
      card.parentNode.removeChild(card)
      let storedCards = LocalStorage.get("elevations") ? LocalStorage.get("elevations") : []
      storedCards = storedCards.filter(el => el.id !== card.id)
      LocalStorage.set("elevations",storedCards)
    })
    card.querySelector("#load-data").addEventListener("click", () => this.renderCard(this.data, this.scale, this.radius))
  }

  renderCard(data,scale,radius) {

    const container2d = document.querySelector(".heatmap")
    const container3d = document.querySelector(".threejs")
    while(container2d.firstElementChild) container2d.removeChild(container2d.firstElementChild)
    while(container3d.firstElementChild) container3d.removeChild(container3d.firstElementChild)

    // console.log(data.length)
    const heatmap = new Geometry2D(container2d,data)
    const threedee = new Geometry3D(container3d,data,scale,radius)

    // console.log(heatmap)
    container3d.scrollIntoView()
  }
}
