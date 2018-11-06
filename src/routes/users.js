var express = require('express');
var router = express.Router();

var { User } = require('../models/db');

// get all users
router.get('/', (req, res) => {
	User.find( (err, allUsers) => {
		if(err){
			console.log('get all users failed:');
			console.log(err);
		} else {
			console.log('all users:');
			console.log(allUsers);
			res.send(allUsers);
		}
	} )
})

module.exports = router;
