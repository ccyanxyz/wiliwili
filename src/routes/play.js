var express = require('express');
var { User, Video } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	try{
		var vid = req.query.id;
		console.log("vid", vid);
	}catch(err){
		console.log("ERROR! play.js", this.caller);
		return;
	}
	var query = {_id: vid};
	console.log(query);
	Video.find(query, (err, videos)=>{
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
			var query = {email: uid};
			User.find(query, (err, users)=>{
				if(err){
					console.log(err);
					return;
				}
				else if(users.length == 0){
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
	var vid = req.query.vid;
	console.log("vid:", vid);
	if(typeof req.session.user == 'undefined'){
		console.log("********54");
		console.log("ERROR! play.js line 56");
		res.status('501').send("ERROR");
	}
	var query0 = {_id: vid};
	var user = {};
	var email;
	Video.update(query0, {$inc:{upVote:1}}, (err,ret) => {
		if(err){
			console.log("play.js: Error line 51" + err);
			res.status('500').send("play.js: Error line 51" + err);
		}
		else
			console.log("play.js: Error line 60")
			console.log("query0: ",query0)
			console.log("ret: ",ret);
	});
	Video.find(query0,(err, ret)=>{
		console.log("query: ",query0)
		console.log("play.js: Error line 66")
		console.log("ret: ",ret);
		email = ret[0].email;
		var query1 = {email: email}
		User.update(query1, {$inc:{points:1}}, (err,ret) => {
			if(err){
				console.log("play.js: Error line 73" + err);
				res.status('500').send("play.js: Error line 73" + err);
			}
		});
	});
	res.status('200').send();
});

router.get('/pay', function(req, res, next){
	var vid = req.query.vid;
	var amount = Number(req.query.amount);
	console.log("amount:", amount);
	console.log("vid:", vid);
	if(typeof req.session.user !== 'undefined'){
		var giver = req.session.user;
		var receiver_email;
		var query0 = {_id: vid};
		Video.find(query0, (err,ret) => {
			if(err){
				console.log("play.js: Error line 90" + err);
				res.status('500').send("play.js: Error line 90" + err);
			}
			if(ret.length == 0){
				console.log("play.js: Error line 86" + err);
				res.status('500').send("play.js: Error line 86" + err);
			}
			else{
				receiver_email = ret[0].email;
				console.log("receiver_email: ", receiver_email);
			}
			query1 = {email: giver.email}
			User.update(query1, {$inc:{points:-amount}}, (err,ret) => {
				if(err){
					console.log("play.js: Error line 98" + err);
					res.status('500').send("play.js: Error line 98" + err);
				}
			});
			query2 = {email: receiver_email}
			User.update(query2, {$inc:{points:+amount}}, (err,ret) => {
				if(err){
					console.log("play.js: Error line 105" + err);
					res.status('500').send("play.js: Error line 105" + err);
				}
			});
			res.status('200').send();
		});
	} else {
		var user = {};
		console.log("ERROR! play.js line 115");
		res.status('501').send("ERROR");
	}
});

module.exports = router;
