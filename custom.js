console.log("custom js loaded")

const gatherData = (coordinates,scale,radius) => {
  const data = {name:"new data", random: Math.random()}
  new Card(coordinates,scale,radius,data)
}

document.querySelector("#gather-data").addEventListener("click",(event)=>{
  const coordinates = document.querySelector("input#coordinates").value
  const scale = document.querySelector("input#scale").value
  const radius = document.querySelector("input#radius").value
  gatherData(coordinates,scale,radius)
})

class Card {
  constructor(coordinates = "47.659064, -122.354199", scale="1", radius="0", data={}) {

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

    card.querySelector("#remove-card").addEventListener("click",() => card.parentNode.removeChild(card))
    card.querySelector("#load-data").addEventListener("click",() => this.renderCard(this.data))
  }

  renderCard(data){
    console.log(data)
  }


}
