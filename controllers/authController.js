const bcrypt = require('bcryptjs');
const User = require('../models/User');

function safeLogBody(body) {
  if (!body) return {};
  const safe = { ...body };
  const sensitiveKeys = ['password', 'token', 'secret', 'key'];
  for (const key of sensitiveKeys) {
    if (safe[key]) safe[key] = '[HIDDEN]';
  }
  return safe;
}

exports.login = async (req, res) => {
  // Debug: Kiểm tra req.body
  console.log("req.body:", safeLogBody(req.body));
  if (!req.body) {
    console.error('req.body is undefined');
    return res.status(400).render('login', { error: 'Dữ liệu gửi lên không hợp lệ' });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
    }

    req.session.user = user;
    res.redirect('/thongke/pdf');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('login', { error: 'Đã có lỗi xảy ra, vui lòng thử lại' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
