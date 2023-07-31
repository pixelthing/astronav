'use strict';

import * as THREE 				        from '../lib/three.module.js';
import { OrbitControls }                from '../lib/threeOrbitControls.js';
import { CSS2DRenderer, CSS2DObject } 	from '../lib/CSS2DRenderer.js';

const Render = () => {

    var $ = window.astro;

    const init = () => {
        initRenderer();
        initCamera();
        initLight();
        initOrbit();
        loadingAnimation();
        renderFrame();
    }

    const initRenderer = () => {

        // label renderer
        // $.labelRenderer = new CSS2DRenderer();
        // $.labelRenderer.setSize( $.winWidth, $.winHeight );
        // document.querySelector('[js-labels]').appendChild( $.labelRenderer.domElement );

        // Main Renderer
        $.sceneRenderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
        $.sceneRenderer.setPixelRatio( window.devicePixelRatio );
        $.sceneRenderer.setSize( $.winWidth, $.winHeight );
        //sceneRenderer.shadowMap.enabled = true;
        //sceneRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.querySelector('[js-main]').appendChild( $.sceneRenderer.domElement );

        // Scenes
        $.scene = new THREE.Scene();
        $.bgScene = new THREE.Scene();

    }

    const initCamera = () => {

        $.camera = new THREE.PerspectiveCamera( 
            $.cameraFov, 
            $.winAspect, 
            $.cameraFore, 
            $.cameraBack 
        );
        $.camera.position.x = $.cameraPosX;
        $.camera.position.y = $.cameraPosY;
        $.camera.position.z = $.cameraPosZ;

        $.camera.rotation.x = $.cameraRotX;
        $.camera.rotation.y = $.cameraRotY;
        $.camera.rotation.z = $.cameraRotZ;
    }

    const initLight = () => {

        // Ambient light
        var lightAmbient = new THREE.AmbientLight(0x999999);
        $.scene.add( lightAmbient );
    
        // Directional light
        var lightDirect = new THREE.DirectionalLight(0xffffff, 0.5);
        lightDirect.position.set(1 * $.imgHeight, 1 * $.imgHeight, 1 * $.imgHeight);
        //lightDirect.castShadow = true;
        $.scene.add( lightDirect );
    
        // point light
        var lightPoint = new THREE.PointLight(0xFFFFFF, 0.8);
        lightPoint.position.set(-3 * $.imgHeight, 4 * $.imgHeight, 1 * $.imgHeight);
        //lightPoint.castShadow = true;
        $.scene.add( lightPoint );
    
        //Set up shadow properties for the light
        // lightPoint.shadow.mapSize.width = 512; // default
        // lightPoint.shadow.mapSize.height = 512; // default
        // lightPoint.shadow.camera.near = 0.5; // default
        // lightPoint.shadow.camera.far = 500; // default

    }

    // start up the ability to drag the scene around
    const initOrbit = () => {

        $.controls = new OrbitControls( $.camera, $.sceneRenderer.domElement );
        //controls.autoRotate = true;

        $.controls.update();
        $.controls.maxDistance = $.orbitControlsMaxDist;
        $.controls.minDistance = $.orbitControlsMinDist;
    }

    const cameraZoom = function( cameraXFinal, cameraYFinal, cameraZFinal ) {
	
        // ease in the camera
        let   nextCameraX  = cameraXFinal;
        let   nextCameraY  = cameraYFinal;
        let   nextCameraZ  = cameraZFinal;
        if ( $.cameraZ !== cameraZFinal ) {
            nextCameraX = ( cameraXFinal - cameraX )/5 + $.cameraX;
            nextCameraY = ( cameraYFinal - cameraY )/5 + $.cameraY;
            nextCameraZ = ( cameraZFinal - cameraZ )/5 + $.cameraZ;
            if ( Math.abs( cameraZFinal - nextCameraZ ) < 50 ) { // snap to end
                nextCameraX = cameraXFinal;
                nextCameraY = cameraYFinal;
                nextCameraZ = cameraZFinal;
            }
            $.cameraX = nextCameraX;
            $.cameraY = nextCameraY;
            $.cameraZ = nextCameraZ;
            $.camera.position.set( $.cameraX, $.cameraY, $.cameraZ );
        }
    }
    
    const cameraZoomOut = function() {
        $.floorBaseline = $.floorBaselineDefault;
        cameraZoom($.cameraPosXDefault, $.cameraPosYDefault, $.cameraPosZDefault)
        // $.cameraX = $.cameraPosXDefault;
        // $.cameraY = $.cameraPosYDefault;
        // $.cameraZ = $.cameraPosZDefault;
    }

    // render each frame with any updates
    const renderFrame = () => {
        
        cameraZoom( $.cameraX, $.cameraY, $.cameraZ );
        //controls.update();
        
        //labelRenderer.render( scene, camera );
        //$.bgRenderer.render( $.bgScene, $.camera );
        $.sceneRenderer.render( $.scene, $.camera );
        
        // ...next frame
        requestAnimationFrame( renderFrame );
    }

    // start-up animation, expanding the floors and reveal the search field
    const loadingAnimation = () => {

        setTimeout(() => {
            $.floorSpacing = $.floorSpacingDefault;
            document.body.classList.add( 'ready' );
            document.querySelector('[js-search-input]').focus();
        },800)
    }

    return {
        init: init(),
        cameraZoomOut
    }

}

export { Render };