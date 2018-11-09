var express = require('express');
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
	var videos = [];

	res.render('index', {user:user, videos:videos});
});

module.exports = router;
