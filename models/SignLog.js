const mongoose = require('mongoose');

const signLogSchema = new mongoose.Schema({
  serialnumber: String,
  create_date: Number
});

module.exports = mongoose.model('signlogs', signLogSchema, 'signlogs');
