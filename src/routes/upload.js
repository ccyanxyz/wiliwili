var express = require('express');
var { User, Video, Upload } = require('../models/db');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	res.render('upload');
});

// TODO: upload video, insert a video obj to Video, insert a record to user's upload list in Upload
router.post('/upload_video', (req, res) => {
	
});

module.exports = router;
