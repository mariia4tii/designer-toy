const db = require('../db');

const createOrder = async (req, res, next) => {
    const { userId, customer_name, address, phone, items } = req.body;
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Создание заказа
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, customer_name, address, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [userId, customer_name, address, phone, 'в обработке']
        );
        
        const orderId = orderResult.rows[0].id;

        // Добавление товаров в заказ
        for (let item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Очистка корзины пользователя (сначала basket_product, потом basket)
        await client.query(
            'DELETE FROM basket_product WHERE basket_id IN (SELECT id FROM basket WHERE user_id = $1)',
            [userId]
        );
        await client.query(
            'DELETE FROM basket WHERE user_id = $1',
            [userId]
        );

        // Подтверждение транзакции
        await client.query('COMMIT');
        res.status(200).json({ message: 'Order created successfully!', orderId });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};
const updateOrderStatus = async (req, res, next) => {
    const { orderId, status } = req.body;

    try {
        await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            [status, orderId]
        );
        res.status(200).json({ message: 'Order status updated' });
    } catch (err) {
        next(err);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT o.id, o.customer_name, o.address, o.phone, o.status, o.created_at, u.email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC

        `);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder,updateOrderStatus,getAllOrders, };
