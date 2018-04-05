class Geometry3D extends BasicScene {
  constructor(container = document.body, data = {}, scale, radius) {
    super(container)
    this.data = data
    this.scale = scale
    this.radius = radius
    this.scene.background = new THREE.Color(0xdddddd)
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
    this.heatmap = this.data.map(el => el.map(el => Math.max(el.elv, 0)))
    // console.log(this.heatmap)

    console.log(this.heatmap.length)

    let boxSize = 400
    let tileLength = boxSize / (size - 1)
    let elevationScale = 0.5 / this.scale / (2* this.radius + 1)
    console.log(elevationScale,this.scale,(2* this.radius + 1));
    // (maxElv - minElv) / this.scale / (2* this.radius + 1) * 0.5

    console.log(tileLength);



    const surfaceGeometry = new THREE.Geometry()
    this.heatmap.forEach((el, row) => el.forEach((el, col) => {
      surfaceGeometry.vertices.push(
        new THREE.Vector3(tileLength * col, el * elevationScale, tileLength * row)
      )
    }))


    // Define faces
    //
    for (let row = 0; row < size-1; row++) {
      for (let col = 0; col < size-1; col++) {
        surfaceGeometry.faces.push(new THREE.Face3(
          row * size  + col,
          (row + 1) * size + col,
          row * size + col + 1
        ))
        surfaceGeometry.faces.push(new THREE.Face3(
          (row + 1) * size + col,
          (row + 1) * size + col + 1,
          row * size + col + 1
        ))
      }
    }

    surfaceGeometry.computeBoundingSphere()
    surfaceGeometry.center()
    surfaceGeometry.computeVertexNormals()
    surfaceGeometry.computeFaceNormals()

    let surfaceMaterial = new THREE.MeshBasicMaterial({
      color: 0x515151,
      wireframe: true
    })
    let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
    this.group.add(surface)

  }




}
