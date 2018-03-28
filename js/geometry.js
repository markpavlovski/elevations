
function loadScene(){

	//Stage standard variables
	var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight / 1.0, 1, 1000000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight * 1.0);
	//
	// var controls = new THREE.TrackballControls( camera );
	// controls.rotateSpeed = 1.0;
	// controls.zoomSpeed = 1.2;
	// controls.panSpeed = 0.8;
	// controls.noZoom = false;
	// controls.noPan = false;
	// controls.staticMoving = true;
	// controls.dynamicDampingFactor = 0.3;

	containerThree = document.getElementById( 'canvas' );
	document.body.appendChild( containerThree );
	containerThree.appendChild( renderer.domElement );

	//Generate Mesh
	var geometry = new THREE.Geometry();
	var fullRow = tileLength * gridLength;
	var cellSize = (maxElv-minElv)/21
	var topHeight = maxElv - minElv
	var heightScale = 2


	 	// Define Vertices
		for (var i =0; i < fullRow; i++){
			for (var j=0; j < fullRow; j++){
				geometry.vertices.push(
					new THREE.Vector3( cellSize* j, (elevationData[fullRow*i+j].elv-minElv)/heightScale, cellSize*i)
				)
			}
		}



	  	// Define Faces
		for (var j =  0; j < fullRow - 1; j++){
		for (var i=0; i < fullRow- 1; i++){
			//Facing Up
			geometry.faces.push( new THREE.Face3( fullRow * (j + 1) + i, fullRow*j + i+1, fullRow* j + i) )
			geometry.faces.push( new THREE.Face3( fullRow* j + i+1,fullRow * (j + 1) + i, fullRow * (j + 1) + i + 1) )
		}
		}

		geometry.computeBoundingSphere();
		geometry.center()
		geometry.computeVertexNormals()
		geometry.computeFaceNormals()

	// Setup scene
	// var material = new THREE.MeshLambertMaterial({color: 0x1EAEDB, wireframe: false}); //color: 0x1EAEDB vertexColors: THREE.VertexColors
	var material = new THREE.MeshBasicMaterial({color: 0x3c5ea1, wireframe: true}); //color: 0x1EAEDB vertexColors: THREE.VertexColors

	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Setup scene
	camera.position.z = topHeight*1.3;
	camera.position.x = 0*cellSize;
	camera.position.y = 15*cellSize;
	camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.5);


	var ambLight = new THREE.AmbientLight( 0x010101 ); // soft light
	scene.add( ambLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	scene.add( directionalLight );



  	// Set up auto-rotation
	clock = new THREE.Clock();
	rotationAxis = new THREE.Vector3( 0, 1, 0 )
	rotationSpeed = 2.5


	//Window resize
	window.addEventListener( 'resize', onWindowResize, false );


 	// Render scene
	function render() {
		// controls.update();
		requestAnimationFrame(render);
		cube.quaternion.setFromAxisAngle(rotationAxis, clock.getElapsedTime()/rotationSpeed);
		renderer.render(scene, camera);
	};
	render();

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}


}
