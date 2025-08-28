const express = require('express');
const router = express.Router();
const statsByYearController = require('../controllers/statsByYearController');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, statsByYearController.renderForm);
router.post('/', ensureAuthenticated, statsByYearController.handleSubmit);

module.exports = router;