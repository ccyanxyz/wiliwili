var search = require('youtube-search')

var opts = {
    maxResults: 10,
    key: 'AIzaSyC1fyXMde2dH-5iHnnIVvIQTL-dL7MyDIk'
}

module.exports = function searchYoutube(keyword, maxResults) {
    opts.maxResults = maxResults;
    var ret = search(keyword, opts);
    return ret.then(result => {
        res = result.results;
        var rets = []
        for(let i = 0; i < opts.maxResults && i < res.length; i++){
            item = res[i];
            // console.log(item);
            var video = {
                id: item.id,
                link: item.link,
                title: item.title,
                description: item.description,
                picUrl: item.thumbnails.medium.url
            };
            rets.push(video)
        }
        return rets;
    })
}
