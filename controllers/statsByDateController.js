const SignLog = require('../models/SignLog');
const Request = require('../models/Request');

exports.renderForm = (req, res) => {
  res.render('pages/statsByDate', {
    user: req.session.user,
    result: null
  });
};

exports.handleSubmit = async (req, res) => {
  const { serialnumber, access_token, from_date, to_date, type } = req.body;

  if (!serialnumber || !access_token || !from_date || !to_date || !type) {
    return res.render('pages/statsByDate', {
      user: req.session.user,
      result: { error: 'Vui lòng nhập đầy đủ thông tin' }
    });
  }

  const request = await Request.findOne({ serialnumber, access_token });

  if (!request) {
    return res.render('pages/statsByDate', {
      user: req.session.user,
      result: { error: 'Không tìm thấy serialnumber hoặc access_token phù hợp' }
    });
  }

  const GMT7_OFFSET = 7 * 60 * 60 * 1000;
  const fromTimestamp = new Date(from_date).getTime() - GMT7_OFFSET;
  const toTimestamp = new Date(to_date).getTime() - GMT7_OFFSET + 86400000 - 1;

  const count = await SignLog.countDocuments({
    serialnumber: serialnumber,
    type: type.toUpperCase(),
    create_date: {
      $gt: fromTimestamp,
      $lt: toTimestamp
    }
  });

  console.log({
    serialnumber,
    access_token,
    fromTimestamp,
    toTimestamp,
    type,
    count
  });

  res.render('pages/statsByDate', {
    user: req.session.user,
    result: {
      serialnumber,
      type,
      count,
      fromDate: from_date,
      toDate: to_date
    }
  });
};
