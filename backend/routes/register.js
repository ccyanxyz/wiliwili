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
		if (user) {
			return res.redirect('../login');
		} else {
			var user = new User(_user);
			user.save((err, user) => {
				if(err) {
					console.log(err);
					res.redirect('./');
				}
				console.log(user.email + ' register successful');
				resd.redirect('../login');
			})
		}
	})
})

module.exports = router;
