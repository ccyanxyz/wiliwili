var express = require('express');
var {Video} = require('../models/db.js');
var router = express.Router();

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
		res.render('index', {user:user, videos:videos});
	});
});

module.exports = router;
