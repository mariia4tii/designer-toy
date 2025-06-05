const Router = require('express');
const router = new Router();
const OrderStatsController = require('../controllers/statsController');
const OOrderStatsController = require('../controllers/OrderStatsController');
// GET /api/order-stats/designer
router.get('/designer', OrderStatsController.getStatsByDesigner);
// routes/orderStats.js

router.get('/:userId', OOrderStatsController.getUserOrders);



module.exports = router;
