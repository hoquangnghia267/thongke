const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middlewares/auth');

// Trang thống kê: GET + POST
router.use(ensureAuthenticated); 

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/thongke/pdf');
});
router.get('/:type', ensureAuthenticated, dashboardController.renderDashboard);
router.post('/:type', ensureAuthenticated, dashboardController.handleDashboardPost);


module.exports = router;
