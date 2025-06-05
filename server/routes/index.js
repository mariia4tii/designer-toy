const express = require('express');
const Router = express.Router;
const router = new Router();

const collectionRouter = require('./collectionRouter');
const designerRouter = require('./designerRouter');
const productsRouter = require('./productsRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const orderRouter = require('./orderRoutes');
const orderStatsRouter = require('./orderStats');
const designRouter = require('./designRouter'); // если ты в папке /routers

router.use('/user', userRouter);
router.use('/products', productsRouter);
router.use('/designer', designerRouter);
router.use('/collection', collectionRouter);
router.use('/basket', basketRouter);
router.use('/order', orderRouter);
router.use('/order-stats', orderStatsRouter);
router.use('/design', designRouter); // <--- подключили наш маршрут

router.use('/uploads', express.static('uploads'));

module.exports = router;
