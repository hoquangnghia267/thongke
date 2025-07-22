const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const statsByDateController = require('../controllers/statsByDateController');

router.get('/', ensureAuthenticated, statsByDateController.renderForm);
router.post('/', ensureAuthenticated, statsByDateController.handleSubmit);

module.exports = router;
