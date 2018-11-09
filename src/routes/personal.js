var express = require('express');
var { User } = require('../models/db.js');
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
		if(err){
			console.log(err);
			return;
		}

		if(users.length == 0){
			console.log('find 0 users with email: ' + req.session.user.email);
			return;
		}

		var user = users[0];
		res.render('personal', {user:user});
	})
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
