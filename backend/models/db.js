var mongoose = require('mongoose');
var crypto = require('crypto')

var Schema = mongoose.Schema;

// user schema
var userModel = new Schema({
	email: { type: String, unique: true },
	username: String,
	password: String,
	points: Number
});

// video schema
var videoModel = new Schema({
	// video info
	videoId: { type: String, unique: true },
	videoUrl: String, // local path of this video
	title: String,	
	description: String,
	picUrl: String, // local path of video pic
});

// user-video schema
var uploadModel = new Schema({
	// mapping from user to videos
	user: userModel,
	videos: [ videoModel ]
});

var User = mongoose.model('User', userModel);
var Video = mongoose.model('Video', videoModel);
var Upload = mongoose.model('Upload', uploadModel);

module.exports = {
	User,
	Video,
	Upload
}
