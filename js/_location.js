'use strict';


import * as THREE 					    from "../lib/three.module.js";

class Location {

    getRandomArbitrary( min, max ) {
        return Math.random() * (max - min) + min;
    }

    addFloor() {
        this.floor = new THREE.Object3D();
        this.floor.actorType = 'locationFloor';
        this.floor.position.x = window.astro.imgWidth * -1;
        this.floor.position.y = ( this.containerH / window.astro.floorCount * ( this.floorNo - window.astro.floorBaseline ) ) ;
        this.floor.position.z = window.astro.imgHeight * -0.5;
        this.floor.rotation.x = 0;
        this.floorapp.rotation.y = 0;
        this.floor.rotation.z = 0;
        this.scene.add( this.floor );
    }

    addRoom() {
        const locationDesc = window.astro.locations[ this.roomRaw ];
        this.room = new THREE.Object3D();
        this.room.position.x = window.astro.imgWidth;
        this.room.position.y = 0;
        // check for room position on this floor
        if ( locationDesc ) {
            this.room.position.x = ( locationDesc[ 0 ] * window.astro.imgWidth ) + window.astro.imgWidth/2;
            this.room.position.y = 0;
            this.room.position.z = ( locationDesc[ 1 ] * window.astro.imgHeight );
        } else {
            this.room.position.x = window.astro.imgWidth;
            this.room.position.y = 0;
            this.room.position.y = 0;
        }
        this.room.rotation.x = 0;
        this.room.rotation.y = 0;
        this.room.rotation.z = 0 ;
        this.floor.add( this.room );

        this.x = this.room.position.x;
        this.y = this.room.position.y;
        this.z = this.room.position.z;
    }

    addDot() {
        var location_geometry = new THREE.CylinderGeometry( 5, 5, 100, 16 );
        var location_material = new THREE.MeshStandardMaterial( { color: 0x0556a1, shininess: 500 } );
        this.dot = new THREE.Mesh( location_geometry, location_material );
        this.dot.position.x = 0;
        this.dot.position.y = 50;
        this.dot.position.z = 0;
        this.dot.rotation.x = 0;
        this.dot.rotation.y = 0;
        this.dot.rotation.z = 0;
        if ( window.astro.showLocations ) {
            this.room.add( this.dot );
        }
    }

    addLabel() {
        var labelDiv = document.createElement( 'div' );
        labelDiv.className = 'location-label location-label--' + this.floorNo;
        labelDiv.textContent = this.roomRaw;
        //this.label = new CSS2DObject( labelDiv );
        //this.label.position.set( 0, window.astro.unit*2, 0 );
        //this.dot.add( this.label );
    }

    update() {
        // ease floor transitions
        const floorFinalPos = ( this.containerH / window.astro.floorCount * ( this.floorNo - window.astro.floorBaseline ) );
        let   nextPos  = floorFinalPos;
        if ( this.floor.position.y !== floorFinalPos ) {
            nextPos = ( floorFinalPos - this.floor.position.y )/window.astro.animationSpeed + this.floor.position.y;
            if ( Math.abs( floorFinalPos - nextPos ) < 10 ) {
                nextPos = floorFinalPos;
            }
        }
        this.floor.position.y = nextPos;
    }

    constructor( scene, location ) {
        this.scene      = scene;
        this.roomRaw    = location.room;
        this.floorNo    = parseInt( this.roomRaw.substr( 0, 1 ));
        this.roomNo     = parseInt( this.roomRaw.substr( 1 ));
        this.containerH = window.astro.imgHeight * window.astro.floorSpacing;
        this.floor      = null;
        this.room       = null;
        this.dot        = null;
        this.label      = null;
        this.addFloor( );
        this.addRoom( );
        this.addDot( );
        if ( window.astro.showLocations ) {
            this.addLabel( );
        }
    }
}

export { Location };