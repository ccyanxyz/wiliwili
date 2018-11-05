var express = require('express');
var { User } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	res.render('login');
});

router.post('/', (req, res) => {
	var _user = req.body;
	//res.send(req.body);
	var password = _user.password;
	var email = _user.email;

	var query = { email: _user.email };

	User.find(query, (err, user) => {
		//res.send(user);
		//return;
		console.log('query:' + query);
		console.log('user:' + user);

		if(err) {
			console.log(err);
			//res.send(err);
			return;
		}
		if(!user){
			return res.redirect('../register');
		}

		if(user.password === password) {
			console.log(mail + ' login success');
			req.session.user = user;
			return res.redirect('../');
		} else {
			return res.redirect('/login');
		}
	});
});

module.exports = router;
