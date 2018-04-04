class Geometry2D {
  constructor(container = document.body){
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

  init(){
    console.log("Init Method")
  }


  animate() {
    requestAnimationFrame(animate)
    render()
  }

  render() {
    renderer.render(scene, camera)
  }
}
