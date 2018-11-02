var User = require('../models/user');

app.get('/register', (req, res) => {
	res.render('register', { title: 'register' });
});

app.post('/register', function (req, res) {
	var _user = req.body.user;

	User.findUserByMail(_user.email, (err, user) => {
		if(err) {
			console.log(err);
			return;
		}

		if (user) {
			return res.redirect('/login');
		} else {
			var user = new User(_user);
			user.save((err, user) => {
				if(err) {
					console.log(err);
					res.redirect('/register');
				}
				console.log(user.email + ' register successful');
				resd.redirect('/login');
			})
		}
	})
})
