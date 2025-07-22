const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  serialnumber: String,
  access_token: String,
  package_sign: Number
});

module.exports = mongoose.model('requests', requestSchema, 'requests');
