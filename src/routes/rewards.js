var express = require('express');
var { User, Reward, Post } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

function compare(x, y) {
	if(x.wili < y.wili){
		return 1;
	} else if(x.wili > y.wili) {
		return -1;
	} else {
		return 0;
	}
}

router.get('/', (req, res) => {
	// TODO: find all reward posts in database and fill in the ejs template
	Post.find({},{rewardPosts:1,_id:0}).exec((err, ret) => {
		if(err) {
			conslie.log("Error:" + err);
		}
		else {
			var rewards = [];
			console.log("find data");
			for(var i = 0, len = ret.length; i < len; i++){
				console.log(ret[i]);
				console.log(ret[i]["rewardPosts"]);
				var data = ret[i]["rewardPosts"];
				for(var j = 0,len1 = data.length; j < len1; j++){
					console.log("push data");
					rewards.push(data[j]);
					console.log(data[j]);
				}
			}

			rewards.sort(compare);
			req.session.rewards = rewards;
			res.render('rewards', {rewards: rewards});
		}

	})
	
});

router.get('/addWili', (req, res) => {
	if(!req.session.user){
		res.status('501').send();
		return;
	}
	console.log("******************************");
	console.log("user exist");
	var user_email = req.session.user.email;
	var upAmount = req.query.up;
	var index = req.query.index;
	console.log(index);
	console.log("REWARDS:");
	console.log(req.session.rewards);
	console.log("reward");
	var reward = req.session.rewards[index];
	console.log(reward);
	console.log("hhhhhhhhhhh");
	if(upAmount == 'undefined'){
		res.status('502').send();
	}
	console.log("******************************");
	User.find({email:user_email}, (err, users) => {
		if(err){
			console.log("reward.js: Error: " + err);
		}
		else{
			console.log("Find the User");
			var user = users[0];
			if(user.point<upAmount || upAmount<=0){
				console.log("reward.js: Illegal input! ");
			}
			else{
				User.update({email:user_email},{$inc:{points:-upAmount}},(err) => {
					if(err){
						console.log("reward.js: Error " + err);
					}
					else{
						console.log("Update the User");
						Reward.update({email:user_email},{$inc:{wili:upAmount}},(err) => {
							if(err){
								console.log("reward.js: Error " + err);
							}
							else{
								console.log("Update the Reward");
								Post.find({email:user_email},{},(err, ret) => {
									if(err){
										console.log("reward.js: Error " + err);
									}
									else{
										console.log("Find the Post");
										var user_post = ret[0]["rewardPosts"];
										console.log(user_post);
										console.log(user_post.length);
										for(var i = 0; i < user_post.length; i++){
											console.log("大概这边gg了");
											if(user_post[i]["_id"] == reward["_id"]){
												console.log("大概这边没gg");
												user_post[i].wili += Number(upAmount);
												console.log("大概这边没gg");
												break;
											}
										}
										console.log(user_post);
										Post.update({email:user_email},{rewardPosts:user_post},(err) => {
											if(err)
												console.log("reward.js: Error " + err);
											else
												console.log("Update the Post");
										});
									}
								});
							}
						});
					}
				});
			}
		}
	});
	res.status('200').send();
});


module.exports = router;
