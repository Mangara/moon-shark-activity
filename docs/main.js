import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
camera.position.z = 1000;

// Ambient light to make sure everything is slightly visible
const global_light = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
scene.add( global_light );

// White directional light shining from the left
const sunlight = new THREE.DirectionalLight( 0xffffff, 10 );
sunlight.position.set( -10000, 0, 3000 )
scene.add( sunlight );

const loader = new GLTFLoader();
var moon = undefined;
loader.load( 
	'assets/Moon_1_3474.glb', 
	function ( gltf ) {
		moon = gltf.scene;
		scene.add( moon );
	},
	undefined, 
	function ( error ) {
		console.error( "Error loading 3D model" );
		console.error( error );
	}
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 100 );
document.body.appendChild( renderer.domElement );

function animate() {
	requestAnimationFrame( animate );
	// moon.rotation.y += 0.003;
	if (moon != undefined) { moon.rotation.y += 0.003; }
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
}
