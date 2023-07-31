const Search = function( ) {

    var $ = window.astro;

    const elemInput = document.querySelector('[js-search-input]');

    const init = () => {
        registerEvents();
        elemInput.focus();
    }

    const registerEvents = ev => {

        document.addEventListener('keyup', ev => {

            //console.log(ev.code)

            // typing in the search bar (or deleting chars - "Backspace")
            if ( ev.target == elemInput
                    && ['Key','Bac'].includes(ev.code.substr( 0, 3 ))) {
                
                // query the keyword against the dictionary
                query();

            // close search with esc
            } else if ( ev.code === 'Escape' ) {
                clear();
                console.log('clicked escape - cleared input')
            }
        });
        
    }

    const clear = () => {

        elemInput.value = '';

        // reset camera event
        const ev1 = new Event("resetCamera");
        window.dispatchEvent(ev1);

        // remove any spotlights
        const ev2 = new Event("removeHighlight");
        window.dispatchEvent(ev2);

    }

    const query = () => {

        let keyword = elemInput.value;
        keyword = latinize( keyword );
        // ignore less than 3 chars
        if ( keyword.length < 3 ) {
            return;
        }

        let keywordsFound = [];
         
        const keywordIndex = $.dictKeywordIndex;
        const re = new RegExp("^" + keyword,"g");
        console.log(re)
        keywordsFound = keywordIndex.filter(value => re.test(value));


        if (keywordsFound.length) {

            console.log('keywordsFound',keywordsFound)

            // light up rooms event
            const ev = new CustomEvent("highlight", { detail: keywordsFound });
            window.dispatchEvent(ev);

        } else {

            // remove any room highlights
            const ev2 = new Event("removeHighlight");
            window.dispatchEvent(ev2);
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
        init: init(),
    }

}

export { Search }