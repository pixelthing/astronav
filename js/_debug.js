'use strict';

import * as THREE 				        from "../lib/three.module.js";
import * as dat                         from "../lib/dat.gui.module.js";


const Debug = () => {

    var $ = window.astro;

    const init = () => {
        showDatum();
        initGUI();
        console.log( 'size-canvas', window.innerWidth, window.innerHeight )
        console.log( 'size-virtual', Math.round( visibleWidthAtZDepth( $.camera.position.z, $.camera ) ), Math.round( visibleHeightAtZDepth(  $.camera.position.z, $.camera ) ) )

    }

    // show the red pole that extends above and below the zero,zero,zero datum point of the scene
    const showDatum = () => {

        var location_geometry = new THREE.CylinderGeometry( 5, 5, 500, 10 );
        var location_material = new THREE.MeshStandardMaterial( { color: 0xFF0000 } );
        $.datum = new THREE.Mesh( location_geometry, location_material );
        $.datum.position.x = 0;
        $.datum.position.y = 0;
        $.datum.position.z = 0;
        $.datum.rotation.x = 0;
        $.datum.rotation.y = 0;
        $.datum.rotation.z = 0;
        $.scene.add( $.datum );
    }

    // add
    const initGUI = () => {
        const gui = new dat.GUI();

		const guiCamera = gui.addFolder('Camera')
		guiCamera.add($.camera.position,'x').name('position x').step(10)
		guiCamera.add($.camera.position,'y').name('position y').step(10)
		guiCamera.add($.camera.position,'z').name('position z').step(10)

		guiCamera.add($.camera.rotation,'x').name('rotate x').step(0.01)
		guiCamera.add($.camera.rotation,'y').name('rotate y').step(0.01)
		guiCamera.add($.camera.rotation,'z').name('rotate z').step(0.01)

		guiCamera.add($.camera,'far').name('far').step(10)
		guiCamera.add($.camera,'near').name('near').step(0.01)

		const guiDot = gui.addFolder('Datum')
		guiDot.add($.datum.position,'x').name('position x').step(1)
		guiDot.add($.datum.position,'y').name('position y').step(1)
		guiDot.add($.datum.position,'z').name('position z').step(1)

		guiDot.add($.datum.rotation,'x').name('rotate x').step(1).step(0.01)
		guiDot.add($.datum.rotation,'y').name('rotate y').step(1).step(0.01)
		guiDot.add($.datum.rotation,'z').name('rotate z').step(1).step(0.01)

    }

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

    return {
        init: init()
    }

}

export { Debug };