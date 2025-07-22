const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu' });

  req.session.user = user;
  res.redirect('/thongke/pdf');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
