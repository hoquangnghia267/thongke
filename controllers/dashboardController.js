const moment = require('moment');
const SignLog = require('../models/SignLog');
const Request = require('../models/Request');

// Hiển thị form thống kê
exports.renderDashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const type = req.params.type?.toUpperCase() || 'PDF';
  res.render('dashboard', {
    result: null,
    user: req.session.user,
    type
  });
};

exports.handleDashboardPost = async (req, res) => {
  const { serialnumber, access_token } = req.body;
  const type = req.params.type?.toUpperCase() || 'PDF';

  let expectedCount = null;

  const request = await Request.findOne({ serialnumber, access_token });

  if (!request && type === 'PDF') {
    return res.render('dashboard', {
      result: { error: 'Không tìm thấy serialnumber hoặc access_token' },
      user: req.session.user,
      type
    });
  }

  const query = { serialnumber, type };

  const signedCount = await SignLog.countDocuments(query);

  if (type === 'PDF') expectedCount = request.package_sign || 0;

  res.render('dashboard', {
    result: {
      serialnumber,
      access_token,
      expectedCount,
      signedCount
    },
    user: req.session.user,
    type
  });
};

