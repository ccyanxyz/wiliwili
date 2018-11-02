var mongoose = require('mongoose');
var crypto = require('crypto')

var Schema = mongoose.Schema;

// user schema
var userModel = new Schema({
	email: { type: String, unique: true },
	username: String,
	password: String
});

// some frequently used method
userModel.methods.findUserByName = function(username, callback) {
	var query = {
		username: username
	};
	return this.model('User').find(query, callback);
}

// user avatar
userModel.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

var User = mongoose.model('User', userModel);

module.exports = User;
