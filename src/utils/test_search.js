searchYoutube = require('./search');

searchYoutube('eth', 10).then( res => {
    console.log('results:');
    console.log(res);
})
