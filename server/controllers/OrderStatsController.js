// controllers/orderStats.js
const pool = require('../db');
const ApiError = require('../error/ApiError');

const OrderStatsController = {
    async getUserOrders(req, res, next) {
        try {
            const userId = req.params.userId;

            const orders = await pool.query(`
                SELECT 
                    o.id AS order_id,
                    o.status,
                    o.created_at,
                    u.email,
                    SUM(oi.quantity) AS total_items,
                    SUM(oi.quantity * oi.price) AS total_price
                FROM orders o
                JOIN users u ON o.user_id = u.id
                LEFT JOIN order_items oi ON oi.order_id = o.id
                WHERE o.user_id = $1
                GROUP BY o.id, o.status, o.created_at, u.email
                ORDER BY o.created_at DESC
            `, [userId]);

            res.json(orders.rows);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
};

module.exports = OrderStatsController;
