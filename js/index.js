'use strict';

import * as THREE 						from "../lib/three.module.js";
import { OrbitControls }                from "../lib/threeOrbitControls.js";
import { CSS2DRenderer, CSS2DObject } 	from '../lib/CSS2DRenderer.js';
import { Floor }						from './_floor.js';
import { Location }   					from './_location.js';
//import { Search }    					from './_search.js';

////// Set-up

// Config

window.astroSearchIndex		= [];
window.astroSearchIntersect	= [];
window.astroSearchIdLookup	= {};
window.astroSearchIdCurrent	= null;
window.astroConfig			= {
	showLocations		: true,
	showLocationAreas 	: true,
	
	floorBaselineDefault: 3.5,
	floorBaseline		: 1,
	floorCount			: 3,
	floorSpacing		: 2,
	floorThickness		: 10,
    
    animationSpeed      : 10,

	groupRotate			: 0.003,
	imgWidth 			: 989.665,
	imgHeight 			: 456.178,
	chessBoardSquare	: 1.5,

	resizeTimeout		: 1000,

	cameraFov 			: 60,
	cameraXDefault 		: 1000,
	cameraYDefault 		: 0,
	cameraZDefault 		: 3000,
	cameraBack 			: 2000,
	radius 				: 700,

	locations			: {
		'101'			: [ 0.4, 0.1, { shape : [ -2,3,-1,3 ], pos2Mac: {}, mac2Pos: {} } ],
		'102'			: [ 0.6, 0.1, { shape : [ -2,9,-1,2 ], pos2Mac: {}, mac2Pos: {} } ],
		'103'			: [ 0.8, 0.1, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'104'			: [ 0.88, 0.3, { shape   : [ -4,1,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'105'			: [ 0.88, 0.5, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'106'			: [ 0.88, 0.7, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'107'			: [ 0.88, 0.82, { shape   : [ -3,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'109'			: [ 0.6, 0.82, { shape   : [ -5,2,-3,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'111'			: [ 0.3, 0.82, { shape   : [ -2,2,-4,2 ], mac2Pos : {}, pos2Mac : {} } ],

		'202'			: [ 0.6, 0.1, { shape : [ -8,8,-1,2 ], pos2Mac: {}, mac2Pos: {} } ],
		'205'			: [ 0.88, 0.55, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'208'			: [ 0.6, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'212'			: [ 0.28, 0.57, { shape   : [ -2,2,-2,6 ], mac2Pos : {}, pos2Mac : {} } ],
		'213'			: [ 0.48, 0.55, { shape   : [ -3,0,-1,6 ], mac2Pos : {}, pos2Mac : {} } ],

		'302'			: [ 0.6, 0.1, { shape : [ -6,3,-1,2 ], pos2Mac: {}, mac2Pos: {} } ],
		'303'			: [ 0.85, 0.12, { shape   : [ -2,2,-1,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'305'			: [ 0.88, 0.47, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'307'			: [ 0.88, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'308'			: [ 0.6, 0.82, { shape : [ -1,6,-3,1 ], pos2Mac: {}, mac2Pos: {} } ],
		'310'			: [ 0.45, 0.82, { shape : [ -6,2,-2,1 ], pos2Mac: {}, mac2Pos: {} } ],
		'311'			: [ 0.3, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'312'			: [ 0.38, 0.57, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'313'			: [ 0.48, 0.55, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'315'			: [ 0.48, 0.55, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'317'			: [ 0.68, 0.3, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],

		'403'			: [ 0.85, 0.12, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'404'			: [ 0.88, 0.3, { shape   : [ -3,1,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'406'			: [ 0.88, 0.62, { shape   : [ -3,1,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'407'			: [ 0.88, 0.82, { shape   : [ -4,1,-1,1 ], mac2Pos : {}, pos2Mac : {} } ],
		'410'			: [ 0.45, 0.82, { shape : [ -6,6,-1,1 ], pos2Mac: {}, mac2Pos: {} } ],
		'417'			: [ 0.6, 0.65, { shape   : [ -2,4,0,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'418'			: [ 0.42, 0.65, { shape   : [ -5,2,-2,1 ], mac2Pos : {}, pos2Mac : {} } ],

		'501'			: [ 0.4, 0.12, { shape   : [ -2,2,-1,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'502'			: [ 0.65, 0.12, { shape   : [ -2,2,-1,4 ], mac2Pos : {}, pos2Mac : {} } ],
		'504'			: [ 0.88, 0.32, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'505'			: [ 0.88, 0.55, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'508'			: [ 0.6, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'510'			: [ 0.3, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'512'			: [ 0.35, 0.57, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],

		'602'			: [ 0.6, 0.12, { shape : [ -8,3,-1,1 ], pos2Mac: {}, mac2Pos: {} } ],
		'605'			: [ 0.88, 0.32, { shape : [ -3,1,-5,3 ], pos2Mac: {}, mac2Pos: {} } ],
		'606'			: [ 0.88, 0.6, { shape   : [ -3,1,-1,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'608'			: [ 0.6, 0.82, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
		'610'			: [ 0.3, 0.82, { shape : [ -2,9,-1,1 ], pos2Mac: {}, mac2Pos: {} } ],
		'612'			: [ 0.35, 0.57, { shape   : [ -2,2,-2,2 ], mac2Pos : {}, pos2Mac : {} } ],
	}
}

window.astroConfig.unit 	= window.astroConfig.imgWidth/40;
window.astroConfig.cameraX= window.astroConfig.cameraXDefault;
window.astroConfig.cameraY= window.astroConfig.cameraYDefault;
window.astroConfig.cameraZ= window.astroConfig.cameraZDefault;

let   mainRenderer		= null;
let   labelRenderer		= null;
let   camera			= null;
let   cameraX			= window.astroConfig.cameraX;
let   cameraY			= window.astroConfig.cameraY;
let   cameraZ			= window.astroConfig.cameraZ;
let   controls			= null;
let   bgScene          	= null;
let   scene         	= null;
let   lightAmbient		= null;
let   lightDirect		= null;

//const searchController	= Search( Search ).init();

const floors            = {};
const locations         = {};

const initEvents = function() {
	document.addEventListener('keydown', keyStrokes);
};

const keyStrokes = function( ev ) {

	if ( document.body.classList.contains('search--close') || !document.querySelectorAll('[js-search-item]').length ) {

		if ( ev.code === 'ArrowDown'  ) {
			ev.preventDefault();
			console.log('arrow down');
			
		}
	}
}

const initScene = function() {

	console.log( '%c%s', 'color:hsl(87, 79%, 96%);background:hsl(87, 77%, 28%);padding:0.2em 0', '⏣ INIT SCENE' );

	// responsive
	const winWidth 		= window.innerWidth;
	const winHeight 	= window.innerHeight;
	const winAspect		= winWidth / winHeight;

	// label renderer
	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( winWidth, winHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = 0;
	labelRenderer.domElement.style.zIndex = 0;
	document.querySelector('[js-labels]').appendChild( labelRenderer.domElement );

	// Background Renderer
	// bgRenderer = new THREE.WebGLRenderer( { alpha: true } );
	// bgRenderer.setPixelRatio( window.devicePixelRatio );
	// bgRenderer.setSize( winWidth, winHeight );
	// document.querySelector('[js-bg]').appendChild( bgRenderer.domElement );

	// Main Renderer
	mainRenderer = new THREE.WebGLRenderer( { alpha: true } );
	//mainRenderer.setPixelRatio( window.devicePixelRatio );
	mainRenderer.setSize( winWidth, winHeight );
	document.querySelector('[js-main]').appendChild( mainRenderer.domElement );

	// Scenes
	scene = new THREE.Scene();
	bgScene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera( window.astroConfig.cameraFov, winAspect, 0.1, cameraZ + window.astroConfig.cameraBack );
	camera.position.x = cameraX;
	camera.position.y = cameraY;
	camera.position.z = cameraZ;

	// controls
	controls = new OrbitControls( camera, mainRenderer.domElement );
	//controls.autoRotate = true
	controls.update();
	controls.maxDistance = 3000;
	controls.minDistance = 500;

	// Ambient light
	lightAmbient = new THREE.AmbientLight(0x999999);
	scene.add( lightAmbient );

	// Directional light
	lightDirect = new THREE.DirectionalLight(0xffffff, 1);
	lightDirect.position.set(1, 1, 1);
	scene.add( lightDirect );

}

const deleteScene = function() {
	window.astroSearchIdCurrent = null;
	window.astroSearchIndex = [];
	window.astroSearchIdLookup = {};
	window.astroSearchIntersect = [];
	document.querySelector('[js-labels]').innerText = '';
	//document.querySelector('[js-bg]').innerText = '';
	document.querySelector('[js-main]').innerText = '';
	console.log( '%c%s', 'color:hsl(12, 79%, 96%);background:hsl(12, 77%, 43%);padding:0.2em 0', '⏣ DELETE SCENE' );
}

/*** INIT LOCATIONS ***/

const initFloors = function() {

	for (let i=0;i < window.astroConfig.floorCount; i++) {
		const floorNumber = i;
		floors[ floorNumber ] = {
			obj : new Floor( bgScene, scene, floorNumber, window.astroConfig.floorCount )
		};
	}
	console.log( 'initFloors', floors )

};

const initLocations = function() {

	console.log( 'initLocations', locations )

	for( const room in locations ) {
		const thisLocation = locations[ room ];
		thisLocation.obj = new Location( scene, thisLocation );
	};

};

const cameraZoom = function( cameraXFinal, cameraYFinal, cameraZFinal ) {
	
	// ease in the camera
	let   nextCameraX  = cameraXFinal;
	let   nextCameraY  = cameraYFinal;
	let   nextCameraZ  = cameraZFinal;
	if ( cameraZ !== cameraZFinal ) {
		nextCameraX = ( cameraXFinal - cameraX )/5 + cameraX;
		nextCameraY = ( cameraYFinal - cameraY )/5 + cameraY;
		nextCameraZ = ( cameraZFinal - cameraZ )/5 + cameraZ;
		if ( Math.abs( cameraZFinal - nextCameraZ ) < 50 ) { // snap to end
			nextCameraX = cameraXFinal;
			nextCameraY = cameraYFinal;
			nextCameraZ = cameraZFinal;
		}
		cameraX = nextCameraX;
		cameraY = nextCameraY;
		cameraZ = nextCameraZ;
		camera.position.set( cameraX, cameraY, cameraZ );
	}
}

const cameraZoomOut = function() {
	window.astroConfig.cameraX = window.astroConfig.cameraXDefault;
	window.astroConfig.cameraY = window.astroConfig.cameraYDefault;
	window.astroConfig.cameraZ = window.astroConfig.cameraZDefault;
	window.astroConfig.floorBaseline = window.astroConfig.floorBaselineDefault;
}
window.cameraZoomOut = cameraZoomOut;

/*** GET DATA ***/

initEvents();
initScene();
initFloors();
document.body.classList.add( 'ready' );
let   resizeTimeout = null;
//window.addEventListener( 'resize', () => {
//	clearTimeout( resizeTimeout );
//	resizeTimeout = setTimeout( () => {
//		deleteScene();
//		initScene();
//	}, resizeTimeout )
//} );

let  tap1 = null;
let  labels = false;
// window.addEventListener( 'touchstart', () => {
// 	if ( tap1 ) {
// 		labels = !labels;
// 		if ( labels ) {
// 			document.body.classList.add( 'see-labels' );
// 		} else {
// 			document.body.classList.remove( 'see-labels' );
// 		}
// 	} else {
// 		tap1 = performance.now();
// 		setTimeout( () => {
// 			tap1 = null;
// 		}, 200 );
// 	}
// } );
document.querySelector('[js-debug]').addEventListener( 'dblclick', () => {
	labels = !labels;
	if ( labels ) {
		document.body.classList.add( 'see-labels' );
	} else {
		document.body.classList.remove( 'see-labels' );
	}
} );
document.addEventListener( 'keydown', ev => {
	if ( ev.code === 'Escape' && window.astroConfig.cameraZ !== window.astroConfig.cameraZDefault ) {
		cameraZoomOut();
	}
} );


////// Render
const render = function() {

	for( const key in floors ) {
		const floor = floors[ key ];
		floor.obj.update();
	}
	for( const key in locations ) {
		const location = locations[ key ];
		location.obj.update();
	}
	  
	requestAnimationFrame( render );
	
	cameraZoom( window.astroConfig.cameraX, window.astroConfig.cameraY, window.astroConfig.cameraZ );
	//controls.update();
	
	//labelRenderer.render( scene, camera );
	//bgRenderer.render( bgScene, camera );
	mainRenderer.render( scene, camera );
	  
};

render();


// misc helpers

const visibleHeightAtZDepth = ( depth, camera ) => {
	// compensate for cameras not positioned at z=0
	const cameraOffset = camera.position.z;
	if ( depth < cameraOffset ) {
		depth -= cameraOffset;
	} else {
		depth += cameraOffset;
	}

	// vertical fov in radians
	const vFOV = camera.fov * Math.PI / 180; 

	// Math.abs to ensure the result is always positive
	return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};
const visibleWidthAtZDepth = ( depth, camera ) => {
	const height = visibleHeightAtZDepth( depth, camera );
	return height * camera.aspect;
};
console.log( 'size-canvas', window.innerWidth, window.innerHeight )
console.log( 'size-virtual', Math.round( visibleWidthAtZDepth( camera.position.z, camera ) ), Math.round( visibleHeightAtZDepth(  camera.position.z, camera ) ) )

