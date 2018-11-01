var search = require('youtube-search')

var opts = {
	maxResults: 10,
	key: 'AIzaSyC1fyXMde2dH-5iHnnIVvIQTL-dL7MyDIk'
}

module.exports = function searchKeyword(keyword, numResults) {
	opts.maxResults = numResults;
	// search result
	var ret = []

    search(keyword, opts, function( err, res ) {
        if(err){
            console.log('search failed');
			// return an empty array
            return ret;
        } else {
            // console.log(res);
			for(item in res){
				var video = {
					id: item.id,
					link: item.link,
					title: item.title,
					description: item.description,
					picUrl: item.thumbnails.default.url
				};
				ret.push(video)
			}
			return ret;	
        }
    })
}
