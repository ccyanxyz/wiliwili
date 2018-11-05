var express = require('express');
var router = express.Router();

var { User } = require('../models/db');

router.get('/', (req, res) => {
	User.find( function (allUsers) {
		console.log(allUsers);
		res.send(allUsers);
	} )
})

module.exports = router;
