var express = require('express');
var { User, Reward, Post } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

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
			res.render('rewards', {rewards: rewards});
		}

	})
	
});

// router.get('/addWili', (req, res) => {
// 	if(!req.session.user){
// 		res.locals.message = 'Please login';
// 		res.locals.error = {status:'not logged in', stack:'please login'};
// 		res.render('error')
// 	}

// 	User.find({email:req.session.user.email}, (err, users) => {
// 		if(err){
// 			console.
// 		}


// 	}


module.exports = router;
