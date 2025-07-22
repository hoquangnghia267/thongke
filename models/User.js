const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String // đã mã hóa bằng bcrypt
});

module.exports = mongoose.model('User', userSchema);
