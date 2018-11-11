var express = require('express');
var { User, Upload, Post} = require('../models/db.js');
// var transfer = require('../utils/token_transfer.js');

var router = express.Router();

// personal center
router.get('/', function(req, res, next) {
	console.log(req.session);
	if(!req.session.user){
		res.locals.message = 'Please login';
		res.locals.error = {status:'not logged in', stack:'please login'};
		res.render('error')
	}	
	var query = {email: req.session.user.email};
	User.find(query, (err, users) => {
		if(err){
			console.log(err);
			return;
		}

		if(users.length == 0){
			console.log('find 0 users with email: ' + req.session.user.email);
			return;
		}

		var user = users[0];
		var rewards = [];
		var videos = [];

		// TODO: find user's video upload list and reward post list in database and fill above 2 arrays
		Post.find({email: user["email"]}, (err, post_ret) => {
			if(err){
				console.log("personal.js: Error " + err);
				return;
			}
			
			if(post_ret.length != 0){
				rewards = post_ret[0]["rewardPosts"];
			
				console.log("rewards");
				console.log(rewards);			
				Upload.find({email: user["email"]}, (err, upload_ret) => {
					if(err){
						console.log("personal.js: Error " + err);
						return;
					}
					if(upload_ret.length != 0)
						videos = upload_ret[0]["videos"];
					console.log("videos");
					console.log(videos);
					res.render('personal', {user:user, rewards: rewards, videos: videos});
				});
			}
		});
	});
});

router.post('/withdraw', (req, res) => {
	console.log(req.session);
	console.log(req.body);

	var amount = Number(req.body.amount);
	var address = req.body.address;

	var query = {email:req.session.user.email};
	User.find(query, (err, users) => {
		if(err){
			console.log(err);
			return;
		}
		if(users.length == 0){
			console.log('user not found');
			return;
		}
		var user = users[0];
		var newPoints = user.points - amount;
		if(newPoints < 0){
			console.log(user.email + ' insufficient balance');
			return;
		}

		var updates = {$set: {points:newPoints}}
		User.updateOne(query, updates, err => {
			if(err){
				console.log(err);
				return;
			}
			user.points = newPoints;
			res.render('personal', {user:user});
			transfer(address, Number(amount));		
		});
	})
});

router.post('/topup', (req, res) => {
	console.log(req.session);
	console.log(req.body);

	var amount = Number(req.body.amount);

	var query = {email:req.session.user.email};
	User.find(query, (err, users) => {
		if(err){
			console.log(err);
			return;
		}
		if(users.length == 0){
			console.log('user not found');
			return;
		}
		var user = users[0];
		var newPoints = user.points + amount;

		var updates = {$set: {points:newPoints}}
		User.updateOne(query, updates, err => {
			if(err){
				console.log(err);
				return;
			}
			user.points = newPoints;
			res.render('personal', {user:user});
		});
	})
});

module.exports = router;
