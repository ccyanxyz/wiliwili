


app.get('/login', (req, res) => {
	res.render('login', { title: 'login' });
});

app.post('/login', (req, res) => {
	var _user = req.body.user;
	var username = _user.username;
	var password = _user.password;
	var email = _user.email;

	User.findUserByMail(email, (err, user) => {
		if(err) {
			console.log(err);
			return;
		}
		if(!user){
			return res.redirect('/register');
		}

		if(user.password === password) {
			console.log(mail + ' login success');
			req.session.user = user;
			return res.redirect('/');
		} else {
			return res.redirect('/login');
		}
	});
});
