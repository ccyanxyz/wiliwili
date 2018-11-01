var search = require('youtube-search')

var opts = {
	maxResults: 10,
	key: 'AIzaSyC1fyXMde2dH-5iHnnIVvIQTL-dL7MyDIk'
}

search('eth', opts, function(err, res) {
	if(err) {
		return console.log(err)
	}
	console.dir(res)
})
