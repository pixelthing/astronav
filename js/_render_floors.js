'use strict';

import { Floor }						from './_render_floor.js';

const RenderFloors = () => {

    var $ = window.astro;

    const init = () => {
        initFloors();
        renderFrame();
        registerEvents();
    }


    const initFloors = () => {

        if (!$.floors) {
            $.floors = {};
        }
    
        // for each floor
        for (let i=0;i < $.floorCount; i++) {
            const floorNumber = i;
            // create a new instance of the class "Floor"
            $.floors[ floorNumber ] = {
                obj : new Floor( floorNumber )
            };
        }
        console.log( 'initFloors', $.floors )
    
    };

    // update all aspects of the floors (position, rooms) every frame
    const renderFrame = () => {

        // for each floor
        for( const key in $.floors ) {
           const floor = $.floors[ key ];
           // update
           floor.obj.update();
        }
        
        // ...next frame
        requestAnimationFrame( renderFrame );
    }

    const registerEvents = () => {

        // when the search is telling us to highlight some rooms
        window.addEventListener('highlight', ev => {
            console.log('EVENT RECEIVED - highlight rooms');
            // for each room highlighted
            const rooms = ev.detail;
            const floorMessages = [];
            rooms.forEach( roomName => {
                // get all details from the dictionary
                const roomDict = $.dict[roomName];
                // split all the floors into their different floors (because we'll be sending messages to each floor)
                if (!floorMessages[roomDict.floor]) {
                    floorMessages[roomDict.floor] = [roomDict];
                } else {
                    floorMessages[roomDict.floor].push(roomDict);
                }
            });
            // send each effected floor a list of rooms to highlight
            floorMessages.forEach( (roomsToHighlight, i) => {
                $.floors[ i ].obj.highlight(roomsToHighlight);
            } );

        },false);

        // when the search is telling us to clear all hughlights
        window.addEventListener('removeHighlight', ev => {

            console.log('EVENT RECEIVED - clear highlights');
            // for each floor
            for( const key in $.floors ) {
                const floor = $.floors[ key ];
                // removeHighlight
                floor.obj.highlightClear();
            }
        },false);

    }

    return {
        init: init()
    }

}

export { RenderFloors };