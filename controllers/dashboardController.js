const SignLog = require('../models/SignLog');
const Request = require('../models/Request');

// Hiển thị form thống kê PDF/XML hoặc theo ngày
exports.renderDashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const type = req.params.type?.toUpperCase() || 'PDF';

  // Nếu là thống kê theo ngày thì render trang riêng
  if (type === 'NGAY') {
    return res.render('pages/statsByDate', {
      user: req.session.user,
      result: null,
      type
    });
  }

  // Mặc định là trang thống kê PDF/XML
  res.render('dashboard', {
    result: null,
    user: req.session.user,
    type
  });
};

// Xử lý thống kê PDF hoặc XML
exports.handleDashboardPost = async (req, res) => {
  const { serialnumber, access_token } = req.body;
  const type = req.params.type?.toUpperCase() || 'PDF';

  if (type === 'NGAY') {
    // Tránh xử lý thống kê ngày ở đây
    return res.redirect('/thongke/ngay');
  }

  const query = { serialnumber, type };
  let expectedCount = null;

  const request = await Request.findOne({ serialnumber, access_token });

  // Nếu là PDF thì bắt buộc phải có request hợp lệ
  if (!request && type === 'PDF') {
    return res.render('dashboard', {
      result: { error: 'Không tìm thấy serialnumber hoặc access_token' },
      user: req.session.user,
      type
    });
  }

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

// Hiển thị form thống kê theo tháng
exports.renderStatsByMonth = (req, res) => {
  res.render('pages/statsByMonth', { user: req.session.user, result: null });
};

// Xử lý thống kê theo tháng
exports.handleStatsByMonth = async (req, res) => {
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

// Hiển thị form thống kê theo năm
exports.renderStatsByYear = (req, res) => {
  res.render('pages/statsByYear', { user: req.session.user, result: null });
};

// Xử lý thống kê theo năm (chia theo tháng)
exports.handleStatsByYear = async (req, res) => {
  const { serialnumber, access_token, year, type } = req.body;
  if (!serialnumber || !access_token || !year || !type) {
    return res.render('pages/statsByYear', { user: req.session.user, result: { error: 'Vui lòng nhập đầy đủ thông tin' } });
  }
  const request = await Request.findOne({ serialnumber, access_token });
  if (!request) {
    return res.render('pages/statsByYear', { user: req.session.user, result: { error: 'Không tìm thấy serialnumber hoặc access_token phù hợp' } });
  }
  const GMT7_OFFSET = 7 * 60 * 60 * 1000;
  let stats = [];
  for (let m = 0; m < 12; m++) {
    const monthStart = new Date(year, m, 1).getTime() - GMT7_OFFSET;
    const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999).getTime() - GMT7_OFFSET;
    const count = await SignLog.countDocuments({
      serialnumber,
      type: type.toUpperCase(),
      create_date: { $gte: monthStart, $lte: monthEnd }
    });
    stats.push({ month: m + 1, count });
  }
  res.render('pages/statsByYear', {
    user: req.session.user,
    result: { serialnumber, type, year, stats }
  });
};
