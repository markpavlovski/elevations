class Geometry2D extends BasicScene {
  constructor(container = document.body){
    super(container)
    this.initObjects(this.group)
  }

  initObjects(group){

    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Create Plane
    var geometry = new THREE.PlaneGeometry( 400, 400, 20, 20 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide, wireframe: true} );
    var plane = new THREE.Mesh( geometry, material );
    group.add(plane)





  }


}
