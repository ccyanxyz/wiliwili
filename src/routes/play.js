var express = require('express');
var { User } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	res.render('play');
});

router.post('/praise', (req, res) => {
	var email = req.body.email; // 没搞定
	User.update({email:email}, {$inc:{points:1}}, (err,ret) => {
		if(err)
			console.log("play.js: Error" + err);
	});
	res.redirect('/play');
});

router.post('/pay', function(req, res, next){
	if(typeof req.session.user !== 'undefined'){
		var user = req.session.user;
	} else {
		var user = {};
	}
	var change = req.body.points; //或许要改
	var email = req.body.email;
	User.update({email:email}, {$inc:{points:change}}, (err,ret) => {
		if(err)
			console.log("play.js: Error " + err);
	});
	User.update({email:user.email}, {$inc:{points:-change}}, (err,ret) => {
		if(err)
			console.log("play.js: Error " + err);
	});
	res.redirect('/play');
});

module.exports = router;
