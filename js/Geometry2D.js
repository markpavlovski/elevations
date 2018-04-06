class Geometry2D extends BasicScene {
  constructor(container = document.body, data = {}){
    super(container)
    this.data = data
    this.createHeatMap()
    this.initObjects()
  }

  initObjects(){
    let group = this.group



    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Create Plane - the number of squares depends on what we want to do. if shading boxes a solid color then need 21 for base case (22 vertex row).
    // If shading vertices and letting the shader to interpolate, then need 20 boxes (21 vertices)
    var geometry = new THREE.PlaneGeometry( 460, 460, this.data.length, this.data.length );

    geometry.faces.forEach((face,idx,arr)=>{

      const row = Math.floor(idx / this.data.length /2)
      const col = Math.floor(((idx % (this.data.length * 2)))/2)
      const greyScale = 1 - this.heatmap[row][col]
      const color = new THREE.Color(greyScale,greyScale,greyScale)

      face.vertexColors.push(color)
      face.vertexColors.push(color)
      face.vertexColors.push(color)

    })

    var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide, wireframe: false} );
    var plane = new THREE.Mesh( geometry, material );
    group.add(plane)
    group.position.y = 150
  }

  createHeatMap(){
    let size = this.data.length

    let minElv = this.data
      .map(el => el.reduce(
        (acc,el)=> Math.max(el.elv,0) < acc ? Math.max(el.elv,0) : acc ,Infinity)
      )
      .reduce((acc,el)=> el < acc ? el : acc ,Infinity)
    console.log(minElv)

    let maxElv = this.data
      .map(el => el.reduce(
        (acc,el)=> Math.max(el.elv,0) > acc ? Math.max(el.elv,0) : acc ,-Infinity)
      )
      .reduce((acc,el)=> el > acc ? el : acc ,-Infinity)
    console.log(maxElv)

    this.heatmap = this.data.map(el => el.map(el => Math.max(el.elv,0)/(maxElv-minElv)))
  }


    initControls(){
      // Turns off parent controls
    }

    animate() {
      requestAnimationFrame(this.animate.bind(this))
      this.render()
      this.group.rotation.y += .000
      this.group.rotation.x = 0.000

    }

}
