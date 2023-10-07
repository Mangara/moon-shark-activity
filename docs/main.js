import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const geometry = new THREE.SphereGeometry( 2 );
const material = new THREE.MeshBasicMaterial( { color: 0xa4bdd5 } );
const moon = new THREE.Mesh( geometry, material );
scene.add( moon );

camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 100 );
document.body.appendChild( renderer.domElement );


function animate() {
	requestAnimationFrame( animate );
	moon.rotation.x += 0.01;
	moon.rotation.y += 0.01;
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
}
