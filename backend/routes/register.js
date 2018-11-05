var express = require('express');
var { User } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	res.render('register');
});

router.post('/', function (req, res) {
	var _user = req.body;
	//res.send(req.body);

	var query = { email: _user.email };

	User.find(query, (err, user) => {
		if(err) {
			console.log(err);
			return;
		}
		if (user.length != 0) {
			console.log('user exist, redirect to login page:')
			console.log(user);
			return res.redirect('../login');
		} else {
			var user = new User(_user);
			user.save((err, user) => {
				if(err) {
					console.log(err);
					res.redirect('./');
				}
				console.log(user.email + ' register successful');
				res.redirect('../login');
			})
		}
	})
})

module.exports = router;
