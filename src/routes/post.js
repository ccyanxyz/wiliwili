var express = require('express');
var { User, Reward, Post } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	res.render('post');
});

router.post('/post_reward', (req, res) => {
	var user_email = req.session.user.email;
	var title = req.body.title;
	var description = req.body.description;
	var wili = req.body.wili;

	var reward = new Reward({
		email: user_email,
		title: title,
		wili: wili,
		description: description
	});

	reward.save((err, re) => {
		if(err){
			console.log('Post reward failed:');
			console.log(reward);
			console.log(err);
		}
		console.log('Post reward success:');
		console.log(re);

		// TODO: insert a new record to user's post list
		Post.find({email:user_email}, {_id: 0}, (err, ret) => {
			if(err){
				console.log("post.js: Error: " + error);
			}
			else if(ret.length > 1){
				console.log("post.js: Error: duplicated keys");
				console.log(ret);
			}
			else if(ret.length == 0){
				console.log("post.js: not found");
				Post.create({
					email: user_email,
					rewardPosts:reward 
				},function(err){
					if(err)  
						console.log("post.js: Error: " + error);
					else
						console.log("post.js: insert OK");
				});
			}
			else{
				console.log(ret);
				ret[0]["rewardPosts"].push(reward);
				Post.update({email:user_email},ret[0],function(err){
					if(err)
						console.log("post.js: Error: " + error);
					else
						console.log("post.js: insert OK");
				});
			}
		});
		console.log(reward);
		res.redirect('../../personal');
	});
});

module.exports = router;
