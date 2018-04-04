class Geometry2D extends BasicScene {
  constructor(container = document.body){
    super(container)
    this.initObjects(this.group)
  }

  initObjects(group){

    // Empty group - this clears the group of the test objects
    super.clearGroup(group)

    // Add objects
    let box = new THREE.Mesh(new THREE.BoxGeometry(180, 180, 180), new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      visible: true
    }))
    group.add(box)
  }


}
