const SignLog = require('../models/SignLog');
const Request = require('../models/Request');

// Hiển thị form thống kê theo tháng
exports.renderForm = (req, res) => {
  res.render('pages/statsByMonth', { user: req.session.user, result: null });
};

// Xử lý thống kê theo tháng
exports.handleSubmit = async (req, res) => {
  const { serialnumber, access_token, month, year, type } = req.body;
  if (!serialnumber || !access_token || !month || !year || !type) {
    return res.render('pages/statsByMonth', { user: req.session.user, result: { error: 'Vui lòng nhập đầy đủ thông tin' } });
  }
  const request = await Request.findOne({ serialnumber, access_token });
  if (!request) {
    return res.render('pages/statsByMonth', { user: req.session.user, result: { error: 'Không tìm thấy serialnumber hoặc access_token phù hợp' } });
  }
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const daysInMonth = end.getDate();
  const GMT7_OFFSET = 7 * 60 * 60 * 1000;

  // Đếm theo từng ngày trong tháng
  let stats = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStart = new Date(year, month - 1, d).getTime() - GMT7_OFFSET;
    const dayEnd = new Date(year, month - 1, d, 23, 59, 59, 999).getTime() - GMT7_OFFSET;
    const count = await SignLog.countDocuments({
      serialnumber,
      type: type.toUpperCase(),
      create_date: { $gte: dayStart, $lte: dayEnd }
    });
    stats.push({ day: d, count });
  }
  res.render('pages/statsByMonth', {
    user: req.session.user,
    result: { serialnumber, type, month, year, stats }
  });
};