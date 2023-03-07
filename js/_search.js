const Search = function( ) {

    const init = function() {
        registerEventListers();
        document.querySelector('[js-search-input]').focus();
    }

    const registerEventListers = function() {
        document.querySelector('[js-search-close]').addEventListener('click', close);
        document.querySelector('[js-search-open]').addEventListener('click', open);
        document.querySelector('[js-search-input]').addEventListener('keyup', query);
        document.querySelector('[js-search-input]').addEventListener('search', query);
        document.querySelector('[js-search-input]').addEventListener('search', query);
        document.querySelector('[js-search-some]').addEventListener('click', identityClick );
        document.addEventListener('keydown', keyStrokes);
    }

    const close = function() {
        document.body.classList.add( 'search--close' );
    }

    const open = function() {
        window.cameraZoomOut();
        document.body.classList.remove( 'search--close' );
        document.querySelector('[js-search-input]').focus();
        document.querySelector('[js-search-input]').select();
    }

    const keyStrokes = function ( ev ) {
        // only if the autocomplete dropdown is visible
        if ( !document.body.classList.contains('search--close') && document.querySelectorAll('[js-search-item]').length ) {
            // tab when currently focused on the last item in the autocomplete list
            if ( ev.code === 'Tab' && document.activeElement === document.querySelector('[js-search-item]:last-child') ) {
                ev.preventDefault();
                document.querySelector('[js-search-input]').focus();
            // arrow down
            } else if ( ev.code === 'ArrowDown' ) {
                // currently focused on the last autocomplete list item
                if ( document.activeElement === document.querySelector('[js-search-item]:last-child') ) {
                    ev.preventDefault();
                    document.querySelector('[js-search-input]').focus();
                // currently focused on any OTHER autocomplete list item
                } else if ( document.activeElement.classList.contains('search__auto__item') ) {
                    ev.preventDefault();
                    document.activeElement.nextSibling.focus();
                // currently focused on the input
                } else if ( document.activeElement === document.querySelector('[js-search-input]') ) {
                    ev.preventDefault();
                    document.querySelector('[js-search-item]:first-child').focus();
                }
            // arrow up
            } else if ( ev.code === 'ArrowUp' ) {
                // currently focused on the last autocomplete list item
                if ( document.activeElement === document.querySelector('[js-search-item]:first-child') ) {
                    ev.preventDefault();
                    document.querySelector('[js-search-input]').focus();
                // currently focused on any OTHER autocomplete list item
                } else if ( document.activeElement.classList.contains('search__auto__item') ) {
                    ev.preventDefault();
                    document.activeElement.previousSibling.focus();
                // currently focused on the input
                } else if ( document.activeElement === document.querySelector('[js-search-input]') ) {
                    ev.preventDefault();
                    document.querySelector('[js-search-item]:last-child').focus();
                }
            // hit enter
            } else if ( ev.code === 'Enter' ) {
                // currently focused on any autocomplete list item
                if ( document.activeElement.classList.contains('search__auto__item') ) {
                    ev.preventDefault();
                    identityClick( false, document.activeElement );
                // currently focused on the input
                } else if ( document.activeElement === document.querySelector('[js-search-input]') && document.querySelectorAll('[js-search-item]').length === 1 ) {
                    ev.preventDefault();
                    // double RAF so the identity click happens after the autocomplete fires (race condition that set the astroSearchIdCurrent as null after it's set as the correct user)
                    window.requestAnimationFrame( () => {
                        window.requestAnimationFrame( () => {
                            identityClick( false, document.querySelector('[js-search-item]') );
                        });
                    });
                } 
            }
        // typing a name
        } else if ( ev.code.substr( 0, 3 ) === 'Key' ) {
            // if we start typing a name and the search is closed, open it and start entering the typing
            if ( document.body.classList.contains('search--close') ) {
                document.querySelector('[js-search-input]').value = '';
                document.querySelector('[js-search-input]').focus();
                open();
            }
        // close search with esc
        } else if ( ev.code === 'Escape' ) {
            // if we start typing a name and the search is closed, open it and start entering the typing
            if ( !document.body.classList.contains('search--close') ) {
                close();
            }
        }
        
    }

    const indexDevice = function( deviceData ) {
        const idArray = deviceData.identity.split('.');
        const identity = deviceData.identity.toLowerCase();

        const firstName = idArray[0];
        const lastName  = idArray[1];
        // create list if search indexes for name
        const indexes100 = [];
        const indexes10 = [];
        indexes100.push( firstName + ( lastName ? ' ' + lastName : '' ) );
        indexes100.push( firstName + ( lastName ? '.' + lastName : '' ) );
        indexes10.push( firstName );
        indexes10.push( lastName );
        // discover indexes of first name
        const indexesFirst = [];
        const firstNameArray = firstName.split('');
        let   base = '';
        firstNameArray.forEach( ( el, i ) => {
            base += el;
            if ( i > 1 && i < firstName.length ) {
                indexesFirst.push( base );
            }
        } );
        // discover indexes of first (and full) name
        const indexesLast = [];
        const indexesFull = [];
        if ( idArray[1] ) {
            const lastNameArray = lastName.split('');
            base = '';
            lastNameArray.forEach( ( el, i ) => {
                base += el;
                if ( i > 1 && i < lastName.length ) {
                    indexesLast.push( base );
                    indexesFull.push( firstName + '.' +base );
                    indexesFull.push( firstName + ' ' +base );
                }
            } );
        }
        // add the newly discovered indexes with scores to the search index;
        indexes100.forEach( d => {
            window.astroSearchIndex.push( {
                keyword : d,
                score   : 100,
                identity: identity
    
            } );
            window.astroSearchIntersect.push( d );
        } );
        indexesFull.forEach( ( d, i ) => {
            window.astroSearchIndex.push( {
                keyword : d,
                score   : 50 + ( i*2 ),
                identity: identity
    
            } );
            window.astroSearchIntersect.push( d );
        } );
        indexes10.forEach( ( d, i ) => {
            window.astroSearchIndex.push( {
                keyword : d,
                score   : 10,
                identity: identity
    
            } );
            window.astroSearchIntersect.push( d );
        } );
        indexesFirst.forEach( ( d, i ) => {
            window.astroSearchIndex.push( {
                keyword : d,
                score   : i + 1,
                identity: identity
    
            } );
            window.astroSearchIntersect.push( d );
        } );
        indexesLast.forEach( ( d, i ) => {
            window.astroSearchIndex.push( {
                keyword : d,
                score   : i + 1,
                identity: identity    
            } );
            window.astroSearchIntersect.push( d );
        } );
        

    }

    const query = function() {

        let keyword = document.querySelector('[js-search-input]').value;
        keyword = latinize( keyword );
        if ( keyword.length < 3 ) {
            foundClear();
            return;
        }
        const intersectsFound = window.astroSearchIntersect.flatMap(( d, i) => d === keyword ? i : []);

        if ( intersectsFound.length ) {
            foundSome( intersectsFound );
            return;
        } else {
            foundNone();
            return;
        }
        
    }
    const compare = function (a, b) {
        if (a > b) return -1;
        if (b > a) return 1;
      
        return 0;
      }

    const foundSome = function( intersectsFound ) {
        window.astroSearchIdCurrent = null;
        identityDeLabel();
        document.querySelector('[js-search-some]').innerText = '';
        document.body.classList.add('search--some');
        document.body.classList.remove('search--none');
        // sort
        let   indexesFound = intersectsFound.map( ( d, i ) => {
            return window.astroSearchIndex[ d ];
        } );
        indexesFound.sort( compare );
        // remove duplicates
        const indexesMarked = [];
        indexesFound = indexesFound.filter( d => {
            if ( indexesMarked.indexOf( d.identity ) < 0 ) {
                indexesMarked.push( d.identity );
                return true;
            }
        } );
        // print
        const $list = document.querySelector('[js-search-some]');
        indexesFound.forEach( ( d, i ) => {
            var item = document.createElement("button");
            item.classList.add('search__auto__item');
            item.setAttribute('js-search-item', '');
            item.setAttribute('identity',d.identity);
            item.innerText = d.identity;
            $list.appendChild( item );
        } );
    }

    const foundNone = function() {
        window.astroSearchIdCurrent = null;
        identityDeLabel();
        document.querySelector('[js-search-some]').innerText = '';
        document.body.classList.remove('search--some');
        document.body.classList.add('search--none');
    }

    const foundClear = function() {
        window.astroSearchIdCurrent = null;
        identityDeLabel();
        document.querySelector('[js-search-some]').innerText = '';
        document.body.classList.remove('search--some');
        document.body.classList.remove('search--none');
    }

    const identityClick = function ( ev, el ) {
        // delegate event
        if (ev.target && ev.target.matches("[js-search-item]")) {
            identitySelect( ev.target.getAttribute('identity') );
        } else if ( el ) {
            identitySelect( el.getAttribute('identity') );
        }
    }

    const identitySelect = function( identity ) {
        window.astroSearchIdCurrent = null;
        identityDeLabel();
        window.astroConfig.floorBaseline = 3.5;
        // setTimeout to make sure any existing selections get time to clear before the new selection is marked
        setTimeout( () => {
            // set the identity to focus on
            window.astroSearchIdCurrent = identity;
            identityLabel( identity );
            idendityZoom( identity );
            close();
        }, 500 );
    }

    const identityDeLabel = function( ) {
        // remove old flags
        document.querySelectorAll( '.device__label' ).forEach( $el => {
            $el.classList.remove('device__label--active');
        } );
    }

    const identityLabel = function( identity ) {

        // remove old flags
        identityDeLabel();
        // flag labels
        document.querySelectorAll( `.device__label[identity="${identity}"]` ).forEach( $el => {
            $el.classList.add('device__label--active');
        } );
    }

    const idendityZoom = function( identity ) {
        
        // set the floor to focus on
        let   floors = [];
        let   rooms = [];
        // unique
        floors = [...new Set( floors ) ];
        rooms = [...new Set( rooms ) ];

        // zoom coefficient (to deal with screens of different aspects)
        const zoomCoef = window.innerHeight/window.innerWidth;

        // if devices are spread over several floors, zoom out to see them all
        if ( floors.length > 1 ) {
            floors.sort();
            const floorMin = floors[0];
            const floorMax = floors[ floors.length - 1 ];
            const floorBetween = ( floorMax - floorMin )/2 + floorMin;
            window.astroConfig.cameraY = window.astroConfig.cameraYDefault;
            window.astroConfig.cameraZ = 2000 * zoomCoef;
            window.astroConfig.cameraX = 0;
            window.astroConfig.floorBaseline = floorBetween + 0.75;
        // if the devices are spread over several rooms in one floor, manage the zoom level to see the whole floor
        } else if ( rooms.length > 1 ) {
            window.astroConfig.floorBaseline = parseInt( floors[0] ) + 0.75;
            window.astroConfig.cameraZ = 2000 * zoomCoef;
            window.astroConfig.cameraX = 0;
        // else zoom in on location
        } else {
            const roomX = window.astroConfig.locations[ rooms[0] ][ 0 ];
            if ( parseInt( rooms[0] ) < 5 ) {
                window.astroConfig.cameraZ = 500 * zoomCoef;
                window.astroConfig.floorBaseline = parseInt( floors[0] ) + 0.85;
            } else {
                window.astroConfig.cameraZ = 1500 * zoomCoef;
                window.astroConfig.floorBaseline = parseInt( floors[0] ) + 0.75;
            }
            window.astroConfig.cameraX = 0 + ( ( roomX - 0.5 ) * window.astroConfig.imgWidth * 1.5 );
        }

    }

    // take text that includes non-english chars, replace with english eqiv - and lower case (eg Mölnlycke => molnlycke)
    const latinize = function( nonLatin ) {

        let  text = nonLatin.toString().toLowerCase().trim();

        const sets = [
            {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]'},
            {to: 'c', from: '[ÇĆĈČ]'},
            {to: 'd', from: '[ÐĎĐÞ]'},
            {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
            {to: 'g', from: '[ĜĞĢǴ]'},
            {to: 'h', from: '[ĤḦ]'},
            {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
            {to: 'j', from: '[Ĵ]'},
            {to: 'ij', from: '[Ĳ]'},
            {to: 'k', from: '[Ķ]'},
            {to: 'l', from: '[ĹĻĽŁ]'},
            {to: 'm', from: '[Ḿ]'},
            {to: 'n', from: '[ÑŃŅŇ]'},
            {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
            {to: 'oe', from: '[Œ]'},
            {to: 'p', from: '[ṕ]'},
            {to: 'r', from: '[ŔŖŘ]'},
            {to: 's', from: '[ßŚŜŞŠȘ]'},
            {to: 't', from: '[ŢŤ]'},
            {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
            {to: 'w', from: '[ẂŴẀẄ]'},
            {to: 'x', from: '[ẍ]'},
            {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
            {to: 'z', from: '[ŹŻŽ]'},
            {to: '-', from: '[·/_,:;\']'}
        ];
        
        sets.forEach(set => {
            text = text.replace(new RegExp(set.from,'gi'), set.to)
        });
        
        return text;

    };

    return {
        init,
        indexDevice,
    }

}

export { Search }