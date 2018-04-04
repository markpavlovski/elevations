class BasicScene {
  constructor(container = document.body){
    this.initScene(container)
    this.initTestObjects()
    this.animate()
    this.handleWindowEvents()
  }

  initScene(container){
    this.container = container
    console.log(container)

    // Set up scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf0f0f0)

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)
    this.camera.position.set(0, 150, 500)
    this.scene.add(this.camera)

    this.light = new THREE.PointLight(0xffffff, 0.8)
    this.camera.add(this.light)


    // Set up group
    this.group = new THREE.Group()
    this.group.position.y = 150
    this.scene.add(this.group)

    //  Renderer settings
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.appendChild(this.renderer.domElement)

  }

  initTestObjects(){

    // Hello Test Sphere
    const group = this.group
    let sphere = new THREE.Mesh(new THREE.SphereGeometry(60, 5, 5), new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      visible: true
    }))
    group.add(sphere)

  }

  clearGroup(group){
    group["children"].forEach(el => group["children"].pop())
  }



  onWindowResize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handleWindowEvents(){
    // //
    // function onDocumentMouseDown(event) {
    //   event.preventDefault();
    //   document.addEventListener('mousemove', onDocumentMouseMove, false);
    //   document.addEventListener('mouseup', onDocumentMouseUp, false);
    //   document.addEventListener('mouseout', onDocumentMouseOut, false);
    //   mouseXOnMouseDown = event.clientX - windowHalfX;
    //   targetRotationOnMouseDown = targetRotation;
    // }
    //
    // function onDocumentMouseMove(event) {
    //   mouseX = event.clientX - windowHalfX;
    //   targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    // }
    //
    // function onDocumentMouseUp(event) {
    //   document.removeEventListener('mousemove', onDocumentMouseMove, false);
    //   document.removeEventListener('mouseup', onDocumentMouseUp, false);
    //   document.removeEventListener('mouseout', onDocumentMouseOut, false);
    // }
    //
    // function onDocumentMouseOut(event) {
    //   document.removeEventListener('mousemove', onDocumentMouseMove, false);
    //   document.removeEventListener('mouseup', onDocumentMouseUp, false);
    //   document.removeEventListener('mouseout', onDocumentMouseOut, false);
    // }
    //
    // function onDocumentTouchStart(event) {
    //   if (event.touches.length == 1) {
    //     event.preventDefault();
    //     mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    //     targetRotationOnMouseDown = targetRotation;
    //   }
    // }
    //
    // function onDocumentTouchMove(event) {
    //   if (event.touches.length == 1) {
    //     event.preventDefault();
    //     mouseX = event.touches[0].pageX - windowHalfX;
    //     targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
    //   }
    // }



    // WINDOW EVENTS
    // document.addEventListener('mousedown', this.onDocumentMouseDown, false)
    // document.addEventListener('touchstart', this.onDocumentTouchStart, false)
    // document.addEventListener('touchmove', this.onDocumentTouchMove, false)
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }


  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
