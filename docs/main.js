import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Ambient light to make sure everything is slightly visible
const global_light = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
scene.add( global_light );

// White directional light shining from the left
const sunlight = new THREE.DirectionalLight( 0xffffff, 10 );
sunlight.position.set( -10000, 0, 3000 )
scene.add( sunlight );

function drawGraticule(moon) {
	const geometry = new THREE.CircleGeometry( 505, 32 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const circle = new THREE.Mesh( geometry, material );
	moon.add( circle );
}

function addStation(moon, name, lat, long) {
	const location = new THREE.Vector3().setFromSphericalCoords(
		600, // Radius
		THREE.MathUtils.degToRad(90 - lat), // Angle from y (up) axis
		THREE.MathUtils.degToRad(long - 95) // Angle around y (up) axis
	);

	console.log(`lat: ${lat}, long: ${long} -> ${JSON.stringify(location)}`)

	const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), location ]);
	const line = new THREE.Line( geometry, material );
	moon.add( line );
}

function addStations(moon) {
	drawGraticule(moon);
	// S11	ALSEP 11, Mare Tranquillitatis, Moon	0.67416	23.473146	1969-07-21	1969-08-26	IRISDMC
	// S12	ALSEP 12, Oceanus Procellarum, Moon	-3.01084	-23.42456	1969-11-19	1977-09-30	IRISDMC
	// S14	ALSEP 14, Fra Mauro, Moon	-3.6445	-17.47753	1971-02-05	1977-09-30	IRISDMC
	// S15	ALSEP 15, Hadley Rille, Moon	26.13407	3.62981	1971-07-31	1977-09-30	IRISDMC
	// S16	ALSEP 16, Descartes, Moon	-8.97577	15.49649	1972-04-21	1977-09-30	IRISDMC
	addStation(moon, "S11",  0.67416,  23.473146);
	addStation(moon, "S12", -3.01084, -23.42456);
	addStation(moon, "S14", -3.6445,  -17.47753);
	addStation(moon, "S15", 26.13407,   3.62981);
	addStation(moon, "S16", -8.97577,  15.49649);
}

const loader = new GLTFLoader();
var moon = undefined;
loader.load( 
	'assets/Moon_1_3474.glb', 
	function ( gltf ) {
		moon = gltf.scene;
		addStations( moon );
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

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.minDistance = 501;
controls.maxDistance = 100000;

camera.position.z = 1000;
controls.update();

var rotationEnabled = false;
var rotationRate = 0.003;

function animate() {
	requestAnimationFrame( animate );
	if (moon != undefined && rotationEnabled) { moon.rotation.y += rotationRate; }
	controls.update();
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
}

const ROTATION_ZOOM_FACTOR = 1.04;
window.addEventListener("wheel", event => {
    const zoomFactor = (Math.sign(event.deltaY) > 0 ? ROTATION_ZOOM_FACTOR : 1.0 / ROTATION_ZOOM_FACTOR);
    rotationRate *= zoomFactor;
});
