const SignLog = require('../models/SignLog');
const Request = require('../models/Request');

// Hiển thị form thống kê theo năm
exports.renderForm = (req, res) => {
  res.render('pages/statsByYear', { user: req.session.user, result: null });
};

// Xử lý thống kê theo năm
exports.handleSubmit = async (req, res) => {
  const { serialnumber, access_token, year, type } = req.body;
  if (!serialnumber || !access_token || !year || !type) {
    return res.render('pages/statsByYear', { user: req.session.user, result: { error: 'Vui lòng nhập đầy đủ thông tin' } });
  }
  const request = await Request.findOne({ serialnumber, access_token });
  if (!request) {
    return res.render('pages/statsByYear', { user: req.session.user, result: { error: 'Không tìm thấy serialnumber hoặc access_token phù hợp' } });
  }
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);
  const GMT7_OFFSET = 7 * 60 * 60 * 1000;

  // Đếm theo từng tháng trong năm
  let stats = [];
  for (let m = 1; m <= 12; m++) {
    const monthStart = new Date(year, m - 1, 1).getTime() - GMT7_OFFSET;
    const monthEnd = new Date(year, m, 0, 23, 59, 59, 999).getTime() - GMT7_OFFSET;
    const count = await SignLog.countDocuments({
      serialnumber,
      type: type.toUpperCase(),
      create_date: { $gte: monthStart, $lte: monthEnd }
    });
    stats.push({ month: m, count });
  }
  res.render('pages/statsByYear', {
    user: req.session.user,
    result: { serialnumber, type, year, stats }
  });
};