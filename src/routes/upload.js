var express = require('express');
var { User, Video, Upload, Reward, Post } = require('../models/db');
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
			uploadFolder = './public/upload/thumbnail';
		else if( file.fieldname == 'video')
			uploadFolder = './public/upload/video';
		cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
	},
	filename: function (req, file, cb) {
		var name = file.originalname;
		var ext = name.substr(name.lastIndexOf('.'));
		var main = String(Date.now());
		name = main + ext; 
		cb(null, name);  
	}
});

//
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

router.get('', (req, res) => {
	var reward_id = req.query.reward_id;
	req.session.cur_reward = reward_id;
	res.render('upload', {reward_id: reward_id});
});

// TODO: upload video, insert a video obj to Video, \
// insert a record to user's upload list in Upload
var upload_func = upload.fields([{name:'thumbnail',maxCount:1},
	{name:'video', maxCount: 1}] );

router.post('/upload_video', (req, res) => {
	if(req.session.user === 'undefined'){
		res.redirect('../../login');
	}
	console.log("upload_video in")
	upload_func(req, res, function(err){
		console.log("upload_func in");
		var body = req.body;
		var files = req.files;
		if(typeof files.thumbnail == 'undefined'){
			console.log('shit');
			res.redirect('./');
			return;
		}
		var thumbnail = files['thumbnail'][0];
		var video = files['video'][0];
		// 一切都好

		var user = req.session.user;
		var user_email = user.email;
		if(user == 'undefined'){
			res.redirect('../../login');
		}
		var query = {email: user_email};
		var _video = new Video({
			email: user_email,
			videoId: Date.now(),
			 // videoUrl: video.path.replace('public/', ""), // macOS
			videoUrl: video.path.replace('public\\', ""), // Windows
			title: body.title,	
			description: body.description,
			 // picUrl: thumbnail.path.replace('public/', ""), // macOS
			picUrl: thumbnail.path.replace('public\\', ""), // Windows
			upVote: 0
		});

		Video.create(_video, function(err){
			if (err) {
				console.log(err);
				return;
			}
			console.log("video.create()");
		});
		Upload.find(query, (err, uploads) => {
			if (err) {
				console.log(err);
				return;
			}
			if(uploads.length === 0){
				Upload.create({email:user_email, videos:[_video]},function(err, res){
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
			var reward_id = req.session.cur_reward;
			console.log("reward_id:", reward_id);
			if(reward_id !== 'undefined'){
				console.log("reward_id defined:", reward_id);
				query = {_id: reward_id}
				Reward.find(query, (err, rewards)=>{
					if (err) {
						console.log(err);
						return;
					}
					if(rewards.length == 0){
						console.log("No match reward")
						return;
					}
					var reward = rewards[0];
					var user = req.session.user;
					var reward_id = req.session.cur_reward;
					console.log("Upload 135: ", user, "reward_id:", reward_id);
					reward.uploaded = true;
					reward.uploader = user_email;
					reward.videoLink = "/play?id="+_video._id;

					Post.find({email:user_email}, (err, ret)=>{
						var user_rewards = ret[0]['rewardPosts'];
						console.log("Find in:", user_rewards);
						for (var i = user_rewards.length - 1; i >= 0; i--) {
							if(user_rewards[i]._id == req.session.cur_reward){
								user_rewards[i] = reward;
								break;
							}
						}
						console.log("Find break:", user_rewards);
						Post.update({email: user_email}, {rewardPosts: user_rewards}, (err)=>{
							if(err)
								console.log("upload.js: post.update() err");
							else
								console.log("upload.js: post.update() OK");
						});
					})

					var user = req.session.user;
					var reward_id = req.session.cur_reward;
					var change = {
						uploaded: true,
						uploader: user_email,
						videoLink: "/play?id="+_video._id
					}
					Reward.update({_id:reward_id}, change, (err)=>{
						if(err)
							console.log("upload.js: Reward Update Error"+err);
						// console.log("Upload over, reward:", reward);
					});

				})
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
		res.redirect("../../personal");
	});

});

module.exports = router;
