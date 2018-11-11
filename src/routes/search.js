let { Video } = require('../models/db');
// let searchYoutube = require('../utils/search');

let express = require('express');

let router = express.Router();

let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// search local
router.post('/search', (req, res) => {
	let keyword = req.body.keyword;
	// ignore case, use re.test(string)
	let re = new RegExp(keyword, 'i');

	// results: a list of video object
	let results = [];
	
	Video.find((err, ret) => {
		if(err){
			console.log(err);
			return;
		}

		for(var i = 0; i < ret.length; i++){
			if(re.test(ret[i].title || re.test(ret[i].description))){
				results.push(ret[i])
			}
		}
		res.render('index', {videos: results});
	})

});

// search youtube
router.post('/youtube', (req, res) => {
	let keyword = req.body.keyword;
	let re = new RegExp(keyword, 'i');

	let results = [];

	// search youtube
});


