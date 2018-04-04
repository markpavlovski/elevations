class Geometry2D extends BasicScene {
  constructor(container = document.body){
    super(container)
    this.initObjects(this.group)
  }

  initObjects(group){

    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Create Plane - the number of squares depends on what we want to do. if shading boxes a solid color then need 21 for base case (22 vertex row).
    // If shading vertices and letting the shader to interpolate, then need 20 boxes (21 vertices)
    var geometry = new THREE.PlaneGeometry( 400, 400, 21, 21 );
    console.log(geometry.vertices)
    console.log(geometry.faces.length)

    console.log(geometry.faces[0].vertexColors)
    // geometry.faces[0].vertexColors.push(new THREE.Color(0x00ff00))
    // geometry.faces[0].vertexColors.push(new THREE.Color(0x00ff00))
    // geometry.faces[0].vertexColors.push(new THREE.Color(0x00ff00))

    geometry.faces.forEach((face,idx,array)=>{
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


}
