var express = require('express');
var { User, Videos } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	var vid = req.query.id;
	console.log("vid", vid);
	var query = {_id: vid};
	Videos.find(query, (err, videos)=>{
		if(err){
			console.log(err);
			return;
		}
		else if(videos.length == 0){
			console.log("ERROR! play.js line 20");
			return;
		}
		else{
			var video = videos[0];
			var uid = video.email;
			query = {email: uid};
			User.find(query, (err, users)=>{
				if(err){
					console.log(err);
					return;
				}
				else if(videos.length == 0){
					console.log("ERROR! play.js line 33");
					return;
				}
				else{
					var user = users[0];
				}
			});
		}
	});
	res.render('play');
});

router.get('/praise', (req, res) => {
	var vid = req.query.id;
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
