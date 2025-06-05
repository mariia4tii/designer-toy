const pool = require('../db');
const ApiError = require('../error/ApiError'); // если ты его используешь

const OrderStatsController = {
    async getStatsByDesigner(req, res, next) {
        try {
            const result = await pool.query(`
                SELECT 
                    d.name AS designer_name,
                    c.name AS collection_name,
                    SUM(oi.quantity) AS total_quantity
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                JOIN designers d ON d.id = p.designer_id
                JOIN collections c ON c.id = p.collection_id
                WHERE o.status = 'confirmed'
                GROUP BY d.name, c.name
                ORDER BY d.name, total_quantity DESC;
            `);

            res.json(result.rows);
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
            next(ApiError.internal('Ошибка сервера'));
        }
    }
};

module.exports = OrderStatsController;
