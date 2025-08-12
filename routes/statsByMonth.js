const express = require('express');
const router = express.Router();
const statsByMonthController = require('../controllers/statsByMonthController');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, statsByMonthController.renderForm);
router.post('/', ensureAuthenticated, statsByMonthController.handleSubmit);

module.exports = router;