const Router = require('express');
const authMiddleware = require("../middleware/authMiddleware")
const BasketController = require('../controllers/BasketController');

const router = new Router();

router.get('/:userId', BasketController.getOne);
router.post('/product/:productId/append', BasketController.append);
router.put('/product/:productId/increment', BasketController.increment);
router.put('/product/:productId/decrement', BasketController.decrement);
router.delete('/basket/:productId', BasketController.clearForUser);
router.put('/clear', BasketController.clear);

module.exports = router;
