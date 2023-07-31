'use strict';

import { SVGLoader }                    from "../lib/threeSVGLoader.js";

const ReadData = () => {

    var $ = window.astro;

    const init = () => {

        $.dict = {};
        $.dictKeyword = {};

        loadAllFiles();
        $.dictKeywordIndex = Object.keys($.dictKeyword);

    }

    const loadAllFiles = () => {

        // for each floor
        const floorPromises = [];
        for (let i=0;i < $.floorCount; i++) {
            floorPromises[i] = loadFile(i);
        }
        // loading the files is async, so wait for all to finish
        Promise.all(floorPromises).then((values) => {
            console.log('All data read:',values.join(', '));
            // Create a flat array to be a fast index for the keywords (and so to the dictionary)
            $.dictKeywordIndex = Object.keys($.dictKeyword);
        });

    }

    const loadFile = (floorNo) => {

        // loading the files is async, so wrap in a promise
        return new Promise((resolve,reject) => {

            // use the SVG loader that we use in THREE.js to load the SVGs (which also contain the meta info)
            const loader = new SVGLoader();
            const svgFile = `img/PSHQ0${floorNo}.svg`;
            let counterItems = 0;
            loader.load(
                svgFile,
                data => {
                    // for each path in the SVG
                    const paths = data.paths;
                    for ( var i = 0; i < paths.length; i ++ ) {
                        var path = paths[ i ];

                        //console.log('**' + floorNo,path.userData.node.getAttribute('data-name'))

                        // if a path has an attribute "data-name", it's worth indexing
                        const node = path.userData.node;
                        const dataName = node.getAttribute('data-name');
                        const dataSubName = node.getAttribute('data-subname');
                        const dataSynonyms = node.getAttribute('data-synonyms');
                        if (dataName) {
                            counterItems ++;
                            const dataNameLower = dataName.toLowerCase();
                            // enter into dictionary
                            $.dict[ dataNameLower ] = {
                                name: dataName,
                                subName: dataSubName,
                                synonyms: dataSynonyms,
                                floor: floorNo,
                                classList: node.classList,
                            }
                            // link the name and any synonyms with the dictionary entry
                            $.dictKeyword[dataNameLower] = dataNameLower;
                            if (dataSynonyms) {
                                dataSynonyms.split(',').forEach( (synonym) => {
                                    synonym = synonym.trim();
                                    if (synonym.length) {
                                        $.dictKeyword[synonym] = dataNameLower;
                                    }
                                });
                            }
                        }
                    }

                    resolve(svgFile + ' ' + counterItems + ' items');
                },
                xhr => {},
                error => {
                    reject(svgFile + ' failed');
                }
            )
        })


    }

    return {
        init: init(),
    }

}

export { ReadData };