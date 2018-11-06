let { Video } = require('../models/db');
let searchYoutube = require('../utils/search');

let express = require('express');

let router = express.Router();

let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (req, res) => {
	let keyword = req.body.keyword;

	// results: a list of video object
	let results = [];

	// search local video database

	// search youtube
});


