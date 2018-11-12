var express = require('express');
var { User, Video, Upload } = require('../models/db');
var multer = require('multer');
var fs = require('fs');
var upload = multer({ dest : '' } )

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    	if (file.fieldname == 'thumbnail')
    		uploadFolder = './upload/thumbnail';
    	else if( file.fieldname == 'video')
    		uploadFolder = './upload/video';
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
    	var name = file.originalname;
    	var ext = name.substr(name.lastIndexOf('.'));
    	var main = name.substr(0, name.lastIndexOf('.'));
    	main += ( '-' + String(Date.now()) );
    	var res = main + ext; 
        cb(null, res);  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
	res.render('upload');
});

// TODO: upload video, insert a video obj to Video, insert a record to user's upload list in Upload
var upload_func = upload.fields([{name:'thumbnail',maxCount:1},
	{name:'video', maxCount: 1}] );

router.post('/upload_video', (req, res) => {
	if(req.session.user == 'undefined'){
		res.redirect('../../login');
	}
	console.log("upload_video in")
	upload_func(req, res, function(err){
		console.log("upload_func in")
	    // if (err instanceof multer.MulterError) {
	    //   console.log("multer.MulterError");
	    //   res.redirect("../");
	    // } else if (err) {
	    //   console.log("Other error")
	    //   res.redirect("../");
	    // }
	    var body = req.body;
		var files = req.files;
		var thumbnail = files['thumbnail'][0];
		var video = files['video'][0];
	    console.log(thumbnail.originalname);
	    console.log(video.originalname);
	    // 一切都好

	    var user = req.session.user;
	    var query = {email: user.email};
	    var _video = {
	    	email: user.email,
			videoId: Date.now(),
			videoUrl: video.path, // local path of this video
			title: body.title,	
			description: body.description,
			picUrl: thumbnail.path, // local path of video pic
	    };
	    Video.create(_video, function(err){
	    	if (err) {
	    		console.log(err);
	    		return;
	    	}
	    	console.log("yydsb");
	    });
	    Upload.find(query, (err, uploads) => {
	    	if (err) {
	    		console.log(err);
	    		return;
	    	}
	    	if(uploads.length === 0){
	    		Upload.create({email: user.email, videos : [_video] } ,function(err, res){
	    			if(err)
	    				console.log(err);
	    		} );
	    		// console.log("upload failure, invalid user");
	    	}
	    	else{
	    		videos = uploads[0].videos;
	    		videos.push(_video);
	    		Upload.update(query, {videos: videos},function(err,res){
	    			if (err) {
			            console.log("hxldsb:" + err);
			        }
			        else {
			            console.log("Res:" + res);
			        }
	    		});
	    		req.session.message = '上传成功！';
	    	}

	    });
	    var response = {
	    	message: "everything fine",
	    	thumbnail: {
	    		originalname: thumbnail.originalname,
	    		path: thumbnail.path,
	    		mimetype: thumbnail.mimetype,
	    	},
	    	video: {
	    		originalname: video.originalname,
	    		path: video.path,
	    		mimetype: video.mimetype,
	    	}
	    	// body: body
	    };
	    // res.end(JSON.stringify( response ));

	});

});

module.exports = router;
