let { Video } = require('../models/db');
let searchYoutube = require('../utils/search');

let express = require('express');

let router = express.Router();

let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// search local
router.post('/local', (req, res) => {
	let keyword = req.body.keyword;
	// ignore case, use re.test(string)
	let re = new RegExp(keyword, 'i');

	// results: a list of video object
	let results = [];

	// search local video database

});

// search youtube
router.post('/youtube', (req, res) => {
	let keyword = req.body.keyword;
	let re = new RegExp(keyword, 'i');

	let results = [];

	// search youtube
});


