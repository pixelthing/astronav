'use strict';

import * as THREE 				        from "../lib/three.module.js";
import { SVGLoader }                    from "../lib/threeSVGLoader.js";
import { CSS2DRenderer, CSS2DObject } 	from '../lib/CSS2DRenderer.js';

class Floor {

    // add a group to contain the floor and any children of the floor
    addgroup() {
        
        this.group = new THREE.Object3D();
        this.group.actorType = 'floorGroup';
        this.group.position.x = (window.astro.imgWidth / 3) * -1; // move whole floor half a width from the center
        this.group.position.y = this.calcFloorY(true); // calc the Y pos of the floor (the TRUE means no easing into position, go there direct)
        this.group.position.z = (window.astro.imgWidth / 2) * -1; // move whole floor half a depth from the center;
        this.group.rotation.x = Math.PI * -0.5; // otherwise the floors would be vertical to the camera, not side on
        this.group.rotation.y = Math.PI; // otherwise the floors would be upside down (this is why we are working in the negative Y axis)
        this.group.rotation.z = window.astro.buildingYaw; // otherwise the floors would be off to the left (ok, don't understand this)
        window.astro.scene.add( this.group );
    }

    // ADD LABELS TO FOREGROUND SCENE
    // addGroupFg() {
    //     this.groupFg = new THREE.Object3D();
    //     this.groupFg.position.x = 0;
    //     this.groupFg.position.y = ( this.containerH / this.floorCount * ( this.floorNo - window.astro.floorBaseline ) ) ;
    //     this.groupFg.position.z = 0;
    //     this.groupFg.rotation.x = Math.PI * -0.5;
    //     this.groupFg.rotation.y = 0;
    //     this.groupFg.rotation.z = 0;
    //     this.scene.add( this.groupFg );
    // }

    addFloor() {
        var loader = new SVGLoader();
        loader.load(
            // resource URL
            `img/PSHQ0${ this.floorNo }.svg`,
            // called when the resource is loaded
            data => {
                const paths = data.paths;
                const floorBottom = new THREE.Group();
                for ( var i = 0; i < paths.length; i ++ ) {
                    var path = paths[ i ];
                    //console.log(path)
                    var material = new THREE.MeshPhongMaterial( {
                        color: path.color,
                        side: THREE.DoubleSide,
                        depthWrite: true,
                        opacity: 1
                    } );

                    const shapes = SVGLoader.createShapes( path );

                    for ( let j = 0; j < shapes.length; j ++ ) {
                        const shape = shapes[ j ];
                        //console.log('**' + this.floorNo,path.userData.node)
                        let thickness;
                        if (path.userData.node.classList.contains('floor')) {
                            thickness = window.astro.floorThickness;
                        } else if (path.userData.node.classList.contains('door')) {
                            thickness = window.astro.doorHeight;
                        } else if (path.userData.node.classList.contains('gate')) {
                            thickness = window.astro.doorHeight;
                        } else {
                            thickness = window.astro.wallHeight;
                        }
                        var extrudeSettings = {
                            steps: 1,
                            depth: thickness,
                            bevelEnabled : true
                        };
                        //const geometry = new THREE.ShapeGeometry( shape );
                        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
                        const mesh = new THREE.Mesh( geometry, material );
                        //mesh.castShadow = true; //default is false
                        //mesh.receiveShadow = true; //default
                        this.group.add( mesh );
        
                    }
                }
            },
            // called when loading is in progresses
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
    }

    addLabel() {
        var labelDiv = document.createElement( 'div' );
        labelDiv.className = 'floor-label floor-label--' + this.floorNo;
        labelDiv.textContent = `v${this.floorNo}`;
        labelDiv.style.marginTop = '-0.5em';
        this.label = new CSS2DObject( labelDiv );
        this.label.position.set( 0, 0, 200 );
        //this.groupFg.add( this.label );
    }

    calcFloorY(noEasing) {

        // calc the vertical position of this floor, relative to the "middle" floor, 
        // so that floor above the mid-point extend up and floors below, extend down
        // note the -1, otherwise the floors would be the wrong way around, with ground floor on the top
        var relative2Middle = -1 * (((window.astro.floorCount - 1)/2) - this.floorNo);

        // floor spacing is configured in relative numbers, so calc the actual spacing between floors (current, as it changes)
        var floorSpacingActual = window.astro.imgHeight * window.astro.floorSpacing;
        //this.containerH = window.astro.imgHeight * window.astro.floorSpacing;
        
        // now we have the floor spasing the and the relative position, calc the final Y value
        const floorFinalPos = floorSpacingActual * relative2Middle;

        // but if the floor is currently not AT that final position, ease it into place
        let   newPos  = floorFinalPos;
        if ( !noEasing && this.group.position.y !== floorFinalPos ) {
            newPos = ( floorFinalPos - this.group.position.y )/window.astro.animationSpeed + this.group.position.y;
            // set a minimum distance where it snaps into place (otherwise the animation would go on for a very long time)
            if ( Math.abs( floorFinalPos - newPos ) < 1 ) { 
                newPos = floorFinalPos;
            }
        }

        return newPos;

    }

    update() {

        this.group.position.y = this.calcFloorY(); // calc the Y pos of the floor (and ease into it)
    }

    highlight( roomsToHighlight ) {

        console.log(`FLOOR ${ this.floorNo } highlighting`,roomsToHighlight)

    }

    highlightClear() {

        console.log(`FLOOR ${ this.floorNo } highlighting removed`)

    }

    constructor( floorNo ) {
        this.floorNo    = floorNo;
        this.group      = null;
        //this.groupFg    = null;
        //this.label      = null;
        this.addgroup( );
        this.addFloor( );
        //this.addGroupFg( );
        //this.addLabel( );
    }
}

export { Floor };