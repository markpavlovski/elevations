class Geometry2D extends BasicScene {
  constructor(container = document.body, data = {}){
    super(container)
    this.data = data
    this.initObjects(this.group)
    this.createHeatMap()
  }

  initObjects(group){

    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Create Plane - the number of squares depends on what we want to do. if shading boxes a solid color then need 21 for base case (22 vertex row).
    // If shading vertices and letting the shader to interpolate, then need 20 boxes (21 vertices)
    var geometry = new THREE.PlaneGeometry( 400, 400, this.data.length, this.data.length );

    geometry.faces.forEach((face,idx)=>{
      if (idx%4 === 0 || idx%4 === 1){
        face.vertexColors.push(new THREE.Color(0x515151))
        face.vertexColors.push(new THREE.Color(0x515151))
        face.vertexColors.push(new THREE.Color(0x515151))
      } else {
        face.vertexColors.push(new THREE.Color(0xc1c1c1))
        face.vertexColors.push(new THREE.Color(0xc1c1c1))
        face.vertexColors.push(new THREE.Color(0xc1c1c1))
      }
    })

    var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide, wireframe: false} );
    var plane = new THREE.Mesh( geometry, material );
    group.add(plane)
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





  }


}
