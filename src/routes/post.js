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
		Post.find({email:user_email}, (err, ret) => {

		});

		res.redirect('../../personal');
	});
});

module.exports = router;
