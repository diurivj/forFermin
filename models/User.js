const PLM      = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  bio: String,
  photoURL: String,
  occupation: String
}, {
  timestamps: true,
  versionKey: false
})

userSchema.plugin(PLM, { usernameField: 'email' });
module.exports = mongoose.model('User', userSchema);