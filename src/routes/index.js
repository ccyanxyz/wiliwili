var express = require('express');
var {Video} = require('../models/db.js');
var router = express.Router();

function compare(x, y) {
	if(x.upVote < y.upVote){
		return 1;
	} else if(x.upVote > y.upVote) {
		return -1;
	} else {
		return 0;
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	if(typeof req.session.user !== 'undefined'){
		var user = req.session.user;
	} else {
		var user = {};
	}
	
	// TODO: get all videos info from database and fill in template
	Video.find({}, (err,ret) => {
		if(err){
			console.log("index.js: Error " + err);
			return;
		}
		var videos = ret;
		console.log(videos);

		videos.sort(compare);

		res.render('index', {user:user, videos:videos});
	});
});

module.exports = router;
