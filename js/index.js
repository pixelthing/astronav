'use strict';

import { Render }						from './_render.js';
import { RenderFloors }					from './_render_floors.js';
import { Debug }						from './_debug.js';
import { ReadData }						from './_read_data.js';
import { Search }    					from './_search.js';

// Config

window.astro			= {

	winWidth			: innerWidth,
	winHeight			: innerHeight,

	camera				: null,
	scene				: null,
	bgScene				: null,
	controls			: null,
	sceneRenderer		: null,
	labelRenderer		: null,
	
	floorBaselineDefault: 3.5,
	floorBaseline		: 0,
	floorCount			: 3,
	floorSpacingInitial	: 0.3,
	floorSpacingDefault	: 0.6,
	floorThickness		: 5,
	wallHeight			: -30,
	doorHeight			: -25,
    
    animationSpeed      : 10,

	groupRotate			: 0.003,
	imgWidth 			: 990,
	imgHeight 			: 456,

	cameraFov 			: 40,
	cameraPosXDefault 	: 0,
	cameraPosYDefault 	: 650,	// along with the RotX, this creates the "look down" effect
	cameraPosZDefault 	: 1800,	// how close the building is to the camera
	cameraRotXDefault 	: -0.5,	// along with the PosY, this creates the "look down" effect
	cameraRotYDefault 	: 0,
	cameraRotZDefault 	: 0,
	cameraFore 			: 0.1,	// frostrum
	cameraBack 			: 4000,	// frostrum

	buildingYawDefault	: Math.PI * 1.1, // the twist around the Y on all the floors (starting position)

	orbitControlsMaxDist: 3000,
	orbitControlsMinDist: 500,


}

// calcs and defaults
window.astro.winAspect		= window.astro.winWidth / window.astro.winHeight;
window.astro.unit			= window.astro.imgWidth / 40;
window.astro.cameraPosX		= window.astro.cameraPosXDefault;
window.astro.cameraPosY		= window.astro.cameraPosYDefault;
window.astro.cameraPosZ		= window.astro.cameraPosZDefault;
window.astro.cameraRotX		= window.astro.cameraRotXDefault;
window.astro.cameraRotY		= window.astro.cameraRotYDefault;
window.astro.cameraRotZ		= window.astro.cameraRotZDefault;
window.astro.floorSpacing 	= window.astro.floorSpacingInitial;
window.astro.buildingYaw 	= window.astro.buildingYawDefault;


/*** RUN APP ***/

Render();
RenderFloors();
ReadData();
Search();
Debug();	// comment out when in production

