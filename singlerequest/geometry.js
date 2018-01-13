
function loadScene(){

	//Stage standard variables
	var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xccffff );
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight / .6, 1, 10000);
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight * .6);

	containerThree = document.getElementById( 'canvas' );
	document.body.appendChild( containerThree );
	containerThree.appendChild( renderer.domElement );
	
	//Generate Mesh
	var geometry = new THREE.Geometry();
	var fullRow = 2*radius+1;
	var cellSize = (maxElv-minElv)/21
	var topHeight = maxElv - minElv
	var heightScale = 2

	 	// Define Vertices
		for (var i =0; i < fullRow; i++){
			for (var j=0; j < fullRow; j++){
				geometry.vertices.push(
					new THREE.Vector3( cellSize* j, (elevations[fullRow*i+j]-minElv)/heightScale, cellSize*i)
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
	var material = new THREE.MeshLambertMaterial({color: 0x1EAEDB, wireframe: false});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Setup scene
	camera.position.z = topHeight*1.3;    
	camera.position.x = 0*cellSize;    
	camera.position.y = 15*cellSize;  
	camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.5);      

	// Test sphere helper for light positioning
	  // var materialtest = new THREE.MeshLambertMaterial({color: 0x1EAEDB, wireframe: false});
	  // var sphere = new THREE.Mesh(new THREE.SphereGeometry( 5, 32, 32 ), materialtest);
	  // sphere.position.set(-maxElv/2,maxElv/2,0);
	  // scene.add(sphere);


	// Add point lights

	var light = new THREE.PointLight( 0x9999ff, 2, 100  ); 
	light.position.set(-maxElv/2,maxElv/2,0);
	scene.add( light );

	var light2 = new THREE.PointLight( 0x99ff99, 2, 100  ); 
	light2.position.set(maxElv/2,maxElv/2,0);
	scene.add( light2 );

	var light3 = new THREE.PointLight( 0xffffff, 2, 100  ); 
	light3.position.set(0,maxElv/2,-maxElv/2);
	scene.add( light3 );

	var light4 = new THREE.PointLight( 0xff9999, 2, 100  ); 
	light4.position.set(0,maxElv/4,maxElv/2);
	scene.add( light4 );

	var ambLight = new THREE.AmbientLight( 0x050101 ); // soft light
	scene.add( ambLight );



  	// Set up auto-rotation
	clock = new THREE.Clock();
	rotationAxis = new THREE.Vector3( 0, 1, 0 )
	rotationSpeed = 2.5

 	// Render scene
	function render() {
		requestAnimationFrame(render);
		cube.quaternion.setFromAxisAngle(rotationAxis, clock.getElapsedTime()/rotationSpeed);
		renderer.render(scene, camera);
	};	
	render();

}
