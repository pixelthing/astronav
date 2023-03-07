'use strict';

import * as THREE 				        from "../lib/three.module.js";

class Floor {

    // ADD TORUS (TORII??) TO BACKGROUND SCENE
    addGroupBg() {
        this.groupBg = new THREE.Object3D();
        this.groupBg.actorType = 'floorGroup';
        this.groupBg.position.x = 0;
        this.groupBg.position.y = ( this.containerH / this.floorCount * ( this.floorNo - window.lolConfig.floorBaseline ) ) ;
        this.groupBg.position.z = 0;
        this.groupBg.rotation.x = Math.PI * -0.5;
        this.groupBg.rotation.y = 0;
        this.groupBg.rotation.z = 0;
        this.scene.add( this.groupBg );
    }

    addDot() {
        var location_geometry = new THREE.CylinderGeometry( 5, 5, 50, 16 );
        var location_material = new THREE.MeshStandardMaterial( { color: 0xFF0000, shininess: 500 } );
        this.dot = new THREE.Mesh( location_geometry, location_material );
        this.dot.position.x = 0;
        this.dot.position.y = 25;
        this.dot.position.z = 0;
        this.dot.rotation.x = Math.PI * -0.5;
        this.dot.rotation.y = 0;
        this.dot.rotation.z = 0;
        this.groupBg.add( this.dot );
    }

    // ADD LABELS TO FOREGROUND SCENE
    addGroupFg() {
        this.groupFg = new THREE.Object3D();
        this.groupFg.position.x = 0;
        this.groupFg.position.y = ( this.containerH / this.floorCount * ( this.floorNo - window.lolConfig.floorBaseline ) ) ;
        this.groupFg.position.z = 0;
        this.groupFg.rotation.x = Math.PI * -0.5;
        this.groupFg.rotation.y = 0;
        this.groupFg.rotation.z = 0;
        this.scene.add( this.groupFg );
    }

    addFloor() {
        var loader          = new THREE.TextureLoader();
        var floor_geometry  = new THREE.PlaneGeometry( window.lolConfig.imgWidth, window.lolConfig.imgHeight );
        var floor_material  = new THREE.MeshPhongMaterial( { 
            map: loader.load(`img/v${ this.floorNo }.png`),
            side: THREE.DoubleSide,
            transparent: true
        } );
        this.floor = new THREE.Mesh( floor_geometry, floor_material );
        this.floor.position.x = 0;
        this.floor.position.y = 0;
        this.floor.position.z = 2;
        this.floor.rotation.x = 0;
        this.floor.rotation.y = 0;
        this.floor.rotation.z = 0;
        this.groupBg.add( this.floor );
    }

    addFloorBottom() {
        var loader          = new THREE.SVGLoader();
        loader.load(
            // resource URL
            `img/v${ this.floorNo }.svg`,
            // called when the resource is loaded
            data => {
                var paths = data.paths;
                for ( var i = 0; i < paths.length; i ++ ) {
                    var path = paths[ i ];
                    var material = new THREE.MeshBasicMaterial( {
                        color: 0xffffff,
                        side: THREE.DoubleSide,
                        opacity: 0.5,
                    } );
                    var shapes = path.toShapes( true );
                    for ( var j = 0; j < shapes.length; j ++ ) {
                        var shape = shapes[ j ];
                        var extrudeSettings = {
                            steps: 1,
                            depth: window.lolConfig.floorThickness,
                            bevelEnabled : false
                        };
                        var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
                        this.floorBottom = new THREE.Mesh( geometry, material );
                        this.floorBottom.position.x = window.lolConfig.imgWidth * -0.5;
                        this.floorBottom.position.y = window.lolConfig.imgHeight * 0.5;
                        this.floorBottom.position.z = 0;
                        this.floorBottom.rotation.x = Math.PI;
                        this.floorBottom.rotation.y = 0;
                        this.floorBottom.rotation.z = 0;
                        this.groupBg.add( this.floorBottom );
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
        //labelDiv.style.marginTop = '-0.5em';
        //this.label = new CSS2DObject( labelDiv );
        //this.label.position.set( 0, 0, 200 );
        //this.groupFg.add( this.label );
    }

    update() {
        // ease floor transitions
        const floorFinalPos = ( this.containerH / window.lolConfig.floorCount * ( this.floorNo - window.lolConfig.floorBaseline ) );
        let   nextPos  = floorFinalPos;
        if ( this.groupBg.position.y !== floorFinalPos ) {
            nextPos = ( floorFinalPos - this.groupBg.position.y )/window.lolConfig.animationSpeed + this.groupBg.position.y;
            if ( Math.abs( floorFinalPos - nextPos ) < 10 ) {
                nextPos = floorFinalPos;
            }
        }
        this.groupBg.position.y = nextPos;
        this.groupFg.position.y = nextPos;
    }

    constructor( bgScene, scene, floorNo, floorCount ) {
        this.scene    = scene;
        this.bgScene    = bgScene;
        this.floorNo    = floorNo;
        this.floorCount = floorCount;
        this.containerH = window.lolConfig.imgHeight * window.lolConfig.floorSpacing;
        this.groupBg    = null;
        this.groupFg    = null;
        this.floor      = null;
        this.label      = null;
        this.addGroupBg( );
        this.addGroupFg( );
        this.addFloorBottom( );
        this.addFloor( );
        this.addLabel( );
        if ( window.lolConfig.showLocations ) {
            this.addDot( );
        }
    }
}

export { Floor };