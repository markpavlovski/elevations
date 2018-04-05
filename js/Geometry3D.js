class Geometry3D extends BasicScene {
  constructor(container = document.body, data = {}) {
    super(container)
    this.data = data
    this.scene.background = new THREE.Color(0xdddddd)

    // this.data = data
    // this.createHeatMap()
    this.initObjects()
  }

  initObjects() {
    let group = this.group

    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Create Plane - the number of squares depends on what we want to do. if shading boxes a solid color then need 21 for base case (22 vertex row).
    // If shading vertices and letting the shader to interpolate, then need 20 boxes (21 vertices)
    // var geom = new THREE.PlaneGeometry(400, 400, 100, 100);
    //
    //
    // var mat = new THREE.MeshBasicMaterial({
    //   vertexColors: THREE.VertexColors,
    //   side: THREE.DoubleSide,
    //   wireframe: false
    // });
    // var plane = new THREE.Mesh(geom, mat);
    // group.add(plane)




    let size = this.data.length

    let minElv = this.data
      .map(el => el.reduce(
        (acc, el) => Math.max(el.elv, 0) < acc ? Math.max(el.elv, 0) : acc, Infinity))
      .reduce((acc, el) => el < acc ? el : acc, Infinity)
    console.log(minElv)

    let maxElv = this.data
      .map(el => el.reduce(
        (acc, el) => Math.max(el.elv, 0) > acc ? Math.max(el.elv, 0) : acc, -Infinity))
      .reduce((acc, el) => el > acc ? el : acc, -Infinity)
    console.log(maxElv)

    // this.elevations = new Matrix(size)
    this.heatmap = this.data.map(el => el.map(el => Math.max(el.elv, 0) / (maxElv - minElv)))
    // console.log(this.heatmap)

    console.log(this.heatmap)

    let boxSize = 400
    let tileLength = boxSize / (size - 1)
    let elevationScale = (maxElv - minElv) * 2

    console.log(tileLength);



    const surfaceGeometry = new THREE.Geometry()
    this.heatmap.forEach((el, row) => el.forEach((el, col) => {
      surfaceGeometry.vertices.push(
        new THREE.Vector3(tileLength * col, el * elevationScale, tileLength * row)
      )
    }))
    console.log(surfaceGeometry.vertices)

    // Define Faces
    for (let j = 0; j < tileLength - 1; j++) {
      for (let i = 0; i < tileLength - 1; i++) {
        //Facing Up
        surfaceGeometry.faces.push(new THREE.Face3(tileLength * (j + 1) + i, tileLength * j + i + 1, tileLength * j + i))
        surfaceGeometry.faces.push(new THREE.Face3(tileLength * j + i + 1, tileLength * (j + 1) + i, tileLength * (j + 1) + i + 1))
      }
    }
    console.log(surfaceGeometry.faces)

    surfaceGeometry.computeBoundingSphere()
  	surfaceGeometry.center()
  	surfaceGeometry.computeVertexNormals()
  	surfaceGeometry.computeFaceNormals()

    let surfaceMaterial = new THREE.MeshBasicMaterial({color: 0x515151, wireframe: true})
    let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
    this.group.add(surface)

    //
    // //Generate Mesh
    // var geometry = new THREE.Geometry();
    // var fullRow = size
    // var cellSize = 10
    // var topHeight = 20
    // var heightScale = 1
    //
    //
    //  	// Define Vertices
    // 	for (var i =0; i < fullRow; i++){
    // 		for (var j=0; j < fullRow; j++){
    // 			geometry.vertices.push(
    // 				new THREE.Vector3( cellSize* j, (elevationData[fullRow*i+j].elv-minElv)/heightScale, cellSize*i)
    // 			)
    // 		}
    // 	}
    //
    //
    //
    //   	// Define Faces
    // 	for (var j =  0; j < fullRow - 1; j++){
    // 	for (var i=0; i < fullRow- 1; i++){
    // 		//Facing Up
    // 		geometry.faces.push( new THREE.Face3( fullRow * (j + 1) + i, fullRow*j + i+1, fullRow* j + i) )
    // 		geometry.faces.push( new THREE.Face3( fullRow* j + i+1,fullRow * (j + 1) + i, fullRow * (j + 1) + i + 1) )
    // 	}
    // 	}
    //
    // 	geometry.computeBoundingSphere();
    // 	geometry.center()
    // 	geometry.computeVertexNormals()
    // 	geometry.computeFaceNormals()
  }




}
