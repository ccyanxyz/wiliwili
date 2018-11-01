var search = require('youtube-search')

var opts = {
	maxResults: 10,
	key: 'AIzaSyC1fyXMde2dH-5iHnnIVvIQTL-dL7MyDIk'
}

function searchKeyword(keyword) {
    search(keyword, opts, function( err, res ) {
        if(err){
            console.log(err);
            return JSON;
        } else {
            return res;
        }
    })
}
