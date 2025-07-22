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
