'use strict';

import * as THREE 				        from "../lib/three.module.js";
import { SVGLoader }                    from "../lib/threeSVGLoader.js";
import { CSS2DRenderer, CSS2DObject } 	from '../lib/CSS2DRenderer.js';

class Floor {

    // ADD TORUS (TORII??) TO BACKGROUND SCENE
    addGroupBg() {
        this.groupBg = new THREE.Object3D();
        this.groupBg.actorType = 'floorGroup';
        this.groupBg.position.x = 0;
        this.groupBg.position.y = ( this.containerH / this.floorCount * ( this.floorNo - window.astroConfig.floorBaseline ) ) ;
        this.groupBg.position.z = 0;
        this.groupBg.rotation.x = Math.PI * -0.5;
        this.groupBg.rotation.y = Math.PI;
        this.groupBg.rotation.z = Math.PI;
        this.scene.add( this.groupBg );
    }

    addDot() {
        var location_geometry = new THREE.CylinderGeometry( 5, 5, 50, 16 );
        var location_material = new THREE.MeshStandardMaterial( { color: 0xFF0000, shininess: 500 } );
        this.dot = new THREE.Mesh( location_geometry, location_material );
        this.dot.position.x = 0;
        this.dot.position.y = 0;
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
        this.groupFg.position.y = ( this.containerH / this.floorCount * ( this.floorNo - window.astroConfig.floorBaseline ) ) ;
        this.groupFg.position.z = 0;
        this.groupFg.rotation.x = Math.PI * -0.5;
        this.groupFg.rotation.y = 0;
        this.groupFg.rotation.z = 0;
        this.scene.add( this.groupFg );
    }

    addFloorBottom() {
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
                    console.log(path)
                    var material = new THREE.MeshPhongMaterial( {
                        color: path.color,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        opacity: 1
                    } );


                    const shapes = SVGLoader.createShapes( path );

                    for ( let j = 0; j < shapes.length; j ++ ) {
        
                        var extrudeSettings = {
                            steps: 1,
                            depth: window.astroConfig.floorThickness,
                            bevelEnabled : false
                        };
                        const shape = shapes[ j ];
                        //const geometry = new THREE.ShapeGeometry( shape );
                        const geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
                        const mesh = new THREE.Mesh( geometry, material );
                        this.groupBg.add( mesh );
        
                    }
                    // var shapes = path.toShapes( true );
                    // for ( var j = 0; j < shapes.length; j ++ ) {
                    //     var shape = shapes[ j ];
                    //     var extrudeSettings = {
                    //         steps: 1,
                    //         depth: window.astroConfig.floorThickness,
                    //         bevelEnabled : false
                    //     };
                    //     var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
                    //     this.floorBottom = new THREE.Mesh( geometry, material );
                    //     this.floorBottom.position.x = window.astroConfig.imgWidth * -0.5;
                    //     this.floorBottom.position.y = window.astroConfig.imgHeight * 0.5;
                    //     this.floorBottom.position.z = 0;
                    //     this.floorBottom.rotation.x = Math.PI;
                    //     this.floorBottom.rotation.y = 0;
                    //     this.floorBottom.rotation.z = 0;
                    //     this.groupBg.add( this.floorBottom );
                    // }
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
        this.groupFg.add( this.label );
    }

    update() {
        // ease floor transitions
        const floorFinalPos = ( this.containerH / window.astroConfig.floorCount * ( this.floorNo - window.astroConfig.floorBaseline ) );
        let   nextPos  = floorFinalPos;
        if ( this.groupBg.position.y !== floorFinalPos ) {
            nextPos = ( floorFinalPos - this.groupBg.position.y )/window.astroConfig.animationSpeed + this.groupBg.position.y;
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
        this.containerH = window.astroConfig.imgHeight * window.astroConfig.floorSpacing;
        this.groupBg    = null;
        this.groupFg    = null;
        this.floor      = null;
        this.label      = null;
        this.addGroupBg( );
        this.addFloorBottom( );
        this.addGroupFg( );
        //this.addLabel( );
        if ( window.astroConfig.showLocations ) {
            this.addDot( );
        }
    }
}

export { Floor };