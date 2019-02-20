var express = require('express');
var { User, Upload, Reward , Post} = require('../models/db.js');
 var transfer = require('../utils/token_transfer.js');

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
		console.log("User.first");
		if(err){
			console.log(err);
			res.message = "error finding user";
			res.render('error', {error:err});
		}
		if(users.length == 0){
			console.log('find 0 users with email: ' + req.session.user.email);
			res.message = "user not found";
			var error = {status: 'user not found', stack: 'user not found'};
			res.render('error', {error: error});
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
			if(post_ret.length != 0)
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
				waiting_rewards = [];
				for(var i = 0; i < rewards.length; i++)
					if(!rewards[0]["finished"])
						waiting_rewards.push(rewards[0]);
				req.session.waiting_rewards = waiting_rewards;
				console.log("GET PAGE");
				console.log("GET PAGE");
				console.log("GET PAGE");
				console.log("GET PAGE");
				console.log("GET PAGE");
				console.log("GET PAGE");
				console.log(req.session);

				res.render('personal', {user:user, rewards: rewards, videos: videos});
			});
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
			//res.render('personal', {user:user});
			transfer(address, Number(amount));		
			res.redirect('./');
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
		User.updateOne(query, updates, (err, user) => {
			if(err){
				console.log(err);
				return;
			}
			user.points = newPoints;
			//res.render('personal', {user:user});
			res.redirect('./');
		});
	})
});

router.get('/reject', (req, res) => {
	var reward = req.session.waiting_rewards[req.query.index];
	console.log("reward", reward);

	Reward.updateOne({_id:reward["_id"]}, {uploaded:false, uploader:"", videoLink:""}, (err)=>{
		if(err){
			console.log("Personal.js: Error " + err);
			return;
		}
		Post.find({email:reward["email"]}, (err, ret)=>{
			if(err){
				console.log("Personal.js: Error " + err);
				return;
			}
			var rewards = ret[0]["rewardPosts"];
			for(var i = 0; i < rewards.length; ++i){
				if(rewards[i]["_id"] == reward["_id"]){
					rewards[i]["uploaded"] = 0;
					rewards[i]["uploader"] = "";
					rewards[i]["videoLink"] = "";
					break;
				}
			}
			Post.update({email:reward["email"]}, {rewardPosts:rewards}, (err)=>{
				if(err){
					console.log("Personal.js: Error " + err);
					return;
				}
				waiting_rewards = [];
				for(var i = 0; i < rewards.length; i++)
					if(!rewards[0]["finished"])
						waiting_rewards.push(rewards[0]);
				req.session.waiting_rewards = waiting_rewards;
				res.redirect('./');
			});
		});
	});
});

router.get('/confirm', (req, res) => {
	var reward = req.session.waiting_rewards[req.query.index];
	console.log(reward);

	User.updateOne({email:reward["uploader"]},{$inc:{points:reward["wili"]}}, (err) => {
		if(err){
			console.log("Personal.js: Error " + err);
			return;
		}
		var reward_id = reward._id;
		console.log("User updated, reward_id:", reward_id);
		Reward.updateOne({_id: reward_id}, {finished:true}, (err) => {
			if(err){
				console.log("Personal.js: Error " + err);
				return;
			}
			console.log("Reward updated");
			Post.find({email:reward["email"]}, (err, ret) => {
				if(err){
					console.log("Personal.js: Error " + err);
					return;
				}
				console.log("Post found");
				var rewards = ret[0]["rewardPosts"];
				for(var i = 0; i < rewards.length; ++i){
					if(rewards[i]["_id"] == reward["_id"]){
						rewards[i]["finished"] = true;
					}
				}
				Post.updateOne({email:reward["email"]},{rewardPosts:rewards}, (err) => {
					if(err){
						console.log("Personal.js: Error " + err);
						return;
					}
					waiting_rewards = [];
					for(var i = 0; i < rewards.length; i++)
						if(!rewards[0]["finished"])
							waiting_rewards.push(rewards[0]);
					req.session.waiting_rewards = waiting_rewards;
					res.redirect("./");
				});
			});
		});
	});	
});

module.exports = router;
