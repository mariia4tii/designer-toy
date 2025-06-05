const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.post('/', OrderController.createOrder);
router.put('/status', OrderController.updateOrderStatus); 
router.get('/all', OrderController.getAllOrders);
module.exports = router;
