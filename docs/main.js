import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const RADIUS = 2.0

function displacementScale() {
	// unsigned 16-bit TIFFs in half-meters, relative to a radius of 1727400 meters.
	const trueScale = 2 * RADIUS / 1727400;
	return 1000 * trueScale; // Emphasize differences to be very slightly noticeable
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Ambient light to make sure everything is slightly visible
const global_light = new THREE.AmbientLight( 0xffffff, 0.05 ); // soft white light
scene.add( global_light );

// White directional light shining from the left
const sunlight = new THREE.DirectionalLight( 0xffffff, 0.9 );
sunlight.position.set( -1, 0, 0.3 )
scene.add( sunlight );

const geometry = new THREE.SphereGeometry( RADIUS, 1024, 512 );

const surfaceTexture = new THREE.TextureLoader().load('assets/lroc_color_poles_2k.png');
const displacement = new THREE.TextureLoader().load('assets/ldem_4_uint_mod.png');
const material = new THREE.MeshStandardMaterial( { 
	map: surfaceTexture,
	displacementMap: displacement,
	displacementScale: displacementScale(),
} );
const moon = new THREE.Mesh( geometry, material );
scene.add( moon );

camera.position.z = 4;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 100 );
document.body.appendChild( renderer.domElement );

function animate() {
	requestAnimationFrame( animate );
	moon.rotation.y += 0.003;
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
}
