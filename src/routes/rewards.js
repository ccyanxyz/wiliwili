var express = require('express');
var { User, Rewards } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	// TODO: find all reward posts in database and fill in the ejs template
	var rewards = [];

	res.render('rewards', {rewards: rewards});
});

module.exports = router;
